'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminMenu } from '@/core/contexts/AdminMenuContext';
import Dashboard from "@/features/dashboard/components/Dashboard";
import PageLoading from "@/shared/ui/PageLoading";

export default function DashboardPage() {
  const router = useRouter();
  const { selectedMenu, isHydrated, selectedCompany } = useAdminMenu();

  useEffect(() => {
    // Wait for hydration to complete before checking
    if (!isHydrated) return;

    // Jika tidak ada selectedMenu (superadmin), redirect ke monitor-admin-dashboard
    // Jika ada selectedMenu (admin), tampilkan dashboard biasa
    if (!selectedMenu) {
      router.replace('/monitor-admin-dashboard');
    }
  }, [selectedMenu, isHydrated, router]);

  // Prevent back navigation if coming from company selection
  useEffect(() => {
    if (!selectedMenu || !selectedCompany) return;

    if (typeof window !== 'undefined') {
      let backClickCount = 0;
      const MAX_BACK_CLICKS = 2;
      
      // Wait for navigation to complete
      const timer = setTimeout(() => {
        const currentUrl = window.location.href;
        
        // Replace current history entry to remove previous page
        window.history.replaceState(null, '', currentUrl);
        
        // Push multiple barrier states to create a strong barrier (more states for multiple clicks)
        for (let i = 0; i < MAX_BACK_CLICKS + 1; i++) {
          window.history.pushState({ preventBack: true, barrierIndex: i }, '', currentUrl);
        }
      }, 150);

      // Listen for popstate to prevent back navigation (works for both back button and mouse back)
      const handlePopState = (e) => {
        backClickCount++;
        const currentUrl = window.location.href;
        
        // Push state immediately to block back navigation
        window.history.pushState({ preventBack: true, barrierIndex: backClickCount }, '', currentUrl);
        
        // For multiple back clicks, push additional barriers
        if (backClickCount <= MAX_BACK_CLICKS) {
          // Push more barriers for each additional back click
          for (let i = 0; i < backClickCount; i++) {
            setTimeout(() => {
              window.history.pushState({ preventBack: true, barrierIndex: backClickCount + i }, '', currentUrl);
            }, i * 10);
          }
        }
        
        // Use requestAnimationFrame to ensure it happens after browser processes the back
        requestAnimationFrame(() => {
          window.history.pushState({ preventBack: true, barrierIndex: backClickCount }, '', currentUrl);
        });
      };

      // Add listener with capture phase to catch it early
      window.addEventListener('popstate', handlePopState, true);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('popstate', handlePopState, true);
      };
    }
  }, [selectedMenu, selectedCompany]);

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
