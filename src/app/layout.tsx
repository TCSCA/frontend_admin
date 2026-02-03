import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { SpinnerProvider } from '@/context/SpinnerContext';
import SpinnerWrapper from '@/components/SpinnerWrapper';
import { Toaster } from "@/components/ui/toaster";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Interfaz Administrativa",
  description: "Sistema de interfaz administrativa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <SpinnerProvider>
          <SpinnerWrapper>
            {children}
            <Toaster />
          </SpinnerWrapper>
        </SpinnerProvider>
      </body>
    </html>
  );
}
