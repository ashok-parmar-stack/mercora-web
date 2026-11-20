import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { GlobalWheelHandler } from '../components/common/GlobalWheelHandler';
import { Providers } from './providers';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

/**
 * ──────────────────────────────────────────────────────────────────────────
 * MERCORA GLOBAL TYPOGRAPHY SYSTEM — USER STORIES & ROLES
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Mercora operates strictly on FOUR approved font families:
 * 1. PLUS JAKARTA SANS (Brand & Display)
 * 2. RETHINK SANS (Navigation & Interface)
 * 3. WORK SANS (Content & Long-Form Body)
 * 4. INSTRUMENT SANS (Data, Metrics & Tabular Information)
 * Loaded safely via CSS @import in globals.css for maximum resilience.
 * ──────────────────────────────────────────────────────────────────────────
 */
const fontVariables = 'font-sans';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

function getMetadataBase(): URL {
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://mercora-roan.vercel.app');
  try {
    const formatted = envUrl.startsWith('http://') || envUrl.startsWith('https://') ? envUrl : `https://${envUrl}`;
    return new URL(formatted);
  } catch {
    return new URL('https://mercora-roan.vercel.app');
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: 'Mercora — Enterprise B2B Business Intelligence & Data Platform',
  description: 'High-performance B2B Data Engine, Multi-Tenant Architecture, and System Telemetry.',
  icons: {
    icon: '/logo-icon.svg',
    shortcut: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  openGraph: {
    title: 'Mercora — Enterprise B2B Platform',
    description: 'High-performance B2B Data Engine, Multi-Tenant Architecture, and System Telemetry.',
    images: [{ url: '/logo.svg', width: 1131, height: 400, alt: 'Mercora' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mercora — Enterprise B2B Platform',
    description: 'High-performance B2B Data Engine, Multi-Tenant Architecture, and System Telemetry.',
    images: ['/logo.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(fontVariables, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          padding: 0,
          /* Default body font = Work Sans */
          fontFamily: 'var(--font-work, "Work Sans"), "Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: 'var(--background, var(--theme-canvas, #ffffff))',
          color: 'var(--text-primary, var(--theme-ink-darkest, #14161a))',
          minHeight: '100vh',
        }}
      >
        <Providers>
          <GlobalWheelHandler />
          {children}
        </Providers>
      </body>
    </html>
  );
}
