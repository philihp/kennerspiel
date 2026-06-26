import Link from 'next/link'

const Home = () => {
  return (
    <main>
      <h2>Kennerspiel</h2>
      <p>
        Hi! This is a place to play turn-based open-information and deterministic board games on virtual tables with
        minimal client overhead. I started out with Uwe Rosenberg&apos;s game{' '}
        <Link href="https://amzn.to/3P1UYDe">Ora et Labora</Link>, and I&apos;ve been having fun teaching Claude how
        to play it with me. It&apos;s a work in progress, but playable right now.
      </p>

      <h3>Quickstart</h3>
      <p>
        Create an <Link href="/instance/">instance</Link> and share the URL with friends.
      </p>

      <h3>Connect your AI to Kennerspiel</h3>
      <ul>
        <li>
          <strong>(Claude)</strong> Customize → Connectors → Add Custom Connector.
        </li>
        <li>
          <strong>(ChatGPT)</strong> Settings → Apps (or Apps & connectors) → Enable Developer mode if prompted. →
          Click Create App (or Add custom connector on some accounts).
        </li>
      </ul>
      <p>
        Add <code>https://kennerspiel.com/api/mcp</code>, your agent will attempt to OAuth to this site
      </p>

      <h3>Play a game with AI</h3>
      <p>
        Create an <Link href="/instance/">instance</Link>, and during setup give your AI the instance ID. You can say
        something like
      </p>
      <blockquote>
        Please join https://kennerspiel.com/instance/ff801bac-4070-4870-93d2-b80190be9000 and play as green and white
      </blockquote>
      <p>
        Your AI can play as multiple players, and will download an internally developed{' '}
        <Link href="https://github.com/philihp/kennerspiel/blob/main/docs/ora-et-labora-strategy-SKILL.md">skill</Link>
      </p>

      <p>
        Source code is available at{' '}
        <Link href="https://github.com/philihp/kennerspiel">github.com/philihp/kennerspiel</Link>
      </p>
    </main>
  )
}

export default Home
