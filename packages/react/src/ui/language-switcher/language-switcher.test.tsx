import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LanguageSwitcher } from './language-switcher'

afterEach(cleanup)

const options = [
  {
    locale: 'en',
    label: 'EN',
    name: 'English',
    href: '/settings?view=all#language'
  },
  {
    locale: 'pt-BR',
    label: 'PT-BR',
    name: 'Português',
    href: '/pt-BR/settings?view=all#language'
  }
] as const

describe('LanguageSwitcher', () => {
  it('supports a disabled preference control without inventing language URLs', () => {
    const onLocaleChange = vi.fn()
    const buttonOptions = options.map(({ locale, label, name }) => ({
      locale,
      label,
      name
    }))
    const { rerender } = render(
      <LanguageSwitcher
        currentLocale="en"
        label="Language"
        onLocaleChange={onLocaleChange}
        options={buttonOptions}
      />
    )

    expect(screen.getByRole('group', { name: 'Language' })).toBeTruthy()
    expect(screen.queryByRole('link')).toBeNull()
    expect(
      screen
        .getByRole('button', { name: 'English' })
        .getAttribute('aria-pressed')
    ).toBe('true')
    expect(
      screen
        .getByRole('button', { name: 'Português' })
        .getAttribute('aria-pressed')
    ).toBe('false')
    fireEvent.click(screen.getByRole('button', { name: 'Português' }))
    expect(onLocaleChange).toHaveBeenCalledWith('pt-BR')

    rerender(
      <LanguageSwitcher
        currentLocale="en"
        disabled
        label="Language"
        onLocaleChange={onLocaleChange}
        options={buttonOptions}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Português' }))
    expect(onLocaleChange).toHaveBeenCalledTimes(1)
  })

  it('exposes named native links and identifies only the selected language', () => {
    render(
      <LanguageSwitcher
        currentLocale="pt-BR"
        label="Language"
        options={options}
      />
    )

    expect(screen.getByRole('navigation', { name: 'Language' })).toBeTruthy()
    const english = screen.getByRole('link', { name: 'English' })
    const portuguese = screen.getByRole('link', { name: 'Português' })
    expect(english.getAttribute('href')).toBe(options[0].href)
    expect(english.getAttribute('aria-current')).toBeNull()
    expect(portuguese.getAttribute('href')).toBe(options[1].href)
    expect(portuguese.getAttribute('hrefLang')).toBe('pt-BR')
    expect(portuguese.getAttribute('aria-current')).toBe('page')
  })

  it('lets a router adapter preserve anchor semantics and own navigation events', () => {
    const navigate = vi.fn()
    render(
      <LanguageSwitcher
        currentLocale="en"
        label="Language"
        options={options}
        renderLink={(option, linkProps) => (
          <a
            {...linkProps}
            href={linkProps.href}
            onClick={(event) => {
              navigate(option.locale, event.ctrlKey, event.defaultPrevented)
              event.preventDefault()
            }}
          />
        )}
      />
    )

    const portuguese = screen.getByRole('link', { name: 'Português' })
    fireEvent.click(portuguese, { ctrlKey: true })
    expect(navigate).toHaveBeenCalledWith('pt-BR', true, false)
    expect(portuguese.getAttribute('href')).toBe(options[1].href)
    expect(
      screen.getByRole('link', { name: 'English' }).getAttribute('aria-current')
    ).toBe('page')
  })
})
