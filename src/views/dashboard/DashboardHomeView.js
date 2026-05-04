'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminMenu } from '@/core/contexts/AdminMenuContext';
import Dashboard from "@/features/dashboard/components/Dashboard";
import PageLoading from "@/shared/ui/PageLoading";

export default function DashboardHomeView() {
  const router = useRouter();
  const { selectedMenu, isHydrated, selectedCompany } = useAdminMenu();

  useEffect(() => {
    if (!isHydrated) return;

    if (!selectedMenu) {
      router.replace('/monitor-admin-dashboard');
      return;
    }

    if (selectedMenu === 'fnb') {
      router.replace('/fnb');
    }
  }, [selectedMenu, isHydrated, router]);

  useEffect(() => {
    if (!selectedMenu || !selectedCompany) return;

    if (typeof window !== 'undefined') {
      let backClickCount = 0;
      const MAX_BACK_CLICKS = 2;

      const timer = setTimeout(() => {
        const currentUrl = window.location.href;
        window.history.replaceState(null, '', currentUrl);
        for (let i = 0; i < MAX_BACK_CLICKS + 1; i++) {
          window.history.pushState({ preventBack: true, barrierIndex: i }, '', currentUrl);
        }
      }, 150);

      const handlePopState = () => {
        backClickCount++;
        const currentUrl = window.location.href;
        window.history.pushState({ preventBack: true, barrierIndex: backClickCount }, '', currentUrl);

        if (backClickCount <= MAX_BACK_CLICKS) {
          for (let i = 0; i < backClickCount; i++) {
            setTimeout(() => {
              window.history.pushState({ preventBack: true, barrierIndex: backClickCount + i }, '', currentUrl);
            }, i * 10);
          }
        }

        requestAnimationFrame(() => {
          window.history.pushState({ preventBack: true, barrierIndex: backClickCount }, '', currentUrl);
        });
      };

      window.addEventListener('popstate', handlePopState, true);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('popstate', handlePopState, true);
      };
    }
  }, [selectedMenu, selectedCompany]);

  if (!isHydrated) {
    return <PageLoading />;
  }

  if (selectedMenu) {
    if (selectedMenu === 'fnb') {
      return <PageLoading />;
    }
    return <Dashboard />;
  }

  return <PageLoading />;
}
