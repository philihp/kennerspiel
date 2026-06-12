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
