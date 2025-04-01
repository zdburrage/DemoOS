'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BackLink() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  return <Link href="/">Home</Link>;
}
