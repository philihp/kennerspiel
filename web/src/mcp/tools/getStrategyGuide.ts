import { readFileSync } from 'fs'
import { join } from 'path'
import { ToolResult } from '../content'

// Lazy-loaded so the readFileSync runs at request time (Vercel runtime, /var/task),
// not at build time (process.cwd() differs between build and runtime environments).
// The file is bundled via outputFileTracingIncludes in next.config.mjs.
let guide: string | undefined
const loadGuide = (): string => {
  if (!guide) guide = readFileSync(join(process.cwd(), 'docs/ora-et-labora-strategy-SKILL.md'), 'utf-8')
  return guide
}

export const getStrategyGuide = (): ToolResult => ({
  content: [{ type: 'text', text: loadGuide() }],
})
