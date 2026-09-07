import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EmergencyFloat from '@/components/layout/EmergencyFloat';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between pb-16 md:pb-0">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <EmergencyFloat />
    </div>
  );
}
