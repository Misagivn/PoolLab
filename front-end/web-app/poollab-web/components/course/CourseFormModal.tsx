// components/course/CourseFormModal.tsx
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
 Button,
 VStack,
 useToast,
 FormErrorMessage,
 HStack,
 NumberInput,
 NumberInputField,
 Select,
 Checkbox,
 SimpleGrid,
 Textarea,
} from '@chakra-ui/react';
import { Course } from '@/utils/types/course.types';
import { useStores } from '@/hooks/useStores';

interface CourseFormModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (data: any) => Promise<void>;
 initialData?: Course | null;
 mode: 'create' | 'update';
}

const DAYS_OF_WEEK = [
 { value: 'Monday', label: 'Thứ 2' },
 { value: 'Tuesday', label: 'Thứ 3' },
 { value: 'Wednesday', label: 'Thứ 4' },
 { value: 'Thursday', label: 'Thứ 5' },
 { value: 'Friday', label: 'Thứ 6' },
 { value: 'Saturday', label: 'Thứ 7' },
 { value: 'Sunday', label: 'Chủ nhật' },
];

const defaultFormData = {
 title: '',
 descript: '',
 price: 0,
 schedule: [] as string[],
 startTime: '',
 endTime: '',
 level: 'Sơ Cấp',
 quantity: 10,
 courseMonth: new Date().toISOString().split('T')[0],
};

export const CourseFormModal = ({ 
 isOpen, 
 onClose, 
 onSubmit,
 initialData,
 mode 
}: CourseFormModalProps) => {
 const [formData, setFormData] = useState(defaultFormData);
 const [errors, setErrors] = useState<{[key: string]: string}>({});
 const [loading, setLoading] = useState(false);
 const { data: stores } = useStores();
 const toast = useToast();

 useEffect(() => {
   if (isOpen) {
     if (mode === 'update' && initialData) {
       setFormData({
         title: initialData.title,
         descript: initialData.descript,
         price: initialData.price,
         schedule: initialData.schedule.split(','),
         startTime: initialData.startTime,
         endTime: initialData.endTime,
         level: initialData.level,
         quantity: initialData.quantity,
         courseMonth: initialData.startDate,
       });
     } else {
       setFormData(defaultFormData);
     }
   }
 }, [isOpen, initialData, mode]);

 const handleClose = () => {
   setFormData(defaultFormData);
   setErrors({});
   onClose();
 };

 const validateForm = () => {
   const newErrors: {[key: string]: string} = {};

   if (!formData.title.trim()) {
     newErrors.title = 'Tên khóa học là bắt buộc';
   }

   if (formData.price <= 0) {
     newErrors.price = 'Giá phải lớn hơn 0';
   }

   if (formData.schedule.length === 0) {
     newErrors.schedule = 'Vui lòng chọn ít nhất một ngày học';
   }

   if (!formData.startTime) {
     newErrors.startTime = 'Giờ bắt đầu là bắt buộc';
   }

   if (!formData.endTime) {
     newErrors.endTime = 'Giờ kết thúc là bắt buộc';
   }

   if (formData.quantity < 1) {
     newErrors.quantity = 'Số lượng học viên phải lớn hơn 0';
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
     toast({
       title: 'Thành công',
       description: mode === 'update' 
         ? 'Cập nhật khóa học thành công' 
         : 'Tạo khóa học mới thành công',
       status: 'success',
       duration: 3000,
       isClosable: true,
     });
     handleClose();
   } catch (error) {
     console.error('Error submitting form:', error);
   } finally {
     setLoading(false);
   }
 };

 const handleScheduleChange = (day: string) => {
   setFormData(prev => ({
     ...prev,
     schedule: prev.schedule.includes(day)
       ? prev.schedule.filter(d => d !== day)
       : [...prev.schedule, day]
   }));
 };

 return (
   <Modal 
     isOpen={isOpen} 
     onClose={handleClose}
     size="xl"
   >
     <ModalOverlay />
     <ModalContent>
       <ModalHeader>
         {mode === 'update' ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
       </ModalHeader>
       <ModalCloseButton />
       
       <ModalBody>
         <VStack spacing={4}>
           <FormControl isRequired isInvalid={!!errors.title}>
             <FormLabel>Tên khóa học</FormLabel>
             <Input
               value={formData.title}
               onChange={(e) => setFormData(prev => ({
                 ...prev,
                 title: e.target.value
               }))}
             />
             <FormErrorMessage>{errors.title}</FormErrorMessage>
           </FormControl>

           <FormControl>
             <FormLabel>Mô tả</FormLabel>
             <Textarea
               value={formData.descript}
               onChange={(e) => setFormData(prev => ({
                 ...prev,
                 descript: e.target.value
               }))}
             />
           </FormControl>

           <SimpleGrid columns={2} spacing={4} width="100%">
             <FormControl isRequired isInvalid={!!errors.price}>
               <FormLabel>Giá (VNĐ)</FormLabel>
               <NumberInput
                 value={formData.price}
                 onChange={(_, value) => setFormData(prev => ({
                   ...prev,
                   price: value
                 }))}
                 min={0}
               >
                 <NumberInputField />
               </NumberInput>
               <FormErrorMessage>{errors.price}</FormErrorMessage>
             </FormControl>

             <FormControl isRequired>
               <FormLabel>Level</FormLabel>
               <Select
                 value={formData.level}
                 onChange={(e) => setFormData(prev => ({
                   ...prev,
                   level: e.target.value
                 }))}
               >
                 <option value="Sơ Cấp">Sơ cấp</option>
                 <option value="Trung Cấp">Trung cấp</option>
                 <option value="Cao Cấp">Cao cấp</option>
               </Select>
             </FormControl>
           </SimpleGrid>

           <FormControl isRequired isInvalid={!!errors.schedule}>
             <FormLabel>Lịch học</FormLabel>
             <SimpleGrid columns={3} spacing={3}>
               {DAYS_OF_WEEK.map(day => (
                 <Checkbox
                   key={day.value}
                   isChecked={formData.schedule.includes(day.value)}
                   onChange={() => handleScheduleChange(day.value)}
                 >
                   {day.label}
                 </Checkbox>
               ))}
             </SimpleGrid>
             <FormErrorMessage>{errors.schedule}</FormErrorMessage>
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

           <SimpleGrid columns={2} spacing={4} width="100%">
             <FormControl isRequired>
               <FormLabel>Tháng khai giảng</FormLabel>
               <Input
                 type="date"
                 value={formData.courseMonth}
                 onChange={(e) => setFormData(prev => ({
                   ...prev,
                   courseMonth: e.target.value
                 }))}
               />
             </FormControl>

             <FormControl isRequired isInvalid={!!errors.quantity}>
               <FormLabel>Số lượng học viên</FormLabel>
               <NumberInput
                 value={formData.quantity}
                 onChange={(_, value) => setFormData(prev => ({
                   ...prev,
                   quantity: value
                 }))}
                 min={1}
               >
                 <NumberInputField />
               </NumberInput>
               <FormErrorMessage>{errors.quantity}</FormErrorMessage>
             </FormControl>
           </SimpleGrid>
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
         >
           {mode === 'update' ? 'Cập nhật' : 'Tạo mới'}
         </Button>
       </ModalFooter>
     </ModalContent>
   </Modal>
 );
};