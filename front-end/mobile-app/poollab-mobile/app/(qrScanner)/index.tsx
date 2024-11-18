import { StyleSheet, Text, Vibration, View } from "react-native";
import React, { useState } from "react";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/roundButton";

const index = () => {
  const [hasCameraPermission, setHasCameraPermission] = useCameraPermissions();
  const [scanningEnable, setScanningEnable] = useState(true);
  if (!hasCameraPermission) {
    <SafeAreaView>
      <View style={styles.requestCamera}>
        <Text>
          Ứng dụng cần quyền sử dụng camera để sử dụng chức năng quét QR
        </Text>
        <Button
          title={"Cấp quyền sử dụng camera"}
          buttonStyles={undefined}
          textStyles={undefined}
          onPress={() => {
            setHasCameraPermission;
          }}
        />{" "}
      </View>
    </SafeAreaView>;
  }
  async function onBarcodeScanned({ data }: BarcodeScanningResult) {
    if (!scanningEnable) return;
    try {
      Vibration.vibrate(500);
      console.log(data);
      setScanningEnable(false);
    } catch (error) {
      console.log(error);
      setScanningEnable(false);
    }
  }
  return (
    <CameraView
      // style={}
      facing="back"
      onBarcodeScanned={onBarcodeScanned}
      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
    />
  );
};

export default index;

const styles = StyleSheet.create({
  requestCamera: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
});
