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
      <h2>Play with Claude</h2>
      <p>
        You can also let Claude take a seat at your table. Add Kennerspiel as a custom connector in Claude and it can
        list your games, read the board, and play moves on your behalf — useful for solo learning, AI-vs-AI matches, or
        just having a patient opponent at 2am.
      </p>
      <ol>
        <li>
          In Claude, open <strong>Settings → Connectors → Add custom connector</strong>.
        </li>
        <li>
          Paste this URL: <code>https://kennerspiel.com/api/mcp</code>
        </li>
        <li>Click Add, then sign in to Kennerspiel when Claude opens the authorization page.</li>
      </ol>
      <p>
        That&apos;s it — no client IDs, no secrets, no copy-pasting. After authorizing, ask Claude something like
        &ldquo;list my Ora et Labora games&rdquo; and it&apos;ll find this server&apos;s tools.
      </p>
      <p>
        Source code is available at{' '}
        <Link href="https://github.com/philihp/kennerspiel">github.com/philihp/kennerspiel</Link>
      </p>
    </main>
  )
}

export default Home
