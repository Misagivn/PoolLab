'use client';
import { useState, useEffect } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import Table from './table';

// Định nghĩa kiểu status
type TableStatus = 'unselected' | 'active' | 'repair';

export default function TableManagement() {
  const [tables, setTables] = useState<{ tableNumber: string, customerName: string, note: string, status: TableStatus }[]>([]);

  // Hàm gọi API để lấy dữ liệu bàn
  const fetchTables = async () => {
    // const data = await getTablesData();
    // setTables(data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Hàm cập nhật thông tin bàn
  const handleUpdateTable = (tableNumber: string, customerName: string, note: string, status: TableStatus) => {
    const updatedTables = tables.map((table) =>
      table.tableNumber === tableNumber ? { ...table, customerName, note, status } : table
    );
    setTables(updatedTables);
  };

  // Hàm thay đổi trạng thái bàn khi nhấn nút "Lưu"
  const handleSaveStatus = (tableNumber: string, newStatus: TableStatus) => {
    const updatedTables = tables.map((table) =>
      table.tableNumber === tableNumber ? { ...table, status: newStatus } : table
    );
    setTables(updatedTables);
  };

  // Hàm thêm bàn mới
  const addTables = () => {
    const newTables = Array.from({ length: 5 }, (_, index) => ({
      tableNumber: `Bàn ${tables.length + index + 1}`,
      customerName: '',
      note: '',
      status: 'unselected',  // Trạng thái ban đầu là 'unselected'
    }));
    setTables([...tables, ...newTables]);
  };

  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={5}>Quản Lý Bàn</Text>

      {/* Grid layout hiển thị bàn */}
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={6}>
        {tables.map((table) => (
          <Table
            key={table.tableNumber}
            tableNumber={table.tableNumber}
            customerName={table.customerName}
            note={table.note}
            status={table.status}  // Truyền đúng kiểu status
            onUpdate={handleUpdateTable}
            onSaveStatus={handleSaveStatus}
          />
        ))}
      </Box>

      {/* Nút để thêm bàn */}
      <Button mt={5} colorScheme="blue" onClick={addTables}>
        Thêm 5 Bàn
      </Button>
    </Box>
  );
}
