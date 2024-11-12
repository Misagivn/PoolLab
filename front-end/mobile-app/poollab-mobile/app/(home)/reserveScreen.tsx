import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import InputCustom from "@/components/inputCustom";
import CustomDropdown from "@/components/customDropdown";
import CustomDateInput from "@/components/customDateInput";
import DemoCustomTimeInput from "@/components/customTimeInput";
import Icon from "@/assets/icons/icons";
import { get_all_Store } from "@/api/store_api";
import Button from "@/components/roundButton";
import { get_all_billard_type } from "@/api/billard_type";
import { getStoredUser } from "@/api/tokenDecode";
import { get_all_billard_type_area } from "@/api/area_api";
import { create_booking } from "@/api/booking_api";
import CustomPopup from "@/components/popupCustom";
import CustomAlert from "@/components/alertCustom";
import { router } from "expo-router";
//demo data
const ReserveScreen = () => {
  const [customerId, setCustomerId] = useState("");
  const [storeData, setStoreData] = useState([]);
  const [storeId, setStoreId] = useState("");
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
  //const [popupVisible, setPopupVisible] = useState(false);
  // const [tableData, setTableData] = useState({
  //   Address: "",
  //   Store_Name: "",
  //   Area_Name: "",
  //   Billard_Type_Name: "",
  //   Booking_Date: "",
  //   Time_Start: "",
  //   Time_End: "",
  //   Price: "",
  // });
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
    title,
    message,
    confirmText,
    cancelText,
    successConfirm
  ) => {
    return (
      <CustomAlert
        visible={alertVisible}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          if (successConfirm) {
            setAlertVisible(false);
            router.navigate("../(reserveTable)");
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
      // alert(
      //   "Không thể tải dữ liệu của Area!. Hãy thử đổi địa chỉ hoặc loại bàn."
      // );
    }
  };
  useEffect(() => {
    const loadStore = async () => {
      try {
        const storedStore = await get_all_Store();
        if (storedStore) {
          //setStoreData(storedStore.data.data);
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
          //setStoreData(storedStore.data.data);
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
      //alert("Time range cannot exceed 24 hours.");
      //alert("Time range cannot exceed 24 hours.");
      return false;
    }

    // Time range is valid
    return true;
  };

  const onSubmit = () => {
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
      //alert("Vui lòng nhập tất cả các thông tin!");
    } else {
      setIsLoading(true);
      try {
        create_booking(bookingData).then((response) => {
          if (response?.data.status === 200) {
            console.log("Booking created successfully!");
            console.log("Data sau khi dat ", response.data.data);
            // setTableData({
            //   Address: response.data.data.address,
            //   Store_Name: response.data.data.storeName,
            //   Area_Name: response.data.data.areaName,
            //   Billard_Type_Name: response.data.data.billiardTypeName,
            //   Booking_Date: response.data.data.bookingDate,
            //   Time_Start: response.data.data.timeStart,
            //   Time_End: response.data.data.timeEnd,
            //   Price: response.data.data.price,
            // });
            //setPopupVisible(true);
            setAlertVisible(true);
            setSuccessResponse("Đã tạo bàn thành công!");
            //alert("Đã tạo bàn thành công!");
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setAlertVisible(true);
            setErrorResponse(response.data.message);
            //alert(response.data.message);
            //alert(response.data.message);
          }
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };
  if (alertVisible) {
    if (areaError) {
      return alertPopup("Lỗi", areaError, "OK", "Hủy");
    } else if (errorResponse) {
      return alertPopup("Lỗi", errorResponse, "OK", "Hủy");
    } else if (successResponse) {
      const successConfirm = true;
      return alertPopup("Lỗi", successResponse, "OK", "Hủy", successConfirm);
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
              <Text style={styles.inputTitle}>Ngày đặt bàn mong muốn</Text>
              <CustomDateInput
                onDateSelect={(date) => {
                  setBookingDate(date);
                }}
                placeholder="Chọn ngày"
                dateFormat="YYYY-MM-DD"
                maxDate={new Date("2025-12-31")} // Optional: limit future dates
                required={true}
                // customValidation={(date) => {
                //   // Optional: add custom validation rules
                //   if (date.getDay() === 0 || date.getDay() === 6) {
                //     return "Weekend dates are not allowed";
                //   }
                //   return null;
                // }}
              />
              <Text style={styles.inputTitle}>Thời gian bắt đầu</Text>
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
              />
              <Text style={styles.inputTitle}>Thời gian kết thúc</Text>
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
                initialHour={7}
                initialMinute={0}
                is24Hour={true}
                minTime={selectedStartTime}
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
          </View>
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
});
