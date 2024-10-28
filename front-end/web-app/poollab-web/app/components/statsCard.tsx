"use client";
import { Box, Text, Flex } from '@chakra-ui/react'
import { FC } from 'react'

interface StatsCardProps {
  title: string
  value: string
  percentage: number
  isIncrease: boolean
}

const StatsCard: FC<StatsCardProps> = ({ title, value, percentage, isIncrease }) => {
  return (
    <Box p="6" bg="white" rounded="lg" shadow="sm">
      <Text fontSize="lg" fontWeight="semibold">
        {title}
      </Text>
      <Text fontSize="3xl" fontWeight="bold" mt="2">
        {value}
      </Text>
      <Text
        fontSize="sm"
        color={isIncrease ? 'green.500' : 'red.500'}
        mt="2"
      >
        {isIncrease ? '↑' : '↓'} {percentage}%
      </Text>
    </Box>
  )
}

export default StatsCard