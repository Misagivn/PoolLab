import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/backButton";
import { BarcodeScanner } from "expo-barcode-scanner";
import { StatusBar } from "expo-status-bar";
const index = () => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [scanData, setScanData] = React.useState();

  useEffect(() => {
    async () => {
      const { status } = await BarcodeScanner.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
  }, []);

  if (!hasPermission) {
    return;
    <View style={styles.container}>
      <Text>Please grant camera the permission</Text>
    </View>;
  }
  const handleBarCodeScanned = ({ type, data }) => {
    setScanData(data);
    console.log(`Data: ${data}`);
    console.log(`Type: ${type}`);
    // setScanData(data);
  };

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <BackButton />
      <View style={styles.container}>
        <BarcodeScanner
          onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
