'use client';

import { use } from 'react';
import UserMemberEdit from '@/views/user-member/UserMemberEdit';

export default function UserMemberEditPage({ params }) {
  const { id } = use(params);
  return <UserMemberEdit id={id} />;
}
