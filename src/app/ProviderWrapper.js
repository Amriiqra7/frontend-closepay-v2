'use client';

import ThemeRegistry from './ThemeRegistry';
import ConditionalLayout from './ConditionalLayout';
import { AdminMenuProvider } from '@/core/contexts/AdminMenuContext';
import { Toaster } from 'react-hot-toast';

export default function ProviderWrapper({ children }) {
  return (
    <ThemeRegistry>
      <AdminMenuProvider>
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#262626',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: '12px 16px',
              fontSize: '14px',
            },
            success: {
              duration: 4000,
              iconTheme: {
                primary: '#4caf50',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#d32f2f',
                secondary: '#fff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#155DFC',
                secondary: '#fff',
              },
            },
          }}
        />
      </AdminMenuProvider>
    </ThemeRegistry>
  );
}
