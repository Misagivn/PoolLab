import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import InputCustom from "@/components/inputCustom";
import CustomDropdown from "@/components/customDropdown";
import DemoCustomTimeInput from "@/components/customTimeInput";
import Icon from "@/assets/icons/icons";
import { get_all_Store } from "@/api/store_api";
import Button from "@/components/roundButton";
import { get_all_billard_type } from "@/api/billard_type";
import { getStoredUser } from "@/api/tokenDecode";
import { get_all_billard_type_area } from "@/api/area_api";
import { create_booking } from "@/api/booking_api";
import CustomAlert from "@/components/alertCustom";
import { router } from "expo-router";
import ExpoDatePicker from "@/components/expoDatePicker";
const ReserveScreen = () => {
  const [customerId, setCustomerId] = useState("");
  const [storeData, setStoreData] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [billardtypeData, setBillardTypeData] = useState([]);
  const [billardtypeId, setBillardTypeId] = useState("");
  const [areaData, setAreaData] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("01:00");
  const [selectedEndTime, setSelectedEndTime] = useState("00:00");
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [areaError, setAreaError] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const handleStartTimeSelect = (time) => {
    setSelectedStartTime(time);
    console.log("Selected start time:", time);
  };

  const handleEndTimeSelect = (time) => {
    setSelectedEndTime(time);
    console.log("Selected end time:", time);
  };
  const getUserId = async () => {
    try {
      const storedUser = await getStoredUser();
      if (storedUser) {
        setCustomerId(storedUser.AccountId);
      }
    } catch (error) {
      console.error("Error loading stored user:", error);
    }
  };
  const bookingData = {
    customerId: customerId,
    billiardTypeId: billardtypeId,
    storeId: storeId,
    areaId: areaId,
    message: userMessage,
    bookingDate: bookingDate,
    timeStart: selectedStartTime,
    timeEnd: selectedEndTime,
  };
  const alertPopup = (
    title: string | undefined,
    message: string | undefined,
    confirmText: string | undefined,
    cancelText: string | undefined,
    successConfirm: boolean | undefined,
    areaErrorConfirm: boolean | undefined
  ) => {
    return (
      <CustomAlert
        visible={alertVisible}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          if (successConfirm || areaErrorConfirm === false) {
            setSuccessResponse("");
            setAlertVisible(false);
            router.navigate("../(reserveTable)");
          } else if (areaErrorConfirm || successConfirm === false) {
            setAlertVisible(false);
            setStoreId("");
            setBillardTypeId("");
            setAreaId("");
            setAreaError("");
            setErrorResponse("");
          } else {
            setAlertVisible(false);
          }
        }}
        onCancel={() => {
          setAlertVisible(false);
        }}
      />
    );
  };

  const getArea = async (storeId: string, billardtypeId: any) => {
    try {
      const getAreaData = {
        storeId: storeId,
        billardtypeId: billardtypeId,
      };
      const storedArea = await get_all_billard_type_area(getAreaData);
      if (storedArea && storeId && billardtypeId) {
        const rawdata = storedArea.data.data;
        const transformData = rawdata.map(
          (item: { typeName: any; areaID: any; areaName: any }) => ({
            label: "Tên: " + item.typeName,
            value: item.areaID,
            address: "Địa chỉ: " + item.areaName,
          })
        );
        console.log(rawdata);
        setAreaData(transformData);
        console.log(transformData);
      }
    } catch (error) {
      setAlertVisible(true);
      setAreaError(
        "Không thể tải dữ liệu của Area!. Hãy thử đổi địa chỉ hoặc loại bàn."
      );
    }
  };
  const loadStore = async () => {
    try {
      const storedStore = await get_all_Store();
      if (storedStore) {
        const rawdata = storedStore.data.data;
        const transformData = rawdata.map(
          (item: { name: any; id: any; address: any }) => ({
            label: "Tên quán: " + item.name,
            value: item.id,
            address: "Địa chỉ: " + item.address,
          })
        );
        setStoreData(transformData);
      }
    } catch (error) {
      console.error("Error loading stored store:", error);
    }
  };
  const loadBillardType = async () => {
    try {
      const storedBillardType = await get_all_billard_type();
      if (storedBillardType) {
        const rawdata = storedBillardType.data.data;
        const transformData = rawdata.map(
          (item: { name: any; id: any; descript: any }) => ({
            label: "Loại bàn: " + item.name,
            value: item.id,
            address: "Mô tả: " + item.descript,
          })
        );
        setBillardTypeData(transformData);
      }
    } catch (error) {
      console.error("Error loading stored store:", error);
    }
  };
  useEffect(() => {
    const setCurrentDate = () => {
      const date = new Date();
      if (!date) return "";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      setBookingDate(`${year}-${month}-${day}`);
    };
    setCurrentDate();
    getUserId();
    loadStore();
    loadBillardType();
  }, []);
  const calculateRoundedTime = (start, end) => {
    console.log("Calculating rounded time...");
    console.log("Start time:", start);
    console.log("End time:", end);

    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);
    console.log("Start hours:", startHours);
    console.log("Start minutes:", startMinutes);
    console.log("End hours:", endHours);
    console.log("End minutes:", endMinutes);
    // Convert to total minutes
    const totalStartMinutes = startHours * 60 + startMinutes;
    console.log("Start time in minutes:", totalStartMinutes);
    const totalEndMinutes = endHours * 60 + endMinutes;
    console.log("End time in minutes:", totalStartMinutes);
    // Calculate the difference in minutes
    const difference = totalEndMinutes - totalStartMinutes;
    console.log("Difference in minutes:", difference);
    // Calculate the final time in hh:mm format
    const finalHours = Math.floor(difference / 60);
    console.log("Final hours:", finalHours);
    const finalMinutes = difference % 60;

    // Return formatted time
    return `${String(finalHours).padStart(2, "0")}:${String(
      finalMinutes
    ).padStart(2, "0")}`;
  };
  const checkTimeRange = (startTime: string, endTime: string): boolean => {
    // Helper function to convert time string to minutes
    const convertToMinutes = (timeString: string): number => {
      console.log(timeString);
      if (typeof timeString === "string") {
        const parts = timeString.split("someDelimiter");
      } else {
        console.error("timeString is not a string:", timeString);
      }
      const stringTime = String(timeString);
      const [hours, minutes] = stringTime.split(":").map(Number);
      return hours * 60 + minutes;
    };

    // Convert start and end times to minutes
    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);

    // Check if end time is greater than start time
    if (endMinutes <= startMinutes) {
      setAlertVisible(true);
      setErrorResponse("End time must be greater than start time.");
      //alert("End time must be greater than start time.");
      return false;
    }

    // Check if the time range is valid (e.g., not more than 24 hours)
    const maxMinutes = 24 * 60;
    if (endMinutes - startMinutes > maxMinutes) {
      setAlertVisible(true);
      setErrorResponse("Time range cannot exceed 24 hours.");
      return false;
    }

    // Time range is valid
    return true;
  };

  const onSubmit = () => {
    console.log(bookingData);
    if (checkTimeRange(selectedStartTime, selectedEndTime)) {
      console.log("Time range is valid!");
      console.log("++++++++++++++++++++++++");
      console.log(bookingData);
      const result = calculateRoundedTime(selectedStartTime, selectedEndTime);
      console.log("Play time:", result);
      // Proceed with other logic
    } else {
      console.log("Time range is invalid.");
      // Handle the error or take appropriate action
    }
    if (
      areaId === "" ||
      billardtypeId === "" ||
      storeId === "" ||
      selectedStartTime === "" ||
      selectedEndTime === "" ||
      bookingDate === ""
    ) {
      setAlertVisible(true);
      setErrorResponse("Vui lòng nhập tất cả các thông tin!");
    } else {
      setIsLoading(true);
      try {
        create_booking(bookingData).then((response) => {
          if (response?.data.status === 200) {
            console.log("Booking created successfully!");
            console.log("Data sau khi dat ", response.data.data);
            setAlertVisible(true);
            setSuccessResponse("Đã tạo bàn thành công!");
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setAlertVisible(true);
            setErrorResponse(response.data.message);
            console.log("Error: ", response.data);
          }
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };
  const resetInfo = () => {
    console.log("Reset info", userMessage);
    setUserMessage("");
    loadStore();
    loadBillardType();
    getArea(storeId, billardtypeId);
    setStoreId("");
    setSelectedStore(null);
  };
  if (alertVisible) {
    if (areaError) {
      const successConfirm = false;
      const areaErrorConfirm = true;
      return alertPopup(
        "Lỗi khu vực",
        areaError,
        "OK",
        "Hủy",
        successConfirm,
        areaErrorConfirm
      );
    } else if (errorResponse) {
      return alertPopup(
        "Thông Báo",
        `${errorResponse} Hãy thử lại với thời gian hoặc ngày đặt khác.`,
        "OK"
      );
    } else if (successResponse) {
      const successConfirm = true;
      const areaErrorConfirm = false;
      return alertPopup(
        "Thành công",
        successResponse,
        "OK",
        "Hủy",
        successConfirm,
        areaErrorConfirm
      );
    }
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader />
          <View style={styles.searchBox}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>Nhập thông tin</Text>
              <Text style={styles.subTitle}>đặt bàn</Text>
            </View>
            <View style={styles.warningBox}>
              <Text style={styles.warning}>
                *Lưu ý: Dựa vào các thông tin người dùng cung cấp. Hệ thống sẽ
                tự động tìm kiếm các bàn thích hợp và đưa ra lựa chọn phù hợp
                nhât. Người dùng không thể chỉnh sửa thông tin của bàn được
                chọn.
              </Text>
            </View>
            <View style={styles.searchRow}>
              <Text style={styles.inputTitle}>Chọn Quán, Loại, Khu vực:</Text>
              <CustomDropdown
                icon={
                  <Icon
                    name="locationIcon"
                    size={25}
                    strokeWidth={1.5}
                    color="black"
                  />
                }
                placeholder="Chọn vị trí"
                data={storeData}
                onSelect={async (item) => {
                  setStoreId(item.value);
                  await getArea(item.value, billardtypeId);
                }}
                onClear={() => {
                  setStoreId("");
                }}
              />
              <CustomDropdown
                icon={
                  <Icon
                    name="fromAtoZIcon"
                    size={25}
                    strokeWidth={1.5}
                    color="black"
                  />
                }
                placeholder="Chọn loại bàn"
                data={billardtypeData}
                onSelect={async (item) => {
                  setBillardTypeId(item.value);
                  await getArea(storeId, item.value);
                }}
              />
              <CustomDropdown
                icon={
                  <Icon
                    name="areaIcon"
                    size={25}
                    strokeWidth={1.5}
                    color="black"
                  />
                }
                placeholder="Chọn khu vực chơi"
                data={areaData}
                onSelect={async (item) => {
                  setAreaId(item.value);
                }}
              />
              <Text style={styles.inputTitle}>Ngày đặt bàn mong muốn:</Text>
              <ExpoDatePicker
                placeholder="Chọn ngày"
                minimumDate={new Date()}
                maximumDate={new Date(2026, 12, 31)}
                dateValue={(date) => setBookingDate(date)}
              />
              <Text style={styles.warning}>
                *Lưu ý: Quán chỉ hoạt động từ 8:00 đến 22:00 hàng ngày.
              </Text>
              <Text style={styles.inputTitle}>Thời gian bắt đầu (hh:mm) :</Text>
              <DemoCustomTimeInput
                onSelect={handleStartTimeSelect}
                placeholder="Select a time"
                containerStyles={{
                  backgroundColor: "white",
                  paddingHorizontal: 16,
                }}
                modalStyles={{
                  backgroundColor: "#fff",
                }}
                textStyles={{
                  color: "#333",
                }}
                initialHour={8}
                initialMinute={0}
                is24Hour={true}
                maxTime="21:30"
                minTime="8:00"
              />
              <Text style={styles.inputTitle}>
                Thời gian kết thúc (hh:mm) :
              </Text>
              <DemoCustomTimeInput
                onSelect={handleEndTimeSelect}
                placeholder="Select a time"
                containerStyles={{
                  backgroundColor: "white",
                  paddingHorizontal: 16,
                }}
                modalStyles={{
                  backgroundColor: "#fff",
                }}
                textStyles={{
                  color: "#333",
                }}
                initialHour={22}
                initialMinute={0}
                is24Hour={true}
                minTime={selectedStartTime.toString()}
                maxTime="22:00"
              />
              <Text style={styles.inputTitle}>Lời nhắn cho quán</Text>
              <InputCustom
                placeholder="Thêm lời nhắn cho quán"
                multiline
                numberOfLines={4}
                maxLength={100}
                onChangeText={(text) => {
                  setUserMessage(text);
                }}
                value={userMessage}
              />
              <Button
                title="TÌM KIẾM & ĐẶT BÀN"
                buttonStyles={styles.updateButton}
                textStyles={styles.updateButtonText}
                onPress={() => {
                  onSubmit();
                }}
                loading={isLoading}
              />
            </View>
            <View style={styles.advanceReseveContainer}>
              <Text
                style={{
                  color: "black",
                  fontSize: 15,
                  fontWeight: "thin",
                  textAlign: "center",
                }}
              >
                Dịch vụ đặt bàn thường xuyên.
              </Text>
              <Pressable
                onPress={() => {
                  router.push("(advanceReserve)");
                }}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  ĐẶT BÀN NGAY!
                </Text>
              </Pressable>
            </View>
          </View>
          {/* <View style={styles.resetButtonBox}>
            <IconButton
              title="Cài đặt lại"
              buttonStyles={styles.resetButton}
              textStyles={styles.resetButtonText}
              iconName={"refreshIcon"}
              onPress={() => {
                resetInfo();
              }}
            />
          </View> */}
          <View style={styles.customDivider}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReserveScreen;

const styles = StyleSheet.create({
  container: {},
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
  customDivider: {
    padding: 50,
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
  warningBox: {},
  warning: {
    color: "red",
    fontSize: 10,
  },
  searchRow: {
    gap: 10,
    paddingVertical: 10,
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
  },
  updateButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  resetButtonBox: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  resetButton: {
    backgroundColor: theme.colors.hightLight,
    borderRadius: 50,
    width: 120,
    height: 40,
    gap: 8,
  },
  resetButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "semibold",
  },
  advanceReseveContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
