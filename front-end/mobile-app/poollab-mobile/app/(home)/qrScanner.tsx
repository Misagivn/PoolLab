import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useCameraPermissions } from "expo-camera";
const qrScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  return (
    <View>
      <Text>qrScanner</Text>
    </View>
  );
};

export default qrScanner;

const styles = StyleSheet.create({});
