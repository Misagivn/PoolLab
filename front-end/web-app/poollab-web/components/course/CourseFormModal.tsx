import { useRef, useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Box,
  useToast,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  Checkbox,
  SimpleGrid,
  HStack,
  Select,
  Text,
} from '@chakra-ui/react';
import { Course, CreateCourseDTO } from '@/utils/types/course.types';
import { useStores } from '@/hooks/useStores';
import { useMembers } from '@/hooks/useMembers';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCourseDTO) => Promise<void>;
  initialData?: Course;
  title: string;
}

const DAYS_OF_WEEK = [
  { value: 'Monday', label: 'Thứ 2' },
  { value: 'Tuesday', label: 'Thứ 3' },
  { value: 'Wednesday', label: 'Thứ 4' },
  { value: 'Thursday', label: 'Thứ 5' },
  { value: 'Friday', label: 'Thứ 6' },
  { value: 'Saturday', label: 'Thứ 7' },
  { value: 'Sunday', label: 'Chủ nhật' }
];

export const CourseFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}: CourseFormModalProps) => {
  const { data: stores = [] } = useStores();
  const { data: members = [] } = useMembers();
  const toast = useToast();

  // State for selected store display
  const [selectedStore, setSelectedStore] = useState<{
    id: string;
    name: string;
    address: string;
  } | null>(null);

  const [formData, setFormData] = useState<CreateCourseDTO>({
    title: '',
    descript: '',
    price: 0,
    schedule: [],
    courseMonth: '',
    startTime: '',
    endTime: '',
    level: '',
    quantity: 0,
    storeId: '',
    accountId: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        descript: initialData.descript || '',
        price: initialData.price || 0,
        schedule: initialData.schedule.split(',').map(day => day.trim()),
        courseMonth: initialData.startDate?.split('T')[0].substring(0, 7) || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        level: initialData.level || '',
        quantity: initialData.quantity || 0,
        storeId: initialData.storeId || '',
        accountId: initialData.accountId || ''
      });

      // Set selected store for edit mode
      const store = stores.find(s => s.id === initialData.storeId);
      if (store) {
        setSelectedStore({
          id: store.id,
          name: store.name,
          address: store.address
        });
      }
    } else {
      // Reset form for new course
      setFormData({
        title: '',
        descript: '',
        price: 0,
        schedule: [],
        courseMonth: '',
        startTime: '',
        endTime: '',
        level: '',
        quantity: 0,
        storeId: '',
        accountId: ''
      });
      setSelectedStore(null);
    }
  }, [initialData, isOpen, stores]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Tên khóa học là bắt buộc';
    }
    if (formData.schedule.length === 0) {
      newErrors.schedule = 'Vui lòng chọn ít nhất một ngày học';
    }
    if (!formData.courseMonth) {
      newErrors.courseMonth = 'Tháng học là bắt buộc';
    }
    if (!formData.level?.trim()) {
      newErrors.level = 'Cấp độ là bắt buộc';
    }
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Số lượng học viên phải lớn hơn 0';
    }
    if (!formData.storeId) {
      newErrors.storeId = 'Vui lòng chọn cửa hàng';
    }
    if (!formData.accountId) {
      newErrors.accountId = 'Vui lòng chọn giảng viên';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Giờ bắt đầu là bắt buộc';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'Giờ kết thúc là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      setLoading(true);
      
      const submitData: CreateCourseDTO = {
        title: formData.title,
        descript: formData.descript,
        price: Number(formData.price),
        schedule: formData.schedule,
        courseMonth: `${formData.courseMonth.split('-')[1]}/${formData.courseMonth.split('-')[0]}`,
        startTime: formData.startTime,
        endTime: formData.endTime,
        level: formData.level,
        quantity: Number(formData.quantity),
        storeId: formData.storeId,
        accountId: formData.accountId
      };
  
      await onSubmit(submitData);
      onClose();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo khóa học. Vui lòng thử lại.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.includes(day)
        ? prev.schedule.filter(d => d !== day)
        : [...prev.schedule, day]
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.storeId} isRequired>
              <FormLabel>Cửa hàng</FormLabel>
              <Select
                value={formData.storeId}
                onChange={(e) => {
                  const store = stores.find(s => s.id === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    storeId: e.target.value
                  }));
                  if (store) {
                    setSelectedStore({
                      id: store.id,
                      name: store.name,
                      address: store.address
                    });
                  }
                }}
                placeholder="Chọn cửa hàng"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </Select>
              {selectedStore && (
                <Box mt={2} p={3} bg="gray.50" borderRadius="md">
                  <Text fontWeight="medium">{selectedStore.name}</Text>
                  <Text fontSize="sm" color="gray.600">{selectedStore.address}</Text>
                </Box>
              )}
              <FormErrorMessage>{errors.storeId}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.accountId} isRequired>
              <FormLabel>Giảng viên</FormLabel>
              <Select
                value={formData.accountId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  accountId: e.target.value
                }))}
                placeholder="Chọn giảng viên"
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.fullName}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.accountId}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.title} isRequired>
              <FormLabel>Tên khóa học</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                placeholder="Nhập tên khóa học"
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.price} isRequired>
              <FormLabel>Giá khóa học</FormLabel>
              <NumberInput
                min={0}
                value={formData.price}
                onChange={(valueString) => setFormData(prev => ({
                  ...prev,
                  price: parseInt(valueString) || 0
                }))}
              >
                <NumberInputField placeholder="Nhập giá khóa học" />
              </NumberInput>
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.schedule} isRequired>
              <FormLabel>Lịch học</FormLabel>
              <SimpleGrid columns={4} spacing={2}>
                {DAYS_OF_WEEK.map((day) => (
                  <Checkbox
                    key={day.value}
                    isChecked={formData.schedule.includes(day.value)}
                    onChange={() => handleDayToggle(day.value)}
                  >
                    {day.label}
                  </Checkbox>
                ))}
              </SimpleGrid>
              <FormErrorMessage>{errors.schedule}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.courseMonth} isRequired>
              <FormLabel>Tháng học</FormLabel>
              <Input
                type="month"
                value={formData.courseMonth}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  courseMonth: e.target.value
                }))}
                min={new Date().toISOString().slice(0, 7)}
              />
              <FormErrorMessage>{errors.courseMonth}</FormErrorMessage>
            </FormControl>

            <HStack width="100%" spacing={4}>
              <FormControl isRequired isInvalid={!!errors.startTime}>
                <FormLabel>Giờ bắt đầu</FormLabel>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    startTime: e.target.value
                  }))}
                />
                <FormErrorMessage>{errors.startTime}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.endTime}>
                <FormLabel>Giờ kết thúc</FormLabel>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    endTime: e.target.value
                  }))}
                />
                <FormErrorMessage>{errors.endTime}</FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl isInvalid={!!errors.level} isRequired>
              <FormLabel>Cấp độ</FormLabel>
              <Select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  level: e.target.value
                }))}
                placeholder="Chọn cấp độ"
              >
                <option value="level 1">Cấp độ 1</option>
                <option value="level 2">Cấp độ 2</option>
                <option value="level 3">Cấp độ 3</option>
              </Select>
              <FormErrorMessage>{errors.level}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.quantity} isRequired>
              <FormLabel>Số lượng học viên</FormLabel>
              <NumberInput
                min={1}
                value={formData.quantity}
                onChange={(valueString) => setFormData(prev => ({
                  ...prev,
                  quantity: parseInt(valueString) || 0
                }))}
              >
                <NumberInputField placeholder="Nhập số lượng học viên" />
              </NumberInput>
              <FormErrorMessage>{errors.quantity}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                value={formData.descript}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  descript: e.target.value
                }))}
                placeholder="Nhập mô tả khóa học"
                rows={6}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
          >
            {initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};