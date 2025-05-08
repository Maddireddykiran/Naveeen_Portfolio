import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { siteConfig } from '@/config';
import '@/app/globals.css';
import { ThemeProvider } from './provider';
import { initKVStore } from '@/lib/vercel-kv-service';

// Initialize Vercel KV Store on app start
initKVStore().catch(console.error);

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
