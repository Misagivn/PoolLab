"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperManagerPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/supermanager/dashpage');
  }, [router]);

  return null;
}