import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
  weight: ['400', '500', '700'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhandbhaktisagar.com';
const siteName = 'अखंड भक्ति सागर';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - भजन, आरती, चालीसा, मंत्र और स्तोत्र`,
    template: `%s | ${siteName}`,
  },
  description:
    'अखंड भक्ति सागर - हिंदी भजन, आरती, चालीसा, मंत्र, स्तोत्र और भक्ति साहित्य का सबसे बड़ा संग्रह। पढ़ें, सुनें और ईश्वर की भक्ति में डूब जाएं।',
  keywords: [
    'भजन',
    'आरती',
    'चालीसा',
    'मंत्र',
    'स्तोत्र',
    'bhajan',
    'aarti',
    'chalisa',
    'mantra',
    'stotra',
    'hindi devotional',
    'hanuman chalisa',
    'shiv stuti',
    'भक्ति',
    'devotional songs hindi',
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    alternateLocale: 'en_IN',
    url: siteUrl,
    siteName,
    title: `${siteName} - भजन, आरती, चालीसा, मंत्र और स्तोत्र`,
    description:
      'हिंदी भजन, आरती, चालीसा, मंत्र और स्तोत्र का विशाल संग्रह। भक्ति में मन लगाएं।',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - भजन, आरती, चालीसा`,
    description: 'हिंदी भजन, आरती, चालीसा, मंत्र और स्तोत्र का विशाल संग्रह।',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={`${inter.variable} ${notoSansDevanagari.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
