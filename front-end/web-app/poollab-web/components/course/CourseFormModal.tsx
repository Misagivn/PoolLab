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
  FormHelperText,
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

const COURSE_STATUS = {
  ACTIVE: 'Kích Hoạt',
  INACTIVE: 'Vô Hiệu',
  OPENED: 'Đã Mở', 
  COMPLETED: 'Kết Thúc'
} as const;

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
    quantity: 1,
    storeId: '',
    accountId: ''
  });

  const [searchInstructor, setSearchInstructor] = useState('');
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const instructorRef = useRef(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (instructorRef.current && !instructorRef.current.contains(event.target)) {
        setShowInstructorDropdown(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        descript: initialData.descript || '',
        price: initialData.price || 0,
        schedule: Array.isArray(initialData.schedule) 
          ? initialData.schedule 
          : initialData.schedule.split(',').map(day => day.trim()),
        courseMonth: initialData.startDate?.split('T')[0].substring(0, 7) || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        level: initialData.level || '',
        quantity: initialData.quantity || 1,
        storeId: initialData.storeId || '',
        accountId: initialData.accountId || ''
      });

      const instructor = members.find(m => m.id === initialData.accountId);
      setSearchInstructor(instructor?.fullName || '');
      const store = stores.find(s => s.id === initialData.storeId);
      if (store) {
        setSelectedStore({
          id: store.id,
          name: store.name,
          address: store.address
        });
      }
    } else {
      setSearchInstructor('');
      setFormData({
        title: '',
        descript: '',
        price: 0,
        schedule: [],
        courseMonth: '',
        startTime: '',
        endTime: '',
        level: '',
        quantity: 1,
        storeId: '',
        accountId: ''
      });
      setSelectedStore(null);
    }
  }, [initialData, isOpen, stores,members ]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Tên khóa học là bắt buộc';
    }
    if (!formData.schedule || formData.schedule.length === 0) {
      newErrors.schedule = 'Vui lòng chọn ít nhất một ngày học';
    }
    if (!formData.courseMonth) {
      newErrors.courseMonth = 'Tháng học là bắt buộc';
    }
    if (!formData.level) {
      newErrors.level = 'Cấp độ là bắt buộc';
    }
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Số lượng học viên phải lớn hơn 0';
    }
    if (formData.quantity > 12) {
      newErrors.quantity = 'Số lượng học viên tối đa là 12';
    }
    if (formData.price < 0) {
      newErrors.price = 'Giá không thể âm';
    }
    if (formData.price > 2000000) {
      newErrors.price = 'Giá khóa học tối đa là 2,000,000đ';
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
      
      const [year, month] = formData.courseMonth.split('-');
      const submitData = {
        ...formData,
        courseMonth: `${parseInt(month)}/${year}`,
        price: Math.max(0, Number(formData.price)),
        quantity: Math.max(1, Number(formData.quantity)),
        schedule: formData.schedule
      };
  
      await onSubmit(submitData);
      onClose();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo khóa học. Vui lòng thử lại.',
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

  // const handlePriceChange = (value: string) => {
  //   const numberValue = Number(value);
  //   setFormData(prev => ({
  //     ...prev,
  //     price: isNaN(numberValue) ? 0 : Math.max(0, numberValue)
  //   }));
  // };

  // const handleQuantityChange = (value: string) => {
  //   const numberValue = Number(value);
  //   setFormData(prev => ({
  //     ...prev,
  //     quantity: isNaN(numberValue) ? 1 : Math.max(1, numberValue)
  //   }));
  // };

  

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

            <FormControl isInvalid={!!errors.accountId} isRequired position="relative" ref={instructorRef}>
              <FormLabel>Giảng viên</FormLabel>
              {initialData ? (
                // Nếu là update thì chỉ hiện tên giảng viên, không cho sửa
                <Box p={2} bg="gray.50" borderRadius="md">
                  <Text>{members.find(m => m.id === initialData.accountId)?.fullName}</Text>
                </Box>
              ) : (
                // Nếu là thêm mới thì cho phép tìm và chọn giảng viên
                <>
                  <Input
                    value={searchInstructor}
                    onChange={(e) => {
                      setSearchInstructor(e.target.value);
                      setShowInstructorDropdown(true);
                      if (!e.target.value) {
                        setFormData(prev => ({
                          ...prev,
                          accountId: ''
                        }));
                      }
                    }}
                    onFocus={() => setShowInstructorDropdown(true)}
                    placeholder="Tìm kiếm giảng viên"
                  />
                  {showInstructorDropdown && searchInstructor && (
                    <Box
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      bg="white"
                      boxShadow="lg"
                      borderRadius="md"
                      maxH="200px"
                      overflowY="auto"
                      zIndex={1000}
                      mt={1}
                    >
                      {members
                        .filter(member => 
                          member.fullName.toLowerCase().includes(searchInstructor.toLowerCase())
                        )
                        .map(member => (
                          <Box
                            key={member.id}
                            px={4}
                            py={2}
                            cursor="pointer"
                            _hover={{ bg: "gray.50" }}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                accountId: member.id
                              }));
                              setSearchInstructor(member.fullName);
                              setShowInstructorDropdown(false);
                            }}
                          >
                            <Text>{member.fullName}</Text>
                          </Box>
                        ))}
                      {members.filter(member => 
                        member.fullName.toLowerCase().includes(searchInstructor.toLowerCase())
                      ).length === 0 && (
                        <Box px={4} py={2}>
                          <Text color="gray.500">Không tìm thấy giảng viên</Text>
                        </Box>
                      )}
                    </Box>
                  )}
                </>
              )}
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
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min={0}
                max={2000000}
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  let numberValue = value === '' ? 0 : parseInt(value, 10);
                  
                  // Giới hạn giá tối đa là 2,000,000
                  if (numberValue > 2000000) {
                    numberValue = 2000000;
                  }
                  
                  setFormData(prev => ({
                    ...prev,
                    price: numberValue
                  }));
                }}
                onClick={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                placeholder="Nhập giá khóa học (tối đa 2,000,000)"
              />
              <FormHelperText>Tối đa 2,000,000đ</FormHelperText>
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
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min={1}
                max={12}
                value={formData.quantity}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  let numberValue = value === '' ? 1 : parseInt(value, 10);
                  
                  // Giới hạn số lượng tối đa là 12
                  if (numberValue > 12) {
                    numberValue = 12;
                  }
                  
                  setFormData(prev => ({
                    ...prev,
                    quantity: numberValue
                  }));
                }}
                onClick={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                placeholder="Nhập số lượng học viên (tối đa 12)"
              />
              <FormHelperText>Tối đa 12 học viên/lớp</FormHelperText>
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