import { SearchIcon } from '@chakra-ui/icons';
import {
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';

interface CourseSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const CourseSearch = ({ value, onChange }: CourseSearchProps) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="Search courses..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
};