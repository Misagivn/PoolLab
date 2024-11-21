import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getStoredTableData } from "@/api/tokenDecode";
import { theme } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import Button from "@/components/roundButton";
import { router } from "expo-router";
import { getAccountId, getUserName } from "@/data/userData";
import { deactive_table } from "@/api/billard_table";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountdownTimer from "@/components/countDownTimer";
const index = () => {
  const [tableData, setTableData] = useState([]);
  const [timeCanPlay, setTimeCanPlay] = useState([]);
  const [playTime, setPlayTime] = useState("01:00");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
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
        const playTime = await AsyncStorage.getItem("userPlayTime");
        if (playTime) {
          setPlayTime(playTime);
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
      }
    };
    loadStat();
  }, []);

  const endTableData = {
    billiardTableID: tableData.id,
    customerID: userId,
    customerTime: playTime.toString(),
  };
  const endTableDataTimeOut = {
    billiardTableID: tableData.id,
    customerID: userId,
    customerTime: "",
  };
  const endTableTimeOut = async () => {
    try {
      console.log("end table data: ", endTableDataTimeOut);
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
  const handleEndTable = async () => {
    try {
      console.log("end table data: ", endTableData);
      const response = await deactive_table(endTableData);
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
            initialTime={playTime.toString()}
            onComplete={endTableTimeOut}
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
                {tableData.bidaPrice + "/h"}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Thời gian chơi:</Text>
              <Text style={styles.infoBoxText}>{playTime.toString()}</Text>
            </View>
          </View>
          <View style={styles.buttonBox}>
            <Button
              title="Kết thúc phiên chơi"
              buttonStyles={[styles.startButton, styles.buttonCommon]}
              textStyles={styles.ButtonText}
              onPress={() => {
                handleEndTable();
              }}
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
});
