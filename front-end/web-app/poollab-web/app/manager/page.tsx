"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/manager/dashpage');
  }, [router]);

  return null;
}