import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <div>
        <img src="./favicon.ico" className='object-contain h-48 w-96 m-4 justify-self-center'></img>
        <h1>WorkOS Examples</h1>
        <ul>
          <li>
            <Link href="/using-your-own-ui">Self Hosted Login (WorkOS API)</Link>
          </li>
          <li>
            <Link href="/using-hosted-authkit/basic">WorkOS Hosted Login Portal (AuthKit)</Link>
          </li>
          <li>
            <Link href="/admin-portal">Organization Setup via Admin Portal</Link>
          </li>
          <li>
            <Link href="/audit-logs">Audit Logs</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
