import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const ReserveScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <CustomHeader />
        <Text>reseScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default ReserveScreen;

const styles = StyleSheet.create({
  container: {},
});
