import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  VStack,
  Text,
  Box,
  Image,
  HStack,
  Button,
  Icon,
  useToast
} from '@chakra-ui/react';
import { FiEdit2 } from 'react-icons/fi';
import { Area } from '@/utils/types/area.types';

interface AreaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: Area | null;
}

export const AreaDetailModal = ({ isOpen, onClose, area }: AreaDetailModalProps) => {
  const toast = useToast();

  if (!area) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết khu vực</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={6}>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="xl">
                {area.name}
              </Text>
              <Text color="gray.600">
                {area.descript || "Chưa có mô tả"}
              </Text>
            </VStack>

            {area.areaImg && (
              <Box borderRadius="md" overflow="hidden">
                <Image 
                  src={area.areaImg} 
                  alt={area.name}
                  width="100%"
                  height="auto"
                />
              </Box>
            )}

            <HStack spacing={2} justify="flex-end">
              <Button
                leftIcon={<Icon as={FiEdit2} />}
                size="sm"
                onClick={() => {
                  toast({
                    title: "Thông báo",
                    description: "Tính năng sẽ sớm được cập nhật",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              >
                Chỉnh sửa
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};