"use client";
import React from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Button,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiDollarSign,
  FiShoppingCart,
  FiActivity,
} from "react-icons/fi";

const StatCard = ({ title, stat, icon, helpText }) => (
  <Stat
    px={{ base: 2, md: 4 }}
    py={"5"}
    shadow={"xl"}
    border={"1px solid"}
    borderColor={"gray.800"}
    rounded={"lg"}
  >
    <Flex justifyContent={"space-between"}>
      <Box pl={{ base: 2, md: 4 }}>
        <StatLabel fontWeight={"medium"} isTruncated>
          {title}
        </StatLabel>
        <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
          {stat}
        </StatNumber>
      </Box>
      <Box my={"auto"} color={"gray.800"} alignContent={"center"}>
        <Icon as={icon} w={8} h={8} />
      </Box>
    </Flex>
    <StatHelpText>{helpText}</StatHelpText>
  </Stat>
);

const AdminDashboardLanding = () => {
  return (
    <Box maxWidth="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <Heading as="h1" size="xl" mb={6}>
        Welcome to the Admin Dashboard
      </Heading>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={{ base: 5, lg: 8 }}
      >
        <StatCard
          title={"Users"}
          stat={"5,000"}
          icon={FiUsers}
          helpText={"Total registered users"}
        />
        <StatCard
          title={"Revenue"}
          stat={"$21,000"}
          icon={FiDollarSign}
          helpText={"Last 30 days"}
        />
        <StatCard
          title={"Orders"}
          stat={"1,000"}
          icon={FiShoppingCart}
          helpText={"Completed orders this month"}
        />
        <StatCard
          title={"Conversion Rate"}
          stat={"5.20%"}
          icon={FiActivity}
          helpText={"Compared to last month (4.90%)"}
        />
      </SimpleGrid>

      <Heading as="h2" size="lg" mt={10} mb={6}>
        Quick Actions
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
        <Button colorScheme="blue" leftIcon={<FiUsers />}>
          Manage Users
        </Button>
        <Button colorScheme="green" leftIcon={<FiShoppingCart />}>
          View Orders
        </Button>
        <Button colorScheme="purple" leftIcon={<FiDollarSign />}>
          Financial Reports
        </Button>
        <Button colorScheme="orange" leftIcon={<FiActivity />}>
          Analytics
        </Button>
      </SimpleGrid>
    </Box>
  );
};

export default AdminDashboardLanding;
