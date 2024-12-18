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
  HStack,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  Box,
  Text,
} from '@chakra-ui/react';
import { Course, Member } from '@/utils/types/course.types';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Course;
  title: string;
  members: Member[];
  selectedStore: { id: string; name: string } | null;
}

export const CourseFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  members,
  selectedStore
}: CourseFormModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    descript: '',
    price: 0,
    schedule: [] as string[],
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

  // Format functions
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const formatTime = (time: string) => {
    return time.split('T')[1]?.substring(0, 5) || time;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        descript: initialData.descript || '',
        price: initialData.price || 0,
        schedule: initialData.schedule ? initialData.schedule.split(',') : [],
        courseMonth: initialData.startDate?.split('T')[0] || '',
        startTime: initialData.startTime?.split('T')[1] || '',
        endTime: initialData.endTime?.split('T')[1] || '',
        level: initialData.level || '',
        quantity: initialData.quantity || 0,
        storeId: initialData.storeId || '',
        accountId: initialData.accountId || ''
      });
    } else {
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
        storeId: selectedStore?.id || '',
        accountId: ''
      });
    }
  }, [initialData, selectedStore, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    const currentDate = new Date();
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Tên khóa học là bắt buộc';
    }
    if (!formData.descript?.trim()) {
      newErrors.descript = 'Mô tả khóa học là bắt buộc';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Giá khóa học phải lớn hơn 0';
    }
    if (formData.schedule.length === 0) {
      newErrors.schedule = 'Lịch học là bắt buộc';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Giờ bắt đầu là bắt buộc';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'Giờ kết thúc là bắt buộc';
    }
    if (!formData.level) {
      newErrors.level = 'Cấp độ là bắt buộc';
    }
    if (!formData.accountId) {
      newErrors.accountId = 'Người dạy là bắt buộc';
    }
     // setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Số lượng học viên phải lớn hơn 0';
    }
    if (!formData.courseMonth) {
      newErrors.courseMonth = 'Tháng học là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        schedule: formData.schedule.join(','),
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const weekDays = [
    { value: 'Monday', label: 'Thứ 2' },
    { value: 'Tuesday', label: 'Thứ 3' },
    { value: 'Wednesday', label: 'Thứ 4' },
    { value: 'Thursday', label: 'Thứ 5' },
    { value: 'Friday', label: 'Thứ 6' },
    { value: 'Saturday', label: 'Thứ 7' },
    { value: 'Sunday', label: 'Chủ nhật' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
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

            <FormControl isInvalid={!!errors.descript} isRequired>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                value={formData.descript}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  descript: e.target.value
                }))}
                placeholder="Nhập mô tả khóa học"
              />
              <FormErrorMessage>{errors.descript}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.price} isRequired>
              <FormLabel>Giá khóa học</FormLabel>
              <NumberInput
                min={0}
                value={formData.price}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  price: Number(value)
                }))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{errors.price}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.schedule} isRequired>
              <FormLabel>Lịch học</FormLabel>
              <HStack wrap="wrap">
                {weekDays.map((day) => (
                  <Button
                    key={day.value}
                    size="sm"
                    colorScheme={formData.schedule.includes(day.value) ? "blue" : "gray"}
                    onClick={() => {
                      const newSchedule = formData.schedule.includes(day.value)
                        ? formData.schedule.filter(d => d !== day.value)
                        : [...formData.schedule, day.value];
                      setFormData(prev => ({
                        ...prev,
                        schedule: newSchedule
                      }));
                    }}
                  >
                    {day.label}
                  </Button>
                ))}
              </HStack>
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
              />
              <FormErrorMessage>{errors.courseMonth}</FormErrorMessage>
            </FormControl>

            <HStack spacing={4} width="100%">
              <FormControl isInvalid={!!errors.startTime} isRequired>
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

              <FormControl isInvalid={!!errors.endTime} isRequired>
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
                placeholder="Chọn cấp độ"
                value={formData.level}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  level: e.target.value
                }))}
              >
                <option value="level 1">Cơ bản</option>
                <option value="level 2">Trung cấp</option>
                <option value="level 3">Nâng cao</option>
              </Select>
              <FormErrorMessage>{errors.level}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.quantity} isRequired>
              <FormLabel>Số lượng học viên</FormLabel>
              <NumberInput
                min={1}
                value={formData.quantity}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  quantity: Number(value)
                }))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{errors.quantity}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.accountId} isRequired>
              <FormLabel>Người dạy</FormLabel>
              <Select
                placeholder="Chọn người dạy"
                value={formData.accountId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  accountId: e.target.value
                }))}
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.fullName} ({member.userName})
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.accountId}</FormErrorMessage>
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