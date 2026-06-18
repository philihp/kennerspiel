import Link from 'next/link'

const Home = () => {
  return (
    <main>
      <h1>Kennerspiel</h1>
      <p>
        Hi! This is a place to play turn-based board games on virtual tables with minimal client overhead. It&apos;s not
        much too look at right now, but I coded all of this by hand without any AI assistance, so please give me that
        much.
      </p>
      <p>
        You&apos;ll probably want to start out by creating an <Link href="/instance/">instance</Link>, and either play a
        solo game or invite some friends.
      </p>
      <h2>Play with an AI</h2>
      <p>
        Kennerspiel has an <Link href="https://modelcontextprotocol.io/">MCP</Link> server. Any MCP-compatible AI can
        take a seat at your table — it will read the board, consult a built-in strategy guide, and play moves on your
        behalf. Useful for solo learning, AI-vs-AI matches, or just having a patient opponent at 2am.
      </p>
      <p>Two ways to connect, both backed by the same OAuth session:</p>
      <ul>
        <li>
          <strong>Hub</strong>: <code>https://kennerspiel.com/api/mcp</code> — exposes every tool. This is the one to
          use for claude.ai or ChatGPT integrations: add the connector once at the account level and you&apos;ll be able
          to play any game from any conversation.
        </li>
        <li>
          <strong>Per-game</strong>: the URL of any game is also its MCP endpoint. Drop{' '}
          <code>https://kennerspiel.com/instance/&lt;uuid&gt;</code> into a chat and say &ldquo;join as white&rdquo; —
          the agent gets the play-the-game tools scoped to that one game (no <code>instance_id</code> argument needed
          because the URL already names it). Handy for Claude Code projects or one-off chats.
        </li>
      </ul>
      <h3>Claude (claude.ai)</h3>
      <ol>
        <li>
          Open <strong>Settings → Integrations → Add integration</strong>.
        </li>
        <li>
          Paste this URL: <code>https://kennerspiel.com/api/mcp</code>
        </li>
        <li>Sign in to Kennerspiel when Claude opens the authorization page, then click Authorize.</li>
      </ol>
      <p>
        Once authorized, the same token also covers any per-game URL — no re-auth when you switch games. Ask Claude
        something like &ldquo;list my Ora et Labora games&rdquo; and it&apos;ll find the tools automatically.
      </p>
      <h3>Claude Code</h3>
      <p>Add the hub once:</p>
      <pre>
        <code>claude mcp add --transport http kennerspiel https://kennerspiel.com/api/mcp</code>
      </pre>
      <p>Or wire up one specific game directly:</p>
      <pre>
        <code>claude mcp add --transport http my-game https://kennerspiel.com/instance/&lt;uuid&gt;</code>
      </pre>
      <p>Claude Code opens a browser for the OAuth flow and redirects back automatically.</p>
      <h3>ChatGPT</h3>
      <p>Requires a Plus, Pro, Business, or Enterprise account with Developer mode enabled.</p>
      <ol>
        <li>
          Open <strong>Settings → Connectors → Create</strong>.
        </li>
        <li>
          Paste this URL: <code>https://kennerspiel.com/api/mcp</code>
        </li>
        <li>ChatGPT discovers the OAuth endpoints automatically and redirects you here to authorize.</li>
      </ol>
      <p>
        Source code is available at{' '}
        <Link href="https://github.com/philihp/kennerspiel">github.com/philihp/kennerspiel</Link>
      </p>
    </main>
  )
}

export default Home
