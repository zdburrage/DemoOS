import Link from 'next/link';

export default function UsingHostedAuthKit() {
  return (
    <main>
      <h1>WorkOS Hosted Login Portak</h1>
      <ul>
        <li>
          <Link href="/using-hosted-authkit/basic">Basic example</Link>
        </li>
        <li>
          <Link href="/using-hosted-authkit/with-nextjs">With Next.js library</Link>
        </li>
        <li>
          <Link href="/using-hosted-authkit/with-session">With session</Link>
        </li>
      </ul>
    </main>
  );
}
