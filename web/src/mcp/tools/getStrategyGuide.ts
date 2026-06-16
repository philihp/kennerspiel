import guide from '../../../../docs/ora-et-labora-strategy-SKILL.md'
import { ToolResult } from '../content'

export const getStrategyGuide = (): ToolResult => ({
  content: [{ type: 'text', text: guide }],
})
