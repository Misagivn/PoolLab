"use client";
import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Spinner,
  Text,
  Flex,
  Badge,
  SimpleGrid
} from '@chakra-ui/react';
import { useConfig } from '@/hooks/useConfig';

export const ConfigPage: React.FC = () => {
  const { config, loading, fetchConfig, updateConfig } = useConfig();
  const [formData, setFormData] = React.useState({
    timeAllowBook: 0,
    timeDelay: 0,
    timeHold: 0,
    timeCancelBook: 0,
    deposit: 0,
    monthLimit: 0,
    dayLimit: 0
  });

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (config) {
      setFormData({
        timeAllowBook: config.timeAllowBook,
        timeDelay: config.timeDelay,
        timeHold: config.timeHold,
        timeCancelBook: config.timeCancelBook,
        deposit: config.deposit,
        monthLimit: config.monthLimit,
        dayLimit: config.dayLimit
      });
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(formData).some(val => val < 0)) {
      alert("Có giá trị là số âm vui lòng nhập lại");
      return;
    }
    await updateConfig(formData);
  };

  if (loading && !config) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }


  return (
    <Box p={6}>
      <Card>
        <CardHeader>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="lg">Cấu hình hệ thống</Heading>
            {config && (
              <Badge colorScheme={config.status === 'Hoạt Động' ? 'green' : 'red'}>
                {config.status}
              </Badge>
            )}
          </Flex>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="100%">
                <FormControl>
                  <FormLabel>Thời gian cho phép đặt (phút)</FormLabel>
                  <Input
                    type="number"
                    value={formData.timeAllowBook}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timeAllowBook: Number(e.target.value)
                    }))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Thời gian trễ (phút)</FormLabel>
                  <Input
                    type="number"
                    value={formData.timeDelay}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timeDelay: Number(e.target.value)
                    }))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Thời gian giữ bàn (phút)</FormLabel>
                  <Input
                    type="number"
                    value={formData.timeHold}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timeHold: Number(e.target.value)
                    }))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Thời gian hủy đặt (phút)</FormLabel>
                  <Input
                    type="number"
                    value={formData.timeCancelBook}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timeCancelBook: Number(e.target.value)
                    }))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Tiền đặt cọc (VNĐ)</FormLabel>
                  <Input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      deposit: Number(e.target.value)
                    }))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Giới hạn tháng</FormLabel>
                  <Input
                    type="number"
                    min={0}
                    max={12}
                    value={formData.monthLimit}
                    // onChange={(e) => setFormData(prev => ({
                    //   ...prev,
                    //   monthLimit: Number(e.target.value)
                    // }))}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(12, Number(e.target.value)));
                      setFormData(prev => ({...prev, monthLimit : value}));
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Giới hạn ngày</FormLabel>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={formData.dayLimit}
                    // onChange={(e) => setFormData(prev => ({
                    //   ...prev,
                    //   dayLimit: Number(e.target.value)
                    // }))}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(30, Number(e.target.value)));
                      setFormData(prev => ({...prev, dayLimit: value}));
                    }}
                  />
                </FormControl>
              </SimpleGrid>

              {config && (
                <Box width="100%" fontSize="sm" color="gray.600">
                  <Text>Ngày tạo: {new Date(config.createdDate).toLocaleDateString('vi-VN')}</Text>
                  <Text>Cập nhật lần cuối: {new Date(config.updateDate).toLocaleDateString('vi-VN')}</Text>
                </Box>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={loading}
              >
                Cập nhật cấu hình
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ConfigPage;