import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { StudyProvider } from '@/contexts/StudyContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OctoGenius.ai - Guia de Estudos Personalizado',
  description: 'Plataforma adaptativa de estudos para vestibulares e ENEM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <StudyProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              {children}
              <Toaster />
            </ThemeProvider>
          </StudyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}