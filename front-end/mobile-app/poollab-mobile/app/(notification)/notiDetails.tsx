import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/backButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { get_noti_id } from "@/api/tokenDecode";
import { getUnreadNotiById } from "@/api/NotiAPI";
import { theme } from "@/constants/theme";

const notiDetails = () => {
  const [notiTitle, setNotiTItle] = useState("");
  const [notiContent, setNotiContent] = useState("");
  const [notiDate, setNotiDate] = useState("");
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
    const id = await get_noti_id();
    console.log("id: ", id);
    try {
      const response = await getUnreadNotiById(id);
      if (response.data.status === 200) {
        setNotiTItle(response.data.data.title);
        setNotiContent(response.data.data.descript);
        setNotiDate(formatTime(response.data.data.createdDate));
      } else {
        console.log("Error: ", response.data.message);
      }
      console.log(response);
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  useEffect(() => {
    fecthData();
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <BackButton />
        <View style={styles.searchBox}>
          <Text style={styles.notiTile}>{notiTitle}</Text>
          <Text style={styles.notiContent}>{notiContent}</Text>
          <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
            <Text style={styles.notiDate}>{notiDate}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default notiDetails;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  Title: {
    fontSize: 25,
    fontWeight: "medium",
  },
  searchBox: {
    alignItems: "center",
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
    gap: 10,
  },
  notiTile: {
    fontSize: 25,
    fontWeight: "medium",
    color: theme.colors.primary,
  },
  notiContent: {
    fontSize: 20,
    fontWeight: "medium",
  },
  notiDate: {
    fontSize: 15,
    fontWeight: "medium",
    color: theme.colors.gray,
  },
});
