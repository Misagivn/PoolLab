import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/backButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUnreadNoti } from "@/api/NotiAPI";
import { theme } from "@/constants/theme";
import { getAccountId } from "@/data/userData";
import Icon from "@/assets/icons/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const index = () => {
  const [noti, setNoti] = useState([]);
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);

    // Vietnamese day names
    const daysOfWeek = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];

    // Vietnamese month names
    const monthNames = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    // Format: "Thứ Hai, 27 Tháng 11, 2024 lúc 08:20:49"
    return `${daysOfWeek[date.getDay()]}, ${date.getDate()} ${
      monthNames[date.getMonth()]
    }, ${date.getFullYear()} lúc ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };
  const fecthData = async () => {
    const id = await getAccountId();
    try {
      const response = await getUnreadNoti(id);
      if (response.data.status === 200) {
        setNoti(response.data.data.items);
      } else {
        console.log("Error: ", response.data.message);
      }
      console.log(response);
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const goToDetails = (id) => {
    console.log("Go to details, id: ", id);
    AsyncStorage.setItem("notiId", JSON.stringify(id));
    router.push("/notiDetails");
  };
  useEffect(() => {
    fecthData();
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <BackButton />
        {noti.length === 0 ? (
          <Text style={styles.Title}>Không có thông báo</Text>
        ) : (
          noti.map((item) => (
            <Pressable onPress={() => goToDetails(item.id)}>
              <View
                key={item.id}
                style={item.isRead ? styles.searchBox1 : styles.searchBox}
              >
                <View
                  style={{
                    flexDirection: "column",
                  }}
                >
                  <Text style={styles.notiTile}>{item.title}</Text>
                  <Text style={styles.notiContent}>
                    {formatTime(item.createdDate)}
                  </Text>
                </View>
                <View>
                  <Icon
                    name="arrowRight"
                    size={20}
                    strokeWidth={3}
                    color="black"
                  />
                </View>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  Title: {
    fontSize: 25,
    fontWeight: "medium",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    justifyContent: "flex-start",
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
    gap: 140,
  },
  searchBox1: {
    opacity: 0.5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    justifyContent: "flex-start",
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
    gap: 140,
  },
  notiTile: {
    fontSize: 15,
    fontWeight: "medium",
  },
  notiContent: {
    fontSize: 10,
    fontWeight: "medium",
  },
});
