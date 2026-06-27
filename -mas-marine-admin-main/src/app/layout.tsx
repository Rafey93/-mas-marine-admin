import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Andros Marine Institute — Admin',
  description: 'Admin panel for Andros Marine Institute eLearning platform',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
