'use client';

import ThemeRegistry from './ThemeRegistry';
import ConditionalLayout from './ConditionalLayout';
import { AdminMenuProvider } from '@/contexts/AdminMenuContext';

export default function ProviderWrapper({ children }) {
  return (
    <ThemeRegistry>
      <AdminMenuProvider>
        <ConditionalLayout>{children}</ConditionalLayout>
      </AdminMenuProvider>
    </ThemeRegistry>
  );
}
