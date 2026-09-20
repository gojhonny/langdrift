import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import test from 'node:test'
import { produce } from 'immer'

// Resolve this feature's extensionless TypeScript imports with Node's type stripping.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      context.parentURL?.includes('/src/components/early-access/') &&
      specifier.startsWith('./') &&
      !specifier.endsWith('.ts')
    ) {
      return nextResolve(`${specifier}.ts`, context)
    }
    return nextResolve(specifier, context)
  }
})

const { earlyAccessFormSchema, getEmailError } = await import(
  '../src/components/early-access/form.validation.ts'
)
const { createEarlyAccessFormState } = await import(
  '../src/components/early-access/form-state.data.ts'
)
const { handleEmailChange, handleEmailBlur, handleFormSubmit } = await import(
  '../src/components/early-access/form.handlers.ts'
)

function createForm() {
  let state = createEarlyAccessFormState()
  let focused = 0
  return {
    get state() {
      return state
    },
    get focused() {
      return focused
    },
    update(recipe) {
      state = produce(state, recipe)
    },
    focus() {
      focused += 1
    }
  }
}

test('schema trims before validation and preserves personal domains, case and aliases', () => {
  const parsed = earlyAccessFormSchema.safeParse({
    email: '  First.Last+Launch@gmail.com  '
  })
  assert.equal(parsed.success, true)
  assert.equal(parsed.data.email, 'First.Last+Launch@gmail.com')
})

test('schema exposes known codes for missing, malformed and excessive input', () => {
  assert.equal(getEmailError(''), 'emailRequired')
  assert.equal(getEmailError('   '), 'emailRequired')
  assert.equal(getEmailError(undefined), 'emailRequired')
  for (const email of [null, 42, {}, 'hello', 'hello@', 'a b@example.com']) {
    assert.equal(getEmailError(email), 'emailInvalid')
  }
  const atLimit = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(61)}`
  assert.equal(atLimit.length, 254)
  assert.equal(getEmailError(atLimit), null)
  assert.equal(getEmailError(`${atLimit}x`), 'emailTooLong')
})

test('each form receives fresh nested state', () => {
  const first = createEarlyAccessFormState()
  const second = createEarlyAccessFormState()
  first.fieldErrors.email = 'emailRequired'
  first.email = 'one@example.com'
  assert.equal(second.fieldErrors.email, null)
  assert.equal(second.email, '')
  assert.equal(second.status, 'idle')
  assert.equal(second.hasInteractedWithEmail, false)
})

test('typing stays raw and quiet until blur, then correction clears the error', () => {
  const form = createForm()
  handleEmailChange('  invalid ', false, form.update)
  assert.equal(form.state.email, '  invalid ')
  assert.equal(form.state.fieldErrors.email, null)
  handleEmailBlur(form.state.email, form.update)
  assert.equal(form.state.hasInteractedWithEmail, true)
  assert.equal(form.state.fieldErrors.email, 'emailInvalid')
  handleEmailChange(' person@example.com ', true, form.update)
  assert.equal(form.state.email, ' person@example.com ')
  assert.equal(form.state.fieldErrors.email, null)
})

test('valid blur clears a stale error and retains touched state', () => {
  const form = createForm()
  handleEmailBlur('', form.update)
  assert.equal(form.state.fieldErrors.email, 'emailRequired')
  handleEmailBlur('fixed@example.com', form.update)
  assert.equal(form.state.fieldErrors.email, null)
  assert.equal(form.state.hasInteractedWithEmail, true)
})

test('invalid submission focuses the field; a corrected submission uses parsed text', () => {
  const form = createForm()
  handleEmailChange('bad', false, form.update)
  handleFormSubmit(form.state.email, form.update, form.focus)
  assert.equal(form.focused, 1)
  assert.equal(form.state.status, 'idle')
  assert.equal(form.state.email, 'bad')
  assert.equal(form.state.fieldErrors.email, 'emailInvalid')
  assert.equal(form.state.hasInteractedWithEmail, true)

  handleEmailChange('  Person+Launch@example.com  ', true, form.update)
  handleFormSubmit(form.state.email, form.update, form.focus)
  assert.equal(form.focused, 1)
  assert.equal(form.state.status, 'valid')
  assert.equal(form.state.email, 'Person+Launch@example.com')
  assert.equal(form.state.fieldErrors.email, null)
})

test('editing after validation clears obsolete validity feedback', () => {
  const form = createForm()
  handleFormSubmit('person@example.com', form.update, form.focus)
  assert.equal(form.state.status, 'valid')
  handleEmailChange('person@', true, form.update)
  assert.equal(form.state.status, 'idle')
  assert.equal(form.state.fieldErrors.email, 'emailInvalid')
})

test('draft recipes are replayable and focus is outside state updates', () => {
  const initial = createEarlyAccessFormState()
  let result
  let focused = 0
  handleFormSubmit(
    '',
    (recipe) => {
      const first = produce(initial, recipe)
      result = produce(initial, recipe)
      assert.deepEqual(result, first)
      assert.equal(focused, 0)
    },
    () => {
      focused += 1
    }
  )
  assert.equal(focused, 1)
  assert.equal(result.fieldErrors.email, 'emailRequired')
  assert.equal(initial.fieldErrors.email, null)
})

test('invalid blur cannot leave an obsolete valid announcement', () => {
  const form = createForm()
  handleFormSubmit('person@example.com', form.update, form.focus)
  handleEmailBlur('person@', form.update)
  assert.equal(form.state.status, 'idle')
  assert.equal(form.state.fieldErrors.email, 'emailInvalid')
})
