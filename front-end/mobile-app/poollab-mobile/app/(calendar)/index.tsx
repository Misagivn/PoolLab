import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import CustomDropdown from "@/components/customDropdown";
import {
  get_user_booking_recurring,
  get_user_booking_recurring_by_id,
  get_all_booking,
} from "@/api/booking_api";
import Icon from "@/assets/icons/icons";
import { getStoredUser } from "@/api/tokenDecode";
import { Agenda } from "react-native-calendars";
import Button from "@/components/roundButton";
import BackButton from "@/components/backButton";
import { store } from "expo-router/build/global-state/router-store";
const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reserveData, setReserveData] = useState([]);
  const [reserveId, setReserveId] = useState("");
  const [calendarsData, setCalendarsData] = useState<
    { [key: string]: any[] } | undefined
  >(undefined); //Allow undefined
  const loadAllBooking = async () => {
    const storedUser = await getStoredUser();
    const data = {
      id: storedUser.AccountId,
      status: "Đã Đặt",
    };
    setIsLoading(true);
    try {
      const response = await get_all_booking(data);
      if (response?.data?.data) {
        const rawData1 = response.data.data.items;
        const bookingDateData = rawData1.map((item) => item.bookingDate);
        const timeStart = rawData1.map((item) => item.timeStart);
        const timeEnd = rawData1.map((item) => item.timeEnd);
        const address = rawData1.map((item) => item.address);
        const storeName = rawData1.map((item) => item.storeName);
        const tableName = rawData1.map((item) => item.tableName);
        const calendarData = createCalendarsData(
          bookingDateData,
          timeStart,
          timeEnd,
          address,
          storeName,
          tableName
        );
        setCalendarsData(calendarData);
        setIsLoading(false);
        return calendarData;
      }
    } catch (error) {
      console.error("Error loading stored store:", error);
      setIsLoading(false);
      return {};
    }
  };
  const createCalendarsData = (
    bookingDateData: string[],
    timeStart: string[],
    timeEnd: string[],
    address: string[],
    storeName: string[],
    tableName: string[]
  ) => {
    const calendarData: { [key: string]: any[] } = {};

    // Use the length of bookingDateData to iterate
    bookingDateData.forEach((date, index) => {
      if (!calendarData[date]) {
        calendarData[date] = [];
      }

      calendarData[date].push({
        name: `Thời gian chơi: ${timeStart[index]} - ${timeEnd[index]}`,
        data: `Địa điểm: ${address[index]} - ${storeName[index]} - ${tableName[index]}`,
      });
    });

    return calendarData;
  };

  // const handelSearch = async () => {
  //   try {
  //     const calendarData = await loadReserveInfoById();
  //     setCalendarsData(calendarData);
  //     return calendarData;
  //   } catch (error) {
  //     console.error("Error in handleSearch:", error);
  //   }
  // };
  const loadCalendarItem = async () => {
    try {
      const calendarData = await loadAllBooking();
      setCalendarsData(calendarData);
      return calendarData;
    } catch (error) {
      console.error("Error in handleSearch:", error);
    }
  };
  useEffect(() => {
    loadCalendarItem();
    // loadAllBooking();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <BackButton
        buttonStyles={{ marginTop: 5, marginLeft: 5, paddingLeft: 5 }}
      />
      <Agenda
        items={calendarsData}
        renderItem={(item, isFirst) => (
          <TouchableOpacity style={styles.item}>
            <Text>{item.name}</Text>
            <Text>{item.data}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  item: {
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
});
