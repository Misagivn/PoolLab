import { View, Text } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";

const HomeLayout = () => {
  return (
    <Tabs>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen name="two" options={{ title: "two", headerShown: false }} />
    </Tabs>
  );
};

export default HomeLayout;
