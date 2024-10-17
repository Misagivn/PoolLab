import React from 'react';

export default function TableLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      {children}
    </div>
  );
}