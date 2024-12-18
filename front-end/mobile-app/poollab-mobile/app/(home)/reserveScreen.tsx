import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from "react-native";
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
import { create_booking, search_for_billiard_table } from "@/api/booking_api";
import CustomAlert from "@/components/alertCustom";
import { router } from "expo-router";
import ExpoDatePicker from "@/components/expoDatePicker";
import IconButton from "@/components/iconButton";
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
  const [selectedStartTime, setSelectedStartTime] = useState("08:00");
  const [selectedEndTime, setSelectedEndTime] = useState("22:00");
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [areaError, setAreaError] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const [tableData, setTabelData] = useState([]);
  const handleStartTimeSelect = (time) => {
    setSelectedStartTime(time);
    console.log("Selected start time:", time);
  };
  const resetInfo = () => {
    console.log("Reset info", userMessage);
    setStoreId("");
    setSelectedStore(null);
    setBillardTypeId("");
    setAreaId("");
    setUserMessage("");
    setBookingDate("");
    setSelectedStartTime("08:00");
    setSelectedEndTime("22:00");
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
  const searchData = {
    billiardTypeId: billardtypeId,
    storeId: storeId,
    areaId: areaId,
    bookingDate: bookingDate,
    startTime: selectedStartTime,
    endTime: selectedEndTime,
  };
  const alertPopup = (
    title: string | undefined,
    message: string | undefined,
    confirmText: string | undefined,
    cancelText: string | undefined,
    areaErrorConfirm: boolean | undefined,
    errorConfirm: boolean | undefined,
    successConfirm: boolean | undefined
  ) => {
    return (
      <CustomAlert
        visible={alertVisible}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          if (successConfirm !== undefined) {
            setSuccessResponse("");
            setStoreId("");
            setBillardTypeId("");
            setAreaId("");
            setCurrentDate();
            setSelectedStartTime("08:00");
            setSelectedEndTime("22.00");
            setAlertVisible(false);
            router.navigate("../(reserveTable)");
          }
          if (areaErrorConfirm !== undefined) {
            setAlertVisible(false);
            setStoreId("");
            setBillardTypeId("");
            setAreaId("");
            setAreaError("");
            setErrorResponse("");
          }
          if (errorConfirm !== undefined) {
            setAlertVisible(false);
            setErrorResponse("");
            setCurrentDate();
            setSelectedStartTime("08:00");
            setSelectedEndTime("22.00");
          } else {
            setAlertVisible(false);
          }
        }}
        onCancel={() => {}}
      />
    );
  };

  const getArea = async (storeId: string, billardtypeId: any) => {
    console.log("storeId: ", storeId);
    console.log("billardtypeId: ", billardtypeId);
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
    const data = {
      status: "Hoạt Động",
    };
    try {
      const storedStore = await get_all_Store(data);
      if (storedStore) {
        const rawdata = storedStore.data.data.items;
        const transformData = rawdata.map(
          (item: { name: any; id: any; address: any }) => ({
            label: "Tên chi nhánh: " + item.name,
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
  const setCurrentDate = () => {
    const date = new Date();
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    setBookingDate(`${year}-${month}-${day}`);
  };
  useEffect(() => {
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
    console.log("data send search: ", searchData);
    if (checkTimeRange(selectedStartTime, selectedEndTime)) {
      const result = calculateRoundedTime(selectedStartTime, selectedEndTime);
    } else {
      console.log("Time range is invalid.");
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
        search_for_billiard_table(searchData).then((response) => {
          console.log("response: ", response);
          if (response?.data.status === 200) {
            setTabelData(response.data.data);
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
  const bookTable = async (tableId) => {
    const bookingData = {
      customerId: customerId,
      billiardTableId: tableId,
      message: userMessage,
      bookingDate: bookingDate,
      timeStart: selectedStartTime,
      timeEnd: selectedEndTime,
    };
    setIsLoading(true);
    try {
      console.log("booking data: ", bookingData);
      create_booking(bookingData).then((response) => {
        console.log("response: ", response);
        if (response.status === 200) {
          console.log("Booking created successfully!");
          console.log("Data sau khi dat ", response.data.data);
          setAlertVisible(true);
          setSuccessResponse("Đã tạo bàn thành công!");
          setIsLoading(false);
        } else {
          Alert.alert("Lỗi", response.data.message);
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  if (alertVisible) {
    if (areaError) {
      return alertPopup(
        "Lỗi khu vực",
        areaError,
        "OK",
        "Hủy",
        true,
        undefined,
        undefined
      );
    } else if (errorResponse) {
      return alertPopup(
        "Thông Báo",
        `${errorResponse}.`,
        "OK",
        "Hủy",
        undefined,
        true,
        undefined
      );
    } else if (successResponse) {
      return alertPopup(
        "Thành công",
        successResponse,
        "OK",
        "Hủy",
        undefined,
        undefined,
        true
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
              <Text style={styles.inputTitle}>
                Chọn Chi nhánh, Loại, Khu vực:
              </Text>
              <CustomDropdown
                icon={
                  <Icon
                    name="locationIcon"
                    size={25}
                    strokeWidth={1.5}
                    color="black"
                  />
                }
                placeholder="Chọn chi nhánh"
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
                minTime={selectedStartTime}
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
                title="TÌM KIẾM"
                buttonStyles={styles.updateButton}
                textStyles={styles.updateButtonText}
                onPress={() => {
                  onSubmit();
                }}
                loading={isLoading}
                disabled={
                  storeId === "" ||
                  billardtypeId === "" ||
                  areaId === "" ||
                  selectedStartTime === "" ||
                  selectedEndTime === "" ||
                  bookingDate === ""
                }
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
                    fontStyle: "normal",
                    fontWeight: "semibold",
                  }}
                >
                  ĐẶT BÀN NGAY!
                </Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.title1}>Thông tin bàn.</Text>
          {tableData.length === 0 ? (
            <Text style={styles.title2}>Không tìm thấy bàn.</Text>
          ) : (
            tableData.map((item) => (
              <View key={item.id} style={styles.dataBox}>
                <View style={styles.innerBox}>
                  <View style={styles.imageBox}>
                    <Image
                      style={styles.image}
                      source={
                        item.image
                          ? { uri: item.image }
                          : require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")
                      }
                    />
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Tên bàn:</Text>
                    <Text style={styles.infoBoxText}>{item.name}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Loại lỗ:</Text>
                    <Text style={styles.infoBoxText}>
                      {item.billiardTypeName}
                    </Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Tên quán:</Text>
                    <Text style={styles.infoBoxText}>{item.storeName}</Text>
                  </View>
                  <View style={styles.infoBox3}>
                    <Text style={styles.infoBoxTitle}>Địa chỉ:</Text>
                    <Text style={styles.infoBoxText}>{item.address}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Khu vực chơi:</Text>
                    <Text style={styles.infoBoxText}>{item.areaName}</Text>
                  </View>
                  <View style={styles.infoBox3}>
                    <Text style={styles.infoBoxTitle}>Giá bàn:</Text>
                    <Text style={styles.infoBoxText}>
                      {Number(item.bidaPrice).toLocaleString("en-US") + "/h"}
                    </Text>
                  </View>
                </View>
                <IconButton
                  iconName={"addCircleIcon"}
                  textStyles={{ fontSize: 13, color: "white" }}
                  buttonStyles={styles.submitButton}
                  title={"ĐẶT BÀN"}
                  onPress={() => {
                    bookTable(item.id);
                  }}
                />
              </View>
            ))
          )}
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
  dataBox: {
    backgroundColor: theme.colors.background,
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
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
  innerBox: {
    backgroundColor: theme.colors.background,
    padding: 15,
    borderRadius: 10,
    borderCurve: "continuous",
  },
  imageBox: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingBottom: 10,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 2,
  },
  infoBox2: {
    flexDirection: "row",
    gap: 10,
  },
  infoBox3: {
    gap: 5,
  },
  infoBoxText: {
    fontSize: 15,
  },
  infoBoxTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  submitButton: {
    gap: 5,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
  title2: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  title1: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
