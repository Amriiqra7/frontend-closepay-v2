'use client';

import { use } from 'react';
import UserAdminEdit from '@/views/user-admin/UserAdminEdit';

export default function UserAdminEditPage({ params }) {
  const { id } = use(params);
  return <UserAdminEdit id={id} />;
}
