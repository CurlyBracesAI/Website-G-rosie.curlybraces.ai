import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Rosie: Intake CRM for Therapy & Wellness Practices',
  description:
    'From first contact to first session. Rosie captures every lead, drafts every follow-up, and hands off seamlessly to your EHR. HIPAA-compliant.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
