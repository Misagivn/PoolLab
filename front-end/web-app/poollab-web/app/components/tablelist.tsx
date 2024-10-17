'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

interface Table {
  id: number;
  name: string;
  available: boolean;
}

const tables: Table[] = [
  { id: 1, name: 'Bàn 1', available: true },
  { id: 2, name: 'Bàn 2', available: false },
  { id: 3, name: 'Bàn 3', available: true },
  // Thêm các bàn khác ở đây
];

export default function TableList() {
  const handleTableClick = (table: Table) => {
    if (table.available) {
      // Xử lý logic khi chọn bàn
      console.log(`Bàn ${table.name} được chọn`);
    } else {
      alert('Bàn này hiện không khả dụng');
    }
  };

  return (
    <div className="w-1/2 p-4 bg-gray-100 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Danh sách bàn</h2>
      <div className="grid grid-cols-3 gap-4">
        {tables.map((table) => (
          <Button
            key={table.id}
            onClick={() => handleTableClick(table)}
            variant={table.available ? 'default' : 'secondary'}
            className="h-20 text-lg"
          >
            {table.name}
          </Button>
        ))}
      </div>
    </div>
  );
}