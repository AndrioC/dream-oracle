import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/site/footer-section';
import LanguageSelectorHeader from '@/components/site/language-selector';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

async function getMessages(lang: string) {
  try {
    return (await import(`@/messages/${lang}.json`)).default;
  } catch (error) {
    console.log(error);
    notFound();
  }
}

async function getMetadata(lang: string): Promise<Metadata> {
  const messages = await getMessages(lang);
  return {
    metadataBase: new URL('http://localhost:3000'),
    title: messages.metadata.title,
    description: messages.metadata.description,
    keywords: messages.metadata.keywords,
    authors: [{ name: messages.metadata.authorName }],
    openGraph: {
      title: messages.metadata.ogTitle,
      description: messages.metadata.ogDescription,
      images: ['/og-image.jpg'],
    },
  };
}

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string };
}): Promise<Metadata> {
  unstable_setRequestLocale(lang);
  return getMetadata(lang);
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'pt' }];
}

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  unstable_setRequestLocale(lang);
  const messages = await getMessages(lang);

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <header>
            <LanguageSelectorHeader />
          </header>
          <main>{children}</main>
          <footer>
            <Footer />
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
