'use client';
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Drink {
  id: number;
  name: string;
  price: number;
}

interface Table {
  id: number;
  name: string;
}

const drinks: Drink[] = [
  { id: 1, name: 'Coca Cola', price: 15000 },
  { id: 2, name: 'Pepsi', price: 15000 },
  { id: 3, name: 'Bia', price: 20000 },
  // Thêm các đồ uống khác ở đây
];

export default function TableDetails() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedDrinks, setSelectedDrinks] = useState<Drink[]>([]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const addDrink = (drink: Drink) => {
    setSelectedDrinks([...selectedDrinks, drink]);
  };

  return (
    <div className="w-1/2 p-4 bg-white overflow-y-auto">
      {selectedTable ? (
        <>
          <h2 className="text-2xl font-bold mb-4">{selectedTable.name}</h2>
          <div className="mb-4">
            <p className="text-xl">Thời gian: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}</p>
            <Button onClick={toggleTimer} className="mt-2">
              {isTimerRunning ? 'Dừng' : 'Bắt đầu'}
            </Button>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Đồ uống</h3>
            <div className="grid grid-cols-2 gap-2">
              {drinks.map((drink) => (
                <Button key={drink.id} onClick={() => addDrink(drink)} variant="outline">
                  {drink.name} - {drink.price}đ
                </Button>
              ))}
            </div>
          </div>
          {selectedDrinks.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-2">Đồ uống đã chọn</h3>
              <ul>
                {selectedDrinks.map((drink, index) => (
                  <li key={index}>{drink.name} - {drink.price}đ</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <Alert>
          <AlertDescription>
            Vui lòng chọn một bàn từ danh sách bên trái để xem thông tin và quản lý.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}