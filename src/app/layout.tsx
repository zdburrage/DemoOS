import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import BackLink from './back-link';
import '@radix-ui/themes/styles.css'; 


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Demo OS',
  description: 'A collection of examples for the WorkOS API/SDK',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BackLink />
        {children}
      </body>
    </html>
  );
}
