'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Caught Error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--background)',
        color: 'var(--text-primary)',
        position: 'relative',
        transition: 'background-color 0.2s ease, color 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(238, 49, 53, 0.15)',
            color: '#ee3135',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          !
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Something went wrong
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
          {error.message || 'An unexpected error occurred while loading this view.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              border: 'none',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
          <a
            href="/login"
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'var(--surface-hover)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              display: 'inline-block',
            }}
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
