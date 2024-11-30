import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { getStoredTableDataReserve } from "@/api/tokenDecode";
import { theme } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import Button from "@/components/roundButton";
import { router } from "expo-router";
import { getAccountId, getUserName } from "@/data/userData";
import { deactive_table } from "@/api/billard_table";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountdownTimer from "@/components/countDownTimer";
import product from "./product";
const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [timeCanPlay, setTimeCanPlay] = useState([]);
  const [playTime, setPlayTime] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [havePlay, setHavePlay] = useState("");
  useEffect(() => {
    const loadStat = async () => {
      try {
        const storedTableData = await getStoredTableDataReserve();
        if (storedTableData) {
          setTableData(storedTableData.data);
          setTimeCanPlay(storedTableData.data.timeCus);
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
      try {
        const userName = await getUserName();
        if (userName) {
          setUserName(userName);
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
      }
      try {
        const playTime = await AsyncStorage.getItem("userPlayTimeReserve");
        if (playTime) {
          console.log("playTime: ", playTime);
          setPlayTime(playTime);
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
      }
    };
    loadStat();
  }, []);

  const endTableDataTimeOut = {
    billiardTableID: tableData.id,
    customerID: userId,
    customerTime: "",
  };
  const calculateHavePlayTime = (playTime, remainingTime) => {
    try {
      // Validate inputs
      if (!playTime || !remainingTime) {
        console.log("Invalid inputs:", { playTime, remainingTime });
        return "00:00";
      }

      // Convert playTime (format "HH:MM") to minutes
      const [playHours, playMinutes] = playTime.split(":").map(Number);
      const totalPlayMins = playHours * 60 + playMinutes;

      // Convert remainingTime (format "HH:MM") to minutes
      const [remainHours, remainMinutes] = remainingTime.split(":").map(Number);
      const totalRemainMins = remainHours * 60 + remainMinutes;

      // Calculate actual played minutes
      const playedMinutes = totalPlayMins - totalRemainMins;

      // Handle negative time (in case of errors)
      if (playedMinutes < 0) {
        return "00:00";
      }

      // If played minutes are less than 30, round up to 30 minutes
      const roundedMinutes =
        playedMinutes < 30 ? 30 : Math.floor(playedMinutes / 30) * 30;

      // Convert back to HH:MM format
      const hours = Math.floor(roundedMinutes / 60);
      const minutes = roundedMinutes % 60;

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    } catch (error) {
      console.error("Error calculating play time:", error);
      return "00:00";
    }
  };

  const endTableTimeOut = async () => {
    try {
      console.log("end table data time out: ", endTableDataTimeOut);
      const response = await deactive_table(endTableDataTimeOut);
      if (response.status === 200) {
        console.log("Table ended successfully!");
        console.log("Data sau khi dat ", response.data);
        router.replace("../../(home)");
      } else {
        console.error("Error ending table:", response.data);
      }
    } catch (error) {
      console.error("Error ending table:", error);
    }
  };
  const timerRef = React.useRef();
  const handleEndTable = async () => {
    setIsLoading(true);
    if (timerRef.current) {
      const remainingTime = timerRef.current.getRemainingTime();
      // Call your handleEndTable logic here
      timerRef.current.stopTimer();
      console.log("Timer stopped at 2:", remainingTime);
      setTimeRemaining(remainingTime);
      const calculatedPlayTime = calculateHavePlayTime(playTime, remainingTime);
      console.log("calculatedPlayTime: ", calculatedPlayTime);
      setHavePlay(calculatedPlayTime);
      const endTableData = {
        billiardTableID: tableData.id,
        customerID: userId,
        customerTime: calculatedPlayTime,
      };
      try {
        console.log("end table data: ", endTableData);
        const response = await deactive_table(endTableData);
        if (response.status === 200) {
          console.log("Table ended successfully!");
          setIsLoading(false);
          console.log("Data sau khi dat ", response.data);
          router.replace("../../(home)");
        } else {
          console.error("Error ending table:", response);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error ending table:", error);
      }
    } else {
      console.log("Timer not found");
    }
  };
  return (
    <SafeAreaView style={{ marginTop: 30 }}>
      <StatusBar hidden={false} style="dark" />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Thông tin </Text>
            <Text style={styles.subTitle}>phiên chơi.</Text>
          </View>
          <CountdownTimer
            ref={timerRef}
            initialTime={playTime}
            onComplete={endTableTimeOut}
            onStop={(remainingTime) => {
              console.log("Timer stopped at 1:", remainingTime);
            }}
          />
          <View style={styles.outerBox}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Tên người dùng:</Text>
              <Text style={styles.infoBoxText}>{userName}</Text>
            </View>
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
              <Text style={styles.infoBoxTitle}>Thời gian chơi (hh:mm):</Text>
              <Text style={styles.infoBoxText}>{playTime.toString()}</Text>
            </View>
          </View>
          <View style={styles.buttonBox}>
            <Button
              title="KẾT THÚC PHIÊN CHƠI"
              buttonStyles={[styles.startButton, styles.buttonCommon]}
              textStyles={styles.ButtonText}
              onPress={() => {
                handleEndTable();
              }}
              loading={isLoading}
            />
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Mua sản phẩm</Text>
            <Text style={styles.subTitle}>có trong hệ thống</Text>
            <Button
              title="ĐẶT SẢN PHẨM"
              buttonStyles={styles.productButton}
              textStyles={styles.ButtonText}
              onPress={() => {
                router.push("./product");
              }}
              loading={isLoading}
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
    borderRadius: 20,
    borderCurve: "continuous",
  },
  image: {
    alignSelf: "center",
    width: 300,
    height: 400,
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
  timeInput: {},
  productButton: {
    backgroundColor: theme.colors.greenCheck,
    borderRadius: 10,
    marginTop: 10,
  },
});
