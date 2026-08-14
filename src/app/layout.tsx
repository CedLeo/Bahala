import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import MobileBottomNav from '@/components/ui/MobileBottomNav';
import FloodStoreProvider from '@/components/providers/FloodStoreProvider';
import ServiceWorkerProvider from '@/components/providers/ServiceWorkerProvider';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';
import InstallPrompt from '@/components/pwa/InstallPrompt';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};

export const metadata: Metadata = {
  title: 'Bahala — Community Flood Awareness Map',
  description:
    'Community-driven flood awareness platform. Report, verify, and track flooding in your area in real time.',
  keywords: ['flood', 'awareness', 'community', 'Philippines', 'map', 'report'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bahala',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 font-[family-name:var(--font-geist-sans)] overscroll-none">
        <ServiceWorkerProvider />
        <OfflineIndicator />
        <FloodStoreProvider>
          <Navbar />
          <main className="flex-1 flex flex-col pb-16 md:pb-0">{children}</main>
          <MobileBottomNav />
          <InstallPrompt />
        </FloodStoreProvider>
      </body>
    </html>
  );
}
