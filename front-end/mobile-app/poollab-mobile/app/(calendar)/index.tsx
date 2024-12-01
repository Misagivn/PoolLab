import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import CustomDropdown from "@/components/customDropdown";
import {
  get_user_booking_recurring,
  get_user_booking_recurring_by_id,
} from "@/api/booking_api";
import Icon from "@/assets/icons/icons";
import { getStoredUser } from "@/api/tokenDecode";
import { store } from "expo-router/build/global-state/router-store";
import { Agenda } from "react-native-calendars";
import Button from "@/components/roundButton";
import { transform } from "@babel/core";
import BackButton from "@/components/backButton";
const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reserveData, setReserveData] = useState([]);
  const [reserveId, setReserveId] = useState("");
  const [calendarsData, setCalendarsData] = useState([]);
  const loadReserveInfo = async () => {
    setIsLoading(true);
    const storedUser = await getStoredUser();
    const data = {
      CustomerId: storedUser.AccountId,
      billiardTypeId: "",
      storeId: "",
      areaId: "",
      status: "Đã Đặt",
      SortBy: "createdDate",
      SortAscending: false,
      PageNumber: "1",
    };
    try {
      const response = await get_user_booking_recurring(data);
      if (response) {
        const rawdata = response.data.data.items;
        const transformData = rawdata.map(
          (item: {
            tableName: any;
            id: any;
            address: any;
            dateStart: any;
            dateEnd: any;
          }) => ({
            label:
              "Mốc thời gian: " +
              item.dateStart.split("T")[0] +
              " đến " +
              item.dateEnd.split("T")[0],
            value: item.id,
            address: "Thông tin bàn: " + item.tableName + " - " + item.address,
          })
        );
        setReserveData(transformData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading stored store:", error);
      setIsLoading(false);
    }
  };
  const loadReserveInfoById = async () => {
    const id = reserveId;
    setIsLoading(true);
    try {
      const response = await get_user_booking_recurring_by_id(id);
      if (response) {
        const rawdata = response.data.data.recurringBookings;
        const rawData2 = response.data.data;
        const tablename = rawData2.tableName;
        const address = rawData2.address;
        const storeName = rawData2.storeName;
        const timeStart = rawData2.timeStart;
        const timeEnd = rawData2.timeEnd;
        console.log(rawdata);
        const transformData = Object.entries(rawdata).reduce(
          (acc, [date, items]) => {
            acc[date] = items.map((item) => ({
              name: item.name,
              data: item.data,
            }));
            return acc;
          },
          {}
        );
        // "2024-12-01": [{ name: "demo 1", data: "demo" }],
        transformData.push({});
        console.log(transformData);
        setCalendarsData(transformData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading byID:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadReserveInfo();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <BackButton
        buttonStyles={{ marginTop: 5, marginLeft: 5, paddingLeft: 5 }}
      />
      <View style={styles.searchBox}>
        <Text style={styles.title}>Tìm kiếm thông tin</Text>
        <Text style={styles.subTitle}>đặt bàn thường xuyên</Text>
        <CustomDropdown
          icon={
            <Icon
              name="locationIcon"
              size={25}
              strokeWidth={1.5}
              color="black"
            />
          }
          placeholder="Chọn mốc thời gian"
          data={reserveData}
          onSelect={async (item) => {
            setReserveId(item.value);
          }}
        />
        <Button
          title="TÌM KIẾM BÀN ĐẶT"
          buttonStyles={styles.updateButton}
          textStyles={styles.updateButtonText}
          onPress={() => {
            loadReserveInfoById();
          }}
          loading={isLoading}
        />
      </View>
      <Agenda
        items={{
          "2024-12-01": [{ name: "demo 1", data: "demo" }],
          "2024-12-02": [{ name: "demo 2", data: "demo" }],
          "2024-12-03": [{ name: "demo 3", data: "demo" }],
          "2024-12-04": [{ name: "demo 4", data: "demo" }],
          "2024-12-10": [{ name: "demo 10", data: "demo" }],
          "2024-12-05": [{ name: "demo 5", data: "demo" }],
          "2024-12-06": [{ name: "demo 6", data: "demo" }],
          "2024-12-07": [{ name: "demo 7", data: "demo" }],
          "2024-12-08": [{ name: "demo 8", data: "demo" }],
          "2024-12-09": [{ name: "demo 9", data: "demo" }],
        }}
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
  },
  searchBox: {
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
    fontSize: 25,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  subTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
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
  updateButton: {
    marginTop: 5,
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
  },
  updateButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});
