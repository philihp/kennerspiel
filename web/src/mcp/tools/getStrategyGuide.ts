import { readFileSync } from 'fs'
import { join } from 'path'
import { ToolResult } from '../content'

// Loaded once at module init; bundled via outputFileTracingIncludes in next.config.mjs.
// Path is relative to the monorepo root (outputFileTracingRoot).
const GUIDE = readFileSync(join(process.cwd(), 'docs/ora-et-labora-strategy-SKILL.md'), 'utf-8')

export const getStrategyGuide = (): ToolResult => ({
  content: [{ type: 'text', text: GUIDE }],
})
