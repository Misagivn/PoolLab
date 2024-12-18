import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getStoredTableData, getStoredTimeCus } from "@/api/tokenDecode";
import { theme } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import Button from "@/components/roundButton";
import DemoCustomTimeInput from "@/components/customTimeInput";
import { router } from "expo-router";
import { getAccountId } from "@/data/userData";
import { activate_table } from "@/api/billard_table";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "@/components/alertCustom";
import CustomDropdown from "@/components/customDropdown";
import Icon from "@/assets/icons/icons";
import { get_all_voucher } from "@/api/vouceher_api";
const index = () => {
  const [tableData, setTableData] = useState([]);
  const [timeCanPlay, setTimeCanPlay] = useState([]);
  const [playTime, setPlayTime] = useState("00:30");
  const [userId, setUserId] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [voucherData, setVoucherData] = useState([]);
  const [voucherId, setVoucherId] = useState("");
  const [maxTime, setMaxTime] = useState("");
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
        const storedTableData = await getStoredTableData();
        if (storedTableData) {
          setTableData(storedTableData.data.bidaTable);
          setTimeCanPlay(storedTableData.data.timeCus);
        }
      } catch (error) {
        console.error("Error loading stored table data:", error);
      }
      try {
        const accountId = await getAccountId();
        if (accountId) {
          setUserId(accountId);
          try {
            const voucherData = await get_all_voucher(accountId);
            const rawData = voucherData.data.data;
            const transformData = rawData.map(
              (item: { voucherName: any; id: any; discount: any }) => ({
                label: "Tên Voucher: " + item.voucherName,
                value: item.id,
                address: "Giảm giá: " + item.discount + "%",
              })
            );
            if (voucherData) {
              setVoucherData(transformData);
            }
          } catch (error) {
            console.error("Error loading voucher data:", error);
          }
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
      }
      try {
        const storedTimeCus = await getStoredTimeCus();
        console.log("storedTimeCus ", storedTimeCus);
        if (storedTimeCus === null) {
          setMaxTime("14:00");
        } else {
          setMaxTime(storedTimeCus);
        }
      } catch (error) {
        console.error("Error loading stored time cus:", error);
      }
    };
    loadStat();
  }, []);

  const startTableData = {
    billiardTableID: tableData.id,
    customerID: userId,
    customerTime: playTime,
    accountVoucherID: voucherId,
  };
  const handleStartTable = async () => {
    try {
      console.log("start table data: ", startTableData);
      const response = await activate_table(startTableData);
      console.log(response.data);
      if (response.data.status === 200) {
        AsyncStorage.setItem("userPlayTime", playTime);
        console.log("Table started successfully!");
        console.log("Data sau khi dat ", response.data);
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
            `*Lưu ý: Lượt chơi được tính theo từng ô 30 phút. Khi kích hoạt bàn,
            bạn đã khởi động ô đầu tiên và bị trừ theo các ô đã chơi. Ví du: Bạn
            đã chơi 28 phút, hệ thống sẽ trừ 30 phút. Hay 1h45p hệ thống sẽ trừ
            2 tiếng.
          </Text>
          <Text style={styles.warning}>
            **Chúng tôi sẽ trừ đi số tiền tương ứng với số thời gian bạn muốn
            chơi ngay lập tức. Sau khi kết thúc phiên chơi, thời gian còn lại sẽ
            được chúng tối trả lại cho bạn.
          </Text>
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
            <View style={styles.infoBox3}>
              <Text style={styles.infoBoxTitle}>Địa chỉ:</Text>
              <Text style={styles.infoBoxText}>{tableData.address}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Giá bàn:</Text>
              <Text style={styles.infoBoxText}>
                {Number(tableData.bidaPrice).toLocaleString("en-US") + "/h"}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Thời gian có thể chơi:</Text>
              <Text style={styles.infoBoxText}>{timeCanPlay}</Text>
            </View>
          </View>
          <View style={styles.imageBox}>
            <Image
              style={styles.image}
              source={
                tableData.image
                  ? { uri: tableData.image }
                  : require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")
              }
            />
          </View>
          <View style={styles.timeInput}>
            <Text style={styles.infoBoxTitle}>Thời gian chơi (HH:MM):</Text>
            <Text style={styles.warning}>***Phải cung cấp thời gian chơi.</Text>
            <DemoCustomTimeInput
              placeholder="Chọn thời gian chơi"
              onSelect={(time) => setPlayTime(time)}
              containerStyles={{
                backgroundColor: "white",
              }}
              modalStyles={{
                backgroundColor: "#fff",
              }}
              textStyles={{
                color: "#333",
              }}
              is24Hour={true}
              initialHour={0}
              initialMinute={30}
              minTime="00:30"
              maxTime={maxTime}
            />
          </View>
          <View>
            <Text style={styles.inputTitle}>Chọn Voucher:</Text>
            <CustomDropdown
              icon={
                <Icon
                  name="voucherIcon"
                  size={25}
                  strokeWidth={1.5}
                  color="black"
                />
              }
              placeholder="Chọn voucher"
              data={voucherData}
              onSelect={async (item) => {
                setVoucherId(item.value);
              }}
              onClear={() => {
                setVoucherId("");
              }}
            />
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
  infoBox3: {
    gap: 5,
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
  inputTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});
