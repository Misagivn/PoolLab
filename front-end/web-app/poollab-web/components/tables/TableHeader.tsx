import { Flex, Heading, Button, Icon, useDisclosure } from '@chakra-ui/react';
import { FiPlusSquare } from 'react-icons/fi';
import { CreateTableModal } from './CreateTableModal';

interface TableHeaderProps {
  onTableCreated: () => void;
}

export const TableHeader = ({ onTableCreated }: TableHeaderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex justify="space-between" align="center">
        <Heading size="lg">Quản lý bàn Billiard</Heading>
        <Button
          leftIcon={<Icon as={FiPlusSquare} />}
          colorScheme="blue"
          onClick={onOpen}
        >
          Thêm bàn mới
        </Button>
      </Flex>

      <CreateTableModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onTableCreated}
      />
    </>
  );
};