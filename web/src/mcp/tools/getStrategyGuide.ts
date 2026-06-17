import { readFileSync } from 'fs'
import { join } from 'path'
import { ToolResult } from '../content'

// Lazy-loaded so the readFileSync runs at request time, not at build time.
// next.config.mjs sets outputFileTracingRoot to the monorepo root and bundles
// docs/ora-et-labora-strategy-SKILL.md relative to it, so the file ships to
// <root>/docs/... . On Vercel the function's cwd is the Next app dir (<root>/web),
// so resolve up one level to reach the tracing root where docs/ lives.
let guide: string | undefined
const loadGuide = (): string => {
  if (!guide) guide = readFileSync(join(process.cwd(), '..', 'docs/ora-et-labora-strategy-SKILL.md'), 'utf-8')
  return guide
}

export const getStrategyGuide = (): ToolResult => ({
  content: [{ type: 'text', text: loadGuide() }],
})
