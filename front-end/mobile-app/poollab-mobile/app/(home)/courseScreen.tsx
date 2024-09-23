import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
const CourseScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <CustomHeader />
        <Text>courseScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default CourseScreen;

const styles = StyleSheet.create({
  container: {},
});
