import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import { get_course_enroll_by_id } from "@/api/course_api";
import { Agenda } from "react-native-calendars";
import BackButton from "@/components/backButton";
import { getAccountId } from "@/data/userData";
const index = () => {
  const [calendarsData, setCalendarsData] = useState<
    { [key: string]: any[] } | undefined
  >(undefined); //Allow undefined
  const loadAllBooking = async () => {
    console.log("loadAllBooking");
    const userId = await getAccountId();
    const data = {
      id: userId,
      status: "Kích hoạt",
    };

    try {
      const response = await get_course_enroll_by_id(data);

      if (response?.data?.data) {
        const rawData = response.data.data.items;
        const bookingDateData = rawData.map((item: any) => item.courseDate);
        const title = rawData.map((item: any) => item.title);
        const mentorName = rawData.map((item: any) => item.mentorName);
        const timeStart = rawData.map((item: any) => item.startTime);
        const timeEnd = rawData.map((item: any) => item.endTime);
        const address = rawData.map((item: any) => item.address);
        const storeName = rawData.map((item: any) => item.storeName);
        const price = rawData.map((item: any) => item.price);
        const calendarData = await createCalendarsData(
          bookingDateData,
          title,
          mentorName,
          timeStart,
          timeEnd,
          address,
          storeName,
          price
        );
        return calendarData;
      }
    } catch (error) {
      console.error("Error loading stored store 1:", error);
      return {};
    }
  };
  const createCalendarsData = (
    bookingDateData: string[],
    title: string[],
    mentorName: string[],
    timeStart: string[],
    timeEnd: string[],
    address: string[],
    storeName: string[],
    price: string[]
  ) => {
    const calendarData: { [key: string]: any[] } = {};
    // Use the length of bookingDateData to iterate
    bookingDateData.forEach((date, index) => {
      if (!calendarData[date]) {
        calendarData[date] = [];
      }
      calendarData[date].push({
        title: `Khóa: ${title[index]}`,
        description: `Mentor: ${mentorName[index]}`,
        name: `Thời gian chơi: ${timeStart[index]} - ${timeEnd[index]}`,
        data: `Địa điểm: \n ${address[index]} - ${storeName[index]}`,
        price: `Giá buổi học: ${price[index]}`,
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
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>{item.name}</Text>
              <Text>{item.data}</Text>
              <Text>{item.price}</Text>
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
