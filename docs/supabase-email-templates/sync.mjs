#!/usr/bin/env node
// Sync the committed email templates in this directory to a hosted Supabase
// project via the Management API.
//
//   node docs/supabase-email-templates/sync.mjs           push templates that differ
//   node docs/supabase-email-templates/sync.mjs --check   report drift, change nothing
//   node docs/supabase-email-templates/sync.mjs --print    dump the payload, no network
//
// Requires SUPABASE_ACCESS_TOKEN (a personal access token) and
// SUPABASE_PROJECT_REF. Only the mailer subject/content fields listed in
// manifest.json are touched — every other auth setting is left alone.

import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const API = process.env.SUPABASE_API_URL ?? 'https://api.supabase.com'

const mode = process.argv[2] ?? '--push'
if (!['--push', '--check', '--print'].includes(mode)) {
  console.error(`unknown mode ${mode}; expected --push, --check, or --print`)
  process.exit(2)
}

const manifest = JSON.parse(await readFile(resolve(here, 'manifest.json'), 'utf8'))

const desired = {}
for (const template of manifest) {
  desired[template.subjectField] = template.subject
  desired[template.contentField] = await readFile(resolve(here, template.file), 'utf8')
}

if (mode === '--print') {
  console.log(JSON.stringify(desired, null, 2))
  process.exit(0)
}

const token = process.env.SUPABASE_ACCESS_TOKEN
const ref = process.env.SUPABASE_PROJECT_REF
if (!token || !ref) {
  console.error('SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF must both be set')
  process.exit(2)
}

const call = async (method, body) => {
  let response
  try {
    response = await fetch(`${API}/v1/projects/${ref}/config/auth`, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
  } catch (cause) {
    console.error(`${method} ${API}/v1/projects/${ref}/config/auth could not be reached: ${cause.message}`)
    process.exit(1)
  }
  if (!response.ok) {
    // The body can echo config values back, so surface the status and let the
    // operator pull details from the dashboard rather than printing it here.
    console.error(`${method} /v1/projects/${ref}/config/auth failed: ${response.status} ${response.statusText}`)
    process.exit(1)
  }
  return response.json()
}

// Remote stores what the dashboard editor last saved, which may differ only in
// line endings or trailing whitespace. Those are not real drift.
const normalize = (value) => (value ?? '').replaceAll('\r\n', '\n').trim()

const remote = await call('GET')
const drifted = Object.keys(desired).filter((field) => normalize(remote[field]) !== normalize(desired[field]))

if (drifted.length === 0) {
  console.log(`up to date: all ${manifest.length} templates match project ${ref}`)
  process.exit(0)
}

for (const field of drifted) {
  console.log(`${mode === '--check' ? 'drift' : 'update'}: ${field}`)
}

if (mode === '--check') {
  console.error(`${drifted.length} field(s) differ from project ${ref}`)
  process.exit(1)
}

await call('PATCH', Object.fromEntries(drifted.map((field) => [field, desired[field]])))
console.log(`pushed ${drifted.length} field(s) to project ${ref}`)
