#!/bin/sh
set -eu

repo_root=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
package_fixture=$(mktemp -d "${TMPDIR:-/tmp}/langdrift-packages.XXXXXX")
trap 'rm -rf "$package_fixture"' EXIT HUP INT TERM

cd "$repo_root"
pnpm --filter @langdrift/sdk build
pnpm --filter @langdrift/setup build
pnpm --filter @langdrift/sdk pack --pack-destination "$package_fixture"
pnpm --filter @langdrift/setup pack --pack-destination "$package_fixture"

for package_tarball in "$package_fixture"/*.tgz; do
  tar -tzf "$package_tarball" > "$package_fixture/contents.txt"
  if ! awk '
    /^package\/dist\// { next }
    /^package\/(package.json|README.md|CHANGELOG.md)$/ { next }
    { print "Unexpected package file: " $0; failed = 1 }
    END { exit failed }
  ' "$package_fixture/contents.txt"; then
    exit 1
  fi
  printf 'Verified package contents: %s\n' "$(basename "$package_tarball")"
done

mkdir "$package_fixture/consumer"
cd "$package_fixture/consumer"
printf '{"name":"langdrift-consumer-fixture","private":true,"type":"module"}\n' > package.json
npm install --ignore-scripts --no-audit --no-fund --package-lock=false "$package_fixture"/*.tgz
test ! -e .drifts
./node_modules/.bin/langdrift setup --root . --project-id project_fixture --account-id account_fixture --name 'Fixture Product' --json > first-setup.json
./node_modules/.bin/langdrift setup --root . --json > repeated-setup.json

cat > consumer.ts <<'TS'
import { createPayload, discoverArtifacts, loadProject, type PayloadEnvelope } from '@langdrift/sdk'
import { setupProject } from '@langdrift/setup'
import { SCHEMA_VERSION } from '@langdrift/sdk/schema'
await setupProject({ root: '.', dryRun: true })
const project = await loadProject('.')
const artifacts = await discoverArtifacts('.')
const envelope: PayloadEnvelope = createPayload(project, artifacts[0])
const version: 1 = SCHEMA_VERSION
void [envelope, version]
TS
"$repo_root/node_modules/.bin/tsc" --noEmit --strict --skipLibCheck --module NodeNext --moduleResolution NodeNext --target ES2023 consumer.ts

node --input-type=module <<'NODE'
import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { discoverArtifacts, loadProject, resolveReferences, sendPayload } from '@langdrift/sdk'
import { projectSchema, pillarSchemas } from '@langdrift/sdk/schema'
import { integrationCapabilities } from '@langdrift/sdk/integrations'
assert.equal(projectSchema.$schema, 'https://json-schema.org/draft/2020-12/schema')
assert.deepEqual(Object.keys(pillarSchemas).sort(), ['evidence', 'loop', 'vision'])
assert.equal(integrationCapabilities.github, 'deterministic-fixture-mapper')
const root = process.cwd()
await mkdir('.drifts/vision/prd', { recursive: true })
await writeFile('.drifts/vision/prd/first.md', '---\nlangdrift:\n  type: prd\n  schema_version: 1\n  id: PRD-001\n  title: First product\n  owners: [user_42]\n---\n# Product Vision\n')
const artifacts = await discoverArtifacts(root)
assert.equal(artifacts.length, 1)
assert.deepEqual((await resolveReferences(root, artifacts)).issues, [])
const project = await loadProject(root)
let received
await sendPayload(project, artifacts[0], {
  async send(payload, context) {
    assert.equal(context.authorization, 'temporary-fixture-token')
    received = payload
    return { correlationId: 'fixture-request' }
  }
}, { credentialRef: 'env:FIXTURE_TOKEN', environment: { FIXTURE_TOKEN: 'temporary-fixture-token' } })
assert.equal(received.resource, 'vision.prd')
assert.equal(received.project_id, 'project_fixture')
assert.equal(received.payload.body, '# Product Vision\n')
assert.equal(JSON.stringify(received).includes('temporary-fixture-token'), false)
const repeated = JSON.parse(await readFile('repeated-setup.json', 'utf8'))
assert.equal(repeated.changed, false)
console.log('Packed consumer verified: explicit setup → Markdown → schema → references → authenticated mock transport; repeat setup unchanged.')
NODE
