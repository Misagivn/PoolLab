import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
const index = () => {
  return (
    <SafeAreaView>
      <StatusBar hidden={false} style="dark" />
      <View style={styles.container}>
        <CustomHeader />
        <Text>index</Text>
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {},
});
