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
      <p>
        Both Claude.ai and ChatGPT can connect via the <code>https://kennerspiel.com/api/mcp</code> connector. Add it
        once at the account level and you&apos;ll be able to play any game from any conversation.
      </p>
      <h3>Claude.ai</h3>
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
        Once authorized, you can play in two ways:
      </p>
      <ul>
        <li>
          List your games: ask Claude something like &ldquo;list my Ora et Labora games&rdquo; and it&apos;ll find the
          tools automatically.
        </li>
        <li>
          Quick play: just share a game URL and ask &ldquo;please play as white in https://kennerspiel.com/instance/&lt;uuid&gt;&rdquo;.
        </li>
      </ul>
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
        Alternatively, if you prefer the command line, you can add the connector with:
      </p>
      <pre>
        <code>claude mcp add --transport http kennerspiel https://kennerspiel.com/api/mcp</code>
      </pre>
      <p>
        Source code is available at{' '}
        <Link href="https://github.com/philihp/kennerspiel">github.com/philihp/kennerspiel</Link>
      </p>
    </main>
  )
}

export default Home
