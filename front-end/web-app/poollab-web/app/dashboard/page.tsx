"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashBoardPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/dashpage');
  }, [router]);

  return null;
}