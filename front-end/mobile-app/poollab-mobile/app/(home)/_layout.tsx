import { View, Text } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import { theme } from "@/constants/theme";
import TabBar from "@/components/tabBar";
const _layout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Nhà",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="reserveScreen"
        options={{
          title: "Đặt bàn",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="qrScanner"
        options={{
          title: "QR",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="courseScreen"
        options={{
          title: "Khóa học",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profileScreen"
        options={{
          title: "Hồ sơ",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default _layout;
