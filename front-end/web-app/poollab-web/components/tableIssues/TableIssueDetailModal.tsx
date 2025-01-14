import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  HStack,
  VStack,
  Text,
  Image,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { TableIssue } from '@/utils/types/tableIssues.types';

interface TableIssueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: TableIssue | null;
}

export const TableIssueDetailModal = ({
  isOpen,
  onClose,
  issue
}: TableIssueDetailModalProps) => {
  if (!issue) return null;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết sự cố</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            {issue.issueImg && issue.issueImg !== "string" && (
              <Image
                src={issue.issueImg}
                alt="Issue Image"
                width="100%"
                height="300px"
                objectFit="cover"
                borderRadius="md"
              />
            )}

            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="xl">Mã sự cố: {issue.tableIssuesCode}</Text>
                <Badge colorScheme={issue.status === 'Thanh Toán' ? 'green' : 'yellow'}>
                  {issue.status}
                </Badge>
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="medium">Bàn:</Text>
                <Text>{issue.billiardName}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="medium">Trạng thái sửa chữa:</Text>
                <Badge colorScheme={issue.repairStatus === 'Hoàn Thành' ? 'green' : 'yellow'}>
                  {issue.repairStatus}
                </Badge>
              </HStack>

              <VStack align="start" spacing={1}>
                <Text fontWeight="medium">Mô tả sự cố:</Text>
                <Text>{issue.descript}</Text>
              </VStack>

              <HStack justify="space-between">
                <Text fontWeight="medium">Chi phí ước tính:</Text>
                <Text>{formatPrice(issue.estimatedCost)}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="medium">Người báo cáo:</Text>
                <Text>{issue.reportedBy}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="medium">Phương thức thanh toán:</Text>
                <Text>{issue.paymentMethod}</Text>
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="medium">Ngày tạo:</Text>
                <Text>{formatDateTime(issue.createdDate)}</Text>
              </HStack>

              {issue.updatedDate && (
                <HStack justify="space-between">
                  <Text fontWeight="medium">Cập nhật lần cuối:</Text>
                  <Text>{formatDateTime(issue.updatedDate)}</Text>
                </HStack>
              )}
            </VStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};