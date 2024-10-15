import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '../../components/site/footer-section';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dream Oracle - Interpretação de Sonhos por IA',
  description:
    'Descubra o significado dos seus sonhos com interpretação por IA e geração de imagens únicas.',
  keywords: [
    'interpretação de sonhos',
    'IA',
    'geração de imagens',
    'análise de sonhos',
  ],
  authors: [{ name: 'Dream Oracle Team' }],
  openGraph: {
    title: 'Dream Oracle - Interpretação de Sonhos por IA',
    description:
      'Descubra o significado dos seus sonhos com interpretação por IA e geração de imagens únicas.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <header>
          {/* Adicione aqui o componente de header global, se necessário */}
        </header>
        <main>{children}</main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
