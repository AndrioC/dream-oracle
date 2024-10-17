import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/header';
import 'react-toastify/dist/ReactToastify.css';

import Favicon from '/public/favicon.png';

import { auth } from '@/auth';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Dream Oracle - AI Dream Interpretation',
  description:
    'Discover the meaning of your dreams with AI interpretation and unique image generation.',

  icons: [
    {
      rel: 'icon',
      url: Favicon.src,
      type: 'image/png',
    },
  ],
};

async function AuthenticatedHeader() {
  const session = await auth();
  if (session?.user) {
    return <Header />;
  }
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <Providers>
          <ToastContainer />
          <div className="min-h-screen flex flex-col">
            <AuthenticatedHeader />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
