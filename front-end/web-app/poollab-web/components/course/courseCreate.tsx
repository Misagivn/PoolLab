import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useStores } from '@/hooks/useStores';
import { courseApi } from '@/apis/course';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCourseModal = ({ isOpen, onClose, onSuccess }: CreateCourseModalProps) => {
  const { data: storesData } = useStores();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    descript: '',
    price: '',
    schedule: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    level: '',
    quantity: '1',
    storeId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.storeId) {
      newErrors.storeId = 'Store is required';
    }
    if (parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 1 || quantity > 12) {
      newErrors.quantity = 'Quantity must be between 1 and 12';
    }
    
    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (formData.endTime && formData.startTime && formData.endTime < formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please check all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity) || 1,
        accountId: localStorage.getItem('userId'),
      };

      const response = await courseApi.createCourse(submitData);

      if (response.isError) {
        throw new Error(response.message || 'Failed to create course');
      }

      toast({
        title: 'Success',
        description: 'Course created successfully',
        status: 'success',
        duration: 3000,
      });
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create course';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'price' | 'quantity') => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (field === 'quantity') {
        const num = parseInt(value);
        if (!isNaN(num) && num >= 1 && num <= 12) {
          setFormData({ ...formData, [field]: value });
        } else if (value === '') {
          setFormData({ ...formData, [field]: value });
        }
      } else {
        // For price, allow any non-negative number
        setFormData({ ...formData, [field]: value });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Course</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.title}>
              <FormLabel>Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>
            
            <FormControl isRequired isInvalid={!!errors.storeId}>
              <FormLabel>Store</FormLabel>
              <Select
                value={formData.storeId}
                onChange={(e) => setFormData({...formData, storeId: e.target.value})}
              >
                <option value="">Select Store</option>
                {storesData?.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.storeId}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.price}>
              <FormLabel>Price</FormLabel>
              <Input
                type="text"
                value={formData.price}
                onChange={(e) => handleNumberInput(e, 'price')}
                placeholder="Enter price"
              />
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.startDate}>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
              <FormErrorMessage>{errors.startDate}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.endDate}>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                min={formData.startDate}
              />
              <FormErrorMessage>{errors.endDate}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.startTime}>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
              <FormErrorMessage>{errors.startTime}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.endTime}>
              <FormLabel>End Time</FormLabel>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              />
              <FormErrorMessage>{errors.endTime}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Level</FormLabel>
              <Input
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.quantity}>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="text"
                value={formData.quantity}
                onChange={(e) => handleNumberInput(e, 'quantity')}
                placeholder="Enter quantity (1-12)"
              />
              <FormErrorMessage>{errors.quantity}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={formData.descript}
                onChange={(e) => setFormData({...formData, descript: e.target.value})}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Schedule</FormLabel>
              <Input
                value={formData.schedule}
                onChange={(e) => setFormData({...formData, schedule: e.target.value})}
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};