"use client";
import { Box, Text } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'

interface ChartCardProps {
  title: string
  children: ReactNode
}

const ChartCard: FC<ChartCardProps> = ({ title, children }) => {
  return (
    <Box p="6" bg="white" rounded="lg" shadow="sm">
      <Text fontSize="lg" fontWeight="semibold" mb="4">
        {title}
      </Text>
      {children}
    </Box>
  )
}

export default ChartCard