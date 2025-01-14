import { useToast } from "@chakra-ui/react";
import useNotification from "@/hooks/useNotification";
import { useEffect } from "react";

const StaffNotification: React.FC = () => {
  const { notifications } = useNotification();
  const toast = useToast();

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      toast({
        title: "Thông Báo",
        description: notifications,
        status: "info",
        duration: 4000,
        isClosable: true,
        position: "top-right", // Hiển thị ở góc phải trên
      });
    }
  }, [notifications, toast]);

  return null;
};

export default StaffNotification;
