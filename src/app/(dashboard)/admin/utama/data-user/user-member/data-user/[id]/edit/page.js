'use client';

import { use } from 'react';
import UserMemberEdit from '@/features/user-member/components/UserMemberEdit';

export default function UserMemberEditPage({ params }) {
  const { id } = use(params);
  return <UserMemberEdit id={id} />;
}
