// Minimal MCP tool-result shapes, returned by every tool in src/mcp/tools.

export type ToolResult = {
  content: { type: 'text'; text: string }[]
  isError?: boolean
}

export const jsonResult = (data: unknown): ToolResult => ({
  content: [{ type: 'text', text: JSON.stringify(data) }],
})

export const errorResult = (message: string): ToolResult => ({
  isError: true,
  content: [{ type: 'text', text: message }],
})

export const agentProfileId = (): string => {
  const id = process.env.AGENT_PROFILE_ID
  if (!id) throw new Error('AGENT_PROFILE_ID is not configured')
  return id
}
