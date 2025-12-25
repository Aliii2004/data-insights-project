import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Data Insights Agent',
  description: 'Chat with your database using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
