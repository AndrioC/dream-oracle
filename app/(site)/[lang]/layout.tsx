import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/site/footer-section';
import LanguageSelectorHeader from '@/components/site/language-selector';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

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
  let messages;
  try {
    messages = await getMessages(lang);
  } catch (error) {
    console.log(error);
    notFound();
  }

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
