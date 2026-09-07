import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/providers/LanguageContext';

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
      <body className="antialiased min-h-screen flex flex-col bg-background text-text-primary">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
