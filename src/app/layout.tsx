import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import FloodStoreProvider from '@/components/providers/FloodStoreProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bahala — Community Flood Awareness Map',
  description:
    'Community-driven flood awareness platform. Report, verify, and track flooding in your area in real time.',
  keywords: ['flood', 'awareness', 'community', 'Philippines', 'map', 'report'],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 font-[family-name:var(--font-geist-sans)]">
        <FloodStoreProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </FloodStoreProvider>
      </body>
    </html>
  );
}
