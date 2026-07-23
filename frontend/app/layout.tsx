import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InvoNest | AI Cash Flow Intelligence & Invoice Recovery',
  description: 'Predict cash flow before it becomes a problem. Auto-assess risk, parse documents via OCR, and run digital twin simulations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white dark:bg-[#09090b] text-[#0d2227] dark:text-zinc-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
