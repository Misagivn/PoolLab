import { SafeAreaView, StyleSheet, Text, Vibration, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import Button from "@/components/roundButton";
import QRScannerOverlay from "@/components/qrScannerOverlay";
import { getAccountId } from "@/data/userData";
import { get_tables_by_QR } from "@/api/billard_table";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import CustomAlert from "@/components/alertCustom";
const qrScanner = () => {
  const [hasCameraPermission, setHasCameraPermission] = useCameraPermissions();
  const [scanningEnable, setScanningEnable] = useState(true);
  const [customerId, setCustomerId] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [exceptionResponse, setExceptionResponse] = useState("");
  const alertPopup = (
    title,
    message,
    confirmText,
    cancelText,
    successConfirm
  ) => {
    return (
      <CustomAlert
        visible={alertVisible}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          if (errorResponse) {
            setAlertVisible(false);
            setErrorResponse("");
            setScanningEnable(true);
          } else if (exceptionResponse) {
            setAlertVisible(false);
            setExceptionResponse("");
            setScanningEnable(true);
            router.replace("../(qrScanner)");
          }
        }}
        onCancel={() => {}}
      />
    );
  };
  useEffect(() => {
    const loadStat = async () => {
      try {
        const accountId = await getAccountId();
        if (accountId) {
          setCustomerId(accountId);
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
      }
    };
    loadStat();
  }, []);
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
      setScanningEnable(false);
      try {
        const openTableData = {
          billiardTableId: data,
          customerId: customerId,
        };
        const response = await get_tables_by_QR(openTableData);
        console.log("QR scanner: ", response.data);
        if (response.data.status === 200) {
          AsyncStorage.multiSet([
            ["tableData", JSON.stringify(response.data)],
            ["tableInfo", JSON.stringify(response.data.data)],
          ]);
          router.replace("../(qrScanner)");
          setScanningEnable(false);
        } else if (response.data.status === 203) {
          AsyncStorage.multiSet([
            ["tableDataReserve", JSON.stringify(response.data)],
            ["tableInfoReserve", JSON.stringify(response.data.data)],
          ]);
          router.replace("../(memberReserve)");
        } else if (response.data.status === 202) {
          AsyncStorage.multiSet([
            ["tableData", JSON.stringify(response.data)],
            ["tableInfo", JSON.stringify(response.data.data)],
            ["timeCus", JSON.stringify(response.data.data.timeCus)],
          ]);
          setAlertVisible(true);
          setExceptionResponse(response.data.message);
          setScanningEnable(false);
        } else {
          console.log(response.data);
          setAlertVisible(true);
          setErrorResponse(response.data.message);
          setScanningEnable(false);
        }
      } catch (error) {
        console.log(error);
        setScanningEnable(false);
      }
      setScanningEnable(false);
    } catch (error) {
      console.log(error);
      setScanningEnable(false);
    }
  }

  if (alertVisible) {
    if (errorResponse) {
      return alertPopup("Thông báo", errorResponse, "OK", "Huy");
    } else if (exceptionResponse) {
      return alertPopup("Thông báo", exceptionResponse, "OK", "Huy");
    }
  }
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <StatusBar hidden={false} style="light" />
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={onBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <QRScannerOverlay />
    </View>
  );
};

export default qrScanner;

const styles = StyleSheet.create({
  requestCamera: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
});
