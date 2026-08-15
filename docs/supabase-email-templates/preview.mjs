#!/usr/bin/env node
// Render every template on one page with sample values substituted, so the
// whole set can be eyeballed before it is pushed.
//
//   node docs/supabase-email-templates/preview.mjs > preview.html

import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

const sample = {
  SiteURL: 'https://kennerspiel.com',
  ConfirmationURL: 'https://kennerspiel.com/account/confirm?token_hash=sample&type=email',
  TokenHash: 'pkce_0000000000000000000000000000000000000000',
  Token: '481516',
  Email: 'capsuleer@kennerspiel.com',
  NewEmail: 'new-capsuleer@kennerspiel.com',
  OldEmail: 'old-capsuleer@kennerspiel.com',
  Phone: '+1 555 0142',
  OldPhone: '+1 555 0101',
  Provider: 'github',
  FactorType: 'totp',
  RedirectTo: 'https://kennerspiel.com/account',
}

const escape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

// Matches Go template actions of the form {{ .Name }}, which is the only form
// these templates use.
const fill = (html) =>
  html.replaceAll(/\{\{\s*\.(\w+)\s*\}\}/g, (match, name) =>
    name in sample ? sample[name] : match,
  )

const manifest = JSON.parse(await readFile(resolve(here, 'manifest.json'), 'utf8'))

const sections = await Promise.all(
  manifest.map(async (template) => {
    const html = await readFile(resolve(here, template.file), 'utf8')
    return `<section>
  <h2>${escape(template.label)}</h2>
  <p class="meta">${escape(template.name)} &middot; ${escape(template.file)}</p>
  <p class="meta">Subject: ${escape(template.subject)}</p>
  ${fill(html)}
</section>`
  }),
)

process.stdout.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Supabase email templates</title>
<style>
  body { background: #1b1f24; color: #a0b4c8; font-family: system-ui, sans-serif; margin: 0; padding: 32px; }
  h1 { color: #e0eaf2; }
  h2 { color: #e0eaf2; margin-bottom: 4px; }
  section { margin-bottom: 48px; }
  .meta { color: #6b7c8c; font-family: monospace; font-size: 12px; margin: 2px 0; }
</style>
</head>
<body>
<h1>Supabase email templates &mdash; preview</h1>
<p class="meta">Rendered with sample values. Not what the mailer sends verbatim.</p>
${sections.join('\n')}
</body>
</html>
`)
