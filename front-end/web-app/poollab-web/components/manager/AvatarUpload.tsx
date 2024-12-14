import { useRef } from 'react';
import { Box, Avatar, IconButton, Spinner } from '@chakra-ui/react';
import { Camera } from 'lucide-react';
import { useAccountInfo } from '@/hooks/useAccountInfo';

interface AvatarUploadProps {
  currentAvatarUrl: string;
  onAvatarChange: (url: string) => void;
  size?: string;
}

export const AvatarUpload = ({ 
  currentAvatarUrl, 
  onAvatarChange, 
  size = "2xl" 
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadAvatar } = useAccountInfo();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const avatarUrl = await uploadAvatar(file);
    if (avatarUrl) {
      onAvatarChange(avatarUrl);
    }
  };

  return (
    <Box position="relative" display="inline-block">
      <Avatar
        size={size}
        src={currentAvatarUrl || '/api/placeholder/150/150'}
        border="4px solid white"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <IconButton
        icon={isUploading ? <Spinner size="sm" /> : <Camera size={18} />}
        aria-label="Upload avatar"
        size="sm"
        colorScheme="blue"
        rounded="full"
        position="absolute"
        bottom="2"
        right="2"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      />
    </Box>
  );
};