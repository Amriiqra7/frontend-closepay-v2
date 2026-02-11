'use client';

import { usePathname } from "next/navigation";
import DashboardLayout from "@/views/shared/DashboardLayout";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/login') || pathname === '/';

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
