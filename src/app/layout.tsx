import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { EmergencyBanner } from '@/components/layout/EmergencyBanner';

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
    <html lang="en" className="dark">
      <body className="antialiased flex flex-col min-h-screen bg-[#080e1e] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        <AuthProvider>
          <EmergencyBanner />
          <Navbar />
          <div className="flex-1 flex w-full">
            <Sidebar />
            <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
