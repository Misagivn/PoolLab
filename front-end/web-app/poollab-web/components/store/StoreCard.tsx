import { useState } from 'react';
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Box,
  Image,
} from '@chakra-ui/react';
import { Store } from '@/utils/types/store';
import { storeApi } from '@/apis/store.api';

interface StoreFormProps {
  initialData?: Partial<Store>;
  onSubmit: (data: Partial<Store>) => Promise<void>;
  onCancel: () => void;
}

export const StoreForm = ({ initialData, onSubmit, onCancel }: StoreFormProps) => {
  const [formData, setFormData] = useState(initialData || {});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try {
        const response = await storeApi.uploadImage(e.target.files[0]);
        setFormData(prev => ({ ...prev, storeImg: response.url }));
      } catch (error) {
        toast({ status: 'error', title: 'Failed to upload image' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      toast({ status: 'success', title: 'Store saved successfully' });
    } catch (error) {
      toast({ status: 'error', title: 'Failed to save store' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={formData.name || ''}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </FormControl>
        
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Input
            value={formData.address || ''}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <Input
            value={formData.phoneNumber || ''}
            onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            value={formData.descript || ''}
            onChange={e => setFormData(prev => ({ ...prev, descript: e.target.value }))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Opening Time</FormLabel>
          <Input
            type="time"
            value={formData.timeStart || ''}
            onChange={e => setFormData(prev => ({ ...prev, timeStart: e.target.value }))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Closing Time</FormLabel>
          <Input
            type="time"
            value={formData.timeEnd || ''}
            onChange={e => setFormData(prev => ({ ...prev, timeEnd: e.target.value }))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Store Image</FormLabel>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {formData.storeImg && (
            <Box mt={2}>
              <Image src={formData.storeImg} alt="Store" maxH="200px" />
            </Box>
          )}
        </FormControl>

        <Stack direction="row" spacing={4}>
          <Button type="submit" colorScheme="blue" isLoading={loading}>
            Save
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Stack>
      </Stack>
    </form>
  );
};