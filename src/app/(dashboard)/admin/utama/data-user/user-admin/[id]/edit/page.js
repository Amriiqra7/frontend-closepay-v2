'use client';

import { use } from 'react';
import UserAdminEdit from '@/features/user-admin/components/UserAdminEdit';

export default function UserAdminEditPage({ params }) {
  const { id } = use(params);
  return <UserAdminEdit id={id} />;
}
