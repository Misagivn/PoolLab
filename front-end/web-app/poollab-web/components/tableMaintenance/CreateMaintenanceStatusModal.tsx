import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  useToast,
} from '@chakra-ui/react';
import { useTableMaintenance } from '@/hooks/usetableMaintenance';
import { TableIssue } from '@/utils/types/tableIssues.types';

interface CreateMaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: TableIssue | null;
}

interface MaintenanceFormData {
  tableIssuesId: string;
  technicianId: string;
  cost: number;
  startDate: string;
  endDate: string;
}

const initialFormData: MaintenanceFormData = {
  tableIssuesId: '',
  technicianId: '',
  cost: 0,
  startDate: '',
  endDate: '',
};

export const CreateMaintenanceFormModal = ({ 
  isOpen, 
  onClose,
  issue 
}: CreateMaintenanceFormModalProps) => {
  const { createMaintenance } = useTableMaintenance();
  const [formData, setFormData] = useState<MaintenanceFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Set tableIssuesId when issue changes
  useState(() => {
    if (issue) {
      setFormData(prev => ({
        ...prev,
        tableIssuesId: issue.id,
        cost: issue.estimatedCost
      }));
    }
  }, [issue]);

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.technicianId) {
      newErrors.technicianId = 'Vui lòng chọn kỹ thuật viên';
    }

    if (!formData.cost || formData.cost <= 0) {
      newErrors.cost = 'Chi phí phải lớn hơn 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await createMaintenance(formData);
      toast({
        title: 'Thành công',
        description: 'Đã tạo lệnh bảo trì thành công',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    } catch (error) {
      console.error('Create maintenance failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo lệnh bảo trì mới</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.technicianId}>
              <FormLabel>Kỹ thuật viên phụ trách</FormLabel>
              <Input
                value={formData.technicianId}
                onChange={e => setFormData(prev => ({ ...prev, technicianId: e.target.value }))}
                placeholder="Chọn kỹ thuật viên"
              />
              <FormErrorMessage>{errors.technicianId}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.cost}>
              <FormLabel>Chi phí ước tính</FormLabel>
              <NumberInput
                value={formData.cost}
                onChange={(_, value) => setFormData(prev => ({ ...prev, cost: value }))}
                min={0}
              >
                <NumberInputField placeholder="Nhập chi phí ước tính" />
              </NumberInput>
              <FormErrorMessage>{errors.cost}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.startDate}>
              <FormLabel>Ngày bắt đầu</FormLabel>
              <Input
                type="datetime-local"
                value={formData.startDate}
                onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
              <FormErrorMessage>{errors.startDate}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.endDate}>
              <FormLabel>Ngày kết thúc dự kiến</FormLabel>
              <Input
                type="datetime-local"
                value={formData.endDate}
                onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
              <FormErrorMessage>{errors.endDate}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Hủy
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Đang tạo..."
          >
            Tạo lệnh bảo trì
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};