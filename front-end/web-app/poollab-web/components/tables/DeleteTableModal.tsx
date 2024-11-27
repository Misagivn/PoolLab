import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { deleteTable } from '@/apis/table.api';

interface DeleteTableModalProps {
  disclosure: UseDisclosureReturn;
  tableId: string;
  tableName: string;
  onDeleteSuccess: () => void;
}

export const DeleteTableModal = ({ 
  disclosure, 
  tableId, 
  tableName,
  onDeleteSuccess 
}: DeleteTableModalProps) => {
  const { isOpen, onClose } = disclosure;
  const cancelRef = useRef(null);
  const toast = useToast();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await deleteTable(tableId, token);
      
      toast({
        title: 'Thành công',
        description: `Đã xóa bàn ${tableName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onDeleteSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bàn. Vui lòng thử lại sau',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Xác nhận xóa bàn
          </AlertDialogHeader>

          <AlertDialogBody>
            Bạn có chắc chắn muốn xóa bàn "{tableName}"? 
            Hành động này không thể hoàn tác.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Hủy
            </Button>
            <Button colorScheme='red' onClick={handleDelete} ml={3}>
              Xóa
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};