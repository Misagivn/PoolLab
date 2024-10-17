import { useState } from 'react';
import { Box, Icon, Text, VStack, Input, Textarea, Button } from '@chakra-ui/react';
import { FaTools, FaHandPointer, FaCheckCircle } from 'react-icons/fa';

type TableStatus = 'unselected' | 'active' | 'repair';

interface TableProps {
  tableNumber: string;
  customerName: string;
  note: string;
  status: TableStatus;
  onUpdate: (tableNumber: string, customerName: string, note: string, status: TableStatus) => void;
  onSaveStatus: (tableNumber: string, newStatus: TableStatus) => void;
}

const Table: React.FC<TableProps> = ({ tableNumber, customerName, note, status, onUpdate, onSaveStatus }) => {
  const [customer, setCustomer] = useState(customerName);
  const [tableNote, setTableNote] = useState(note);
  const [tempStatus, setTempStatus] = useState<TableStatus>(status); // Trạng thái tạm thời

  // Thay đổi trạng thái tạm thời khi nhấn vào bàn
  const toggleStatus = () => {
    if (tempStatus === 'unselected') setTempStatus('active');
    else if (tempStatus === 'active') setTempStatus('repair');
    else setTempStatus('unselected');
  };

  // Lưu thông tin khi nhấn "Lưu"
  const handleSave = () => {
    onUpdate(tableNumber, customer, tableNote, tempStatus); // Cập nhật thông tin bàn
    onSaveStatus(tableNumber, tempStatus); // Cập nhật trạng thái bàn khi nhấn "Lưu"
  };

  // Lấy kiểu và nhãn cho trạng thái
  const getStatusStyles = () => {
    switch (tempStatus) {
      case 'active':
        return { bg: 'green.300', icon: FaCheckCircle, label: 'Đang sử dụng' };
      case 'repair':
        return { bg: 'yellow.400', icon: FaTools, label: 'Đang sửa chữa' };
      default:
        return { bg: 'gray.200', icon: FaHandPointer, label: 'Có sẵn' };
    }
  };

  const { bg, icon, label } = getStatusStyles();

  return (
    <VStack spacing={3}>
      {/* Thay đổi trạng thái khi nhấn vào bàn */}
      <Box
        w="100px"
        h="80px"
        bg={bg}
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius="md"
        boxShadow="md"
        transition="background-color 0.2s"
        onClick={toggleStatus} // Khi nhấn vào bàn sẽ thay đổi trạng thái tạm thời
        cursor="pointer"
      >
        <Icon as={icon} boxSize={6} />
      </Box>
      <Text>{tableNumber}</Text>
      <Text fontSize="sm" color="gray.600">{label}</Text>

      <Input
        placeholder="Tên khách hàng"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        size="sm"
      />

      <Textarea
        placeholder="Ghi chú"
        value={tableNote}
        onChange={(e) => setTableNote(e.target.value)}
        size="sm"
      />

      {/* Chỉ lưu trạng thái khi nhấn "Lưu" */}
      <Button mt={2} colorScheme="blue" onClick={handleSave}>
        Lưu
      </Button>
    </VStack>
  );
};

export default Table;
