import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { EmergencyBanner } from '@/components/layout/EmergencyBanner';
import { AiConciergeChat } from '@/components/ai/AiConciergeChat';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Pramila Apartments — Full-Stack Apartment & Rental Management Platform',
  description:
    'Comprehensive real-world residential property management system for flats, tenants, rent, bills, QR visitor passes, security gate ops, maintenance, and reports.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-800 selection:text-amber-300">
        <AuthProvider>
          <EmergencyBanner />
          <Navbar />
          <div className="flex-1 flex w-full">
            <Sidebar />
            <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>
          </div>
          <Footer />
          <AiConciergeChat />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
