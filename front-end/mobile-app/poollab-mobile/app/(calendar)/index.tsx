import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import { get_all_booking } from "@/api/booking_api";
import { get_course_enroll_by_id } from "@/api/course_api";
import { Agenda } from "react-native-calendars";
import BackButton from "@/components/backButton";
import { getAccountId } from "@/data/userData";
import { $ } from "bun";
const index = () => {
  const [calendarsData, setCalendarsData] = useState<
    { [key: string]: any[] } | undefined
  >(undefined); //Allow undefined
  const loadAllBooking = async () => {
    console.log("loadAllBooking");
    const userId = await getAccountId();
    const data = {
      id: userId,
      status: "Đã Đặt",
    };

    try {
      const response = await get_all_booking(data);

      if (response?.data?.data) {
        const rawData = response.data.data.items;
        const bookingDateData = rawData.map((item: any) => item.bookingDate);
        const timeStart = rawData.map((item: any) => item.timeStart);
        const timeEnd = rawData.map((item: any) => item.timeEnd);
        const address = rawData.map((item: any) => item.address);
        const storeName = rawData.map((item: any) => item.storeName);
        const tableName = rawData.map((item: any) => item.tableName);
        const calendarData = await createCalendarsData(
          bookingDateData,
          timeStart,
          timeEnd,
          address,
          storeName,
          tableName
        );
        setCalendarsData(calendarData);
        return calendarData;
      }
    } catch (error) {
      console.error("Error loading stored store 1:", error);
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
  const loadCalendarItem = async () => {
    console.log("loadCalendarItem1");
    try {
      const calendarDataList = await loadAllBooking();
      setCalendarsData(calendarDataList);
    } catch (error) {
      console.error("Error in handleSearch:", error);
    }
  };
  useEffect(() => {
    loadCalendarItem();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <BackButton
        buttonStyles={{ marginTop: 5, marginLeft: 5, paddingLeft: 5 }}
      />
      <Agenda
        items={calendarsData}
        renderItem={(item, isFirst) => (
          <TouchableOpacity>
            <View style={styles.item}>
              <Text>{item.name}</Text>
              <Text>{item.data}</Text>
            </View>
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
  item2: {
    backgroundColor: theme.colors.greenCheck,
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
