import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/components/providers/LanguageContext';
import FirebaseAnalytics from '@/components/providers/FirebaseAnalytics';

export const metadata: Metadata = {
  title: 'MedicalPress Hospital | Advanced Healthcare & Compassionate Care',
  description: 'International standard hospital providing world-class cardiology, neurology, orthopedics, emergency medicine, and compassionate patient-centered healthcare.',
  keywords: 'hospital, doctors, medical appointments, cardiology, pediatrics, emergency, health packages',
  openGraph: {
    title: 'MedicalPress Hospital — Compassionate International Healthcare',
    description: 'Book consultations with world-class specialists and access 24/7 Level 1 Trauma Care.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Adsterra Ad Scripts */}
        <Script
          src="https://pl31231098.profitableratecpmnetwork.com/2e/c1/8b/2ec18bfe189793d1898f34ae2cd960a5.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://pl31231099.profitableratecpmnetwork.com/ab/fd/6d/abfd6d1e41423b49bab1e2df344f3bba.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-text-primary">
        <LanguageProvider>
          <FirebaseAnalytics />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
