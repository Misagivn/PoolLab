import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getStoredTableDataReserve } from "@/api/tokenDecode";
import { theme } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import Button from "@/components/roundButton";
import DemoCustomTimeInput from "@/components/customTimeInput";
import { router } from "expo-router";
import { getAccountId, getUserName } from "@/data/userData";
import { activate_table } from "@/api/billard_table";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "@/components/alertCustom";
const index = () => {
  const [tableData, setTableData] = useState([]);
  const [userId, setUserId] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const alertPopup = (title, message, confirmText, cancelText) => {
    return (
      <CustomAlert
        visible={alertVisible}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          setAlertVisible(false);
          setErrorResponse("");
        }}
        onCancel={() => {}}
      />
    );
  };
  useEffect(() => {
    const loadStat = async () => {
      try {
        const storedTableData = await getStoredTableDataReserve();
        if (storedTableData) {
          setTableData(storedTableData.data);
          console.log(storedTableData.data);
        }
      } catch (error) {
        console.error("Error loading stored table data:", error);
      }
      try {
        const accountId = await getAccountId();
        if (accountId) {
          setUserId(accountId);
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
      }
    };
    getStoredTableDataReserve();
    getAccountId();
    loadStat();
  }, []);

  const startTableData = {
    billiardTableID: tableData.id,
    customerID: userId,
    customerTime: "",
  };
  const handleStartTable = async () => {
    try {
      console.log("start table data: ", startTableData);
      const response = await activate_table(startTableData);
      if (response.data.status === 200) {
        AsyncStorage.setItem("userPlayTimeReserve", response.data.data);
        router.replace("./(tableFunction)");
      } else if (response.data.status === 400) {
        setAlertVisible(true);
        setErrorResponse(response.data.message);
      }
    } catch (error) {
      console.error("Error starting table:", error);
    }
  };
  if (alertVisible) {
    return alertPopup("Lỗi", errorResponse, "OK", "Huy");
  }
  return (
    <SafeAreaView style={{ marginTop: 30 }}>
      <StatusBar hidden={false} style="dark" />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Thông tin </Text>
            <Text style={styles.subTitle}>kích hoạt bàn chơi.</Text>
          </View>
          <Text style={styles.warning}>
            `*Lưu ý: Thời gian chơi tương ứng với thời gian mà bạn đã đặt bàn.
          </Text>
          <Text style={styles.warning}></Text>
          <View style={styles.outerBox}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Tên bàn:</Text>
              <Text style={styles.infoBoxText}>{tableData.name}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Loại bàn:</Text>
              <Text style={styles.infoBoxText}>
                {tableData.billiardTypeName}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Khu vực chơi:</Text>
              <Text style={styles.infoBoxText}>{tableData.areaName}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Tên quán:</Text>
              <Text style={styles.infoBoxText}>{tableData.storeName}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Địa chỉ:</Text>
              <Text style={styles.infoBoxText}>{tableData.address}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Giá bàn:</Text>
              <Text style={styles.infoBoxText}>
                {Number(tableData.bidaPrice).toLocaleString("en-US") + "/h"}
              </Text>
            </View>
          </View>
          <View style={styles.imageBox}>
            <Image style={styles.image} source={{ uri: tableData.image }} />
          </View>
          <View style={styles.buttonBox}>
            <Button
              title="KÍCH HOẠT"
              buttonStyles={[styles.startButton, styles.buttonCommon]}
              textStyles={styles.ButtonText}
              onPress={() => {
                handleStartTable();
              }}
              // loading={isLoading}
            />
            <Button
              title="HỦY"
              buttonStyles={[styles.cancelButton, styles.buttonCommon]}
              textStyles={styles.ButtonText}
              onPress={() => {
                router.replace("../(home)");
              }}
              // loading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 15,
    shadowColor: "black",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  titleBox: {},
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  subTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  warning: {
    color: "red",
    fontSize: 10,
  },
  outerBox: {
    marginTop: 20,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoBoxTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoBoxText: {
    fontSize: 15,
  },
  imageBox: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  image: {
    alignSelf: "center",
    width: 300,
    height: 300,
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  buttonCommon: {
    flex: 1,
    marginHorizontal: 8, // Add some spacing between buttons
  },
  startButton: {
    objectFit: "fill",
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
  },
  ButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    objectFit: "fill",
    backgroundColor: theme.colors.hightLight,
    borderRadius: 10,
  },
  timeInput: {
    marginTop: 10,
  },
});
