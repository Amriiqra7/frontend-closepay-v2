'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminMenu } from '@/contexts/AdminMenuContext';
import Dashboard from "@/views/dashboard/Dashboard";
import PageLoading from "@/components/PageLoading";

export default function DashboardPage() {
  const router = useRouter();
  const { selectedMenu, isHydrated } = useAdminMenu();

  useEffect(() => {
    // Wait for hydration to complete before checking
    if (!isHydrated) return;

    // Jika tidak ada selectedMenu (superadmin), redirect ke monitor-admin-dashboard
    // Jika ada selectedMenu (admin), tampilkan dashboard biasa
    if (!selectedMenu) {
      router.replace('/monitor-admin-dashboard');
    }
  }, [selectedMenu, isHydrated, router]);

  // Jika belum hydrated, tampilkan loading
  if (!isHydrated) {
    return <PageLoading />;
  }

  // Jika admin, tampilkan dashboard
  if (selectedMenu) {
    return <Dashboard />;
  }

  // Loading state saat redirect (superadmin) - karena superadmin tidak punya dashboard
  return <PageLoading />;
}
