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
      <p>
        Source code is available at{' '}
        <Link href="https://github.com/philihp/kennerspiel">github.com/philihp/kennerspiel</Link>
      </p>
    </main>  )
}

export default Home
