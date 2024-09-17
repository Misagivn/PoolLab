import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/screenWrapper";

const index = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Text>index</Text>
      <Button
        title="go to welcome"
        onPress={() => router.push("welcomeScreen")}
      />
    </ScreenWrapper>
  );
};

export default index;
