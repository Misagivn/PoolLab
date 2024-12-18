import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/backButton";
import { theme } from "@/constants/theme";
import CustomDropdown from "@/components/customDropdown";
import Icon from "@/assets/icons/icons";
import DemoCustomTimeInput from "@/components/customTimeInput";
import Checkbox from "expo-checkbox";
import { get_all_billard_type_area } from "@/api/area_api";
import { getStoredUser } from "@/api/tokenDecode";
import { get_all_Store } from "@/api/store_api";
import { get_all_billard_type } from "@/api/billard_type";
import { search_table } from "@/api/billard_table";
import Button from "@/components/roundButton";
import DemoCustomMonthYearPicker from "@/components/monthYearPicker";
import IconButton from "@/components/iconButton";
import CustomAlert from "@/components/alertCustom";
import { create_recurring_booking } from "@/api/booking_api";
import { router } from "expo-router";
const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [areaData, setAreaData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [billardtypeId, setBillardTypeId] = useState("");
  const [billardtypeData, setBillardTypeData] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState("08:00");
  const [selectedEndTime, setSelectedEndTime] = useState("22:00");
  const [areaId, setAreaId] = useState("");
  const [recurrenceDays, setRecurrenceDays] = useState<string[]>([]);
  const [isChecked1, setChecked1] = useState(false);
  const [isChecked2, setChecked2] = useState(false);
  const [isChecked3, setChecked3] = useState(false);
  const [isChecked4, setChecked4] = useState(false);
  const [isChecked5, setChecked5] = useState(false);
  const [isChecked6, setChecked6] = useState(false);
  const [isChecked7, setChecked7] = useState(false);
  const [monthYear, setMonthYear] = useState("");
  const [tableData, setTableData] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [areaError, setAreaError] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const searchData = {
    storeId: storeId,
    areaId: areaId,
    billiardTypeId: billardtypeId,
    startTime: selectedStartTime,
    endTime: selectedEndTime,
    recurrenceDays: recurrenceDays,
    monthBooking: monthYear,
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
            setSelectedStartTime("08:00");
            setSelectedEndTime("22.00");
            setAlertVisible(false);
            router.navigate("../(recurringManage)");
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
  const handleStartTimeSelect = (time) => {
    setSelectedStartTime(time);
    console.log("Selected start time:", time);
  };
  const handleEndTimeSelect = (time) => {
    setSelectedEndTime(time);
    console.log("Selected end time:", time);
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
        setAreaData(transformData);
        console.log(transformData);
      }
    } catch (error) {
      setAlertVisible(true);
      setAreaError(
        "Không thể tải dữ liệu của Area!. Hãy thử đổi địa chỉ hoặc loại bàn."
      );
      console.error("Error loading stored area:", error);
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
  const onSubmit = async () => {
    setIsLoading(true);
    const result = await search_table(searchData);
    if (result.status === 200) {
      console.log("Search table success!");
      setTableData(result.data.data);
      setIsLoading(false);
    } else {
      console.log("Search table failed!");
      console.log(result.data);
      setIsLoading(false);
      setAlertVisible(true);
      setErrorResponse(result.data.message);
    }
  };
  const submitTable = async (tableId) => {
    const submitData = {
      tableId: tableId,
      customerId: customerId,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      recurrenceDays: recurrenceDays,
      monthBooking: monthYear,
    };
    console.log("submit data: ", submitData);
    try {
      const response = await create_recurring_booking(submitData);
      if (response.status === 200) {
        console.log("success add product to order: ", response.data);
        setAlertVisible(true);
        setSuccessResponse("Đã đặt bàn thành công!");
      } else {
        console.log("error add product to order: ", response.data);
        setAlertVisible(true);
        setErrorResponse(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getUserId();
    loadStore();
    loadBillardType();
  }, []);
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
        `${errorResponse} Hãy thử lại với thời gian hoặc ngày đặt khác.`,
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
          <BackButton />
          <View style={styles.detailsBox}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>Đặt bàn thường xuyên</Text>
              <Text style={styles.title2}>theo tháng.</Text>
            </View>
            <View style={styles.warningBox}>
              <Text style={styles.warning}>
                *Lưu ý: Người dùng chỉ có thể đặt bàn theo tháng (có thể nhiều
                hơn 1 tháng).
              </Text>
              <Text style={styles.warning}>
                Bàn chỉ được khơi động từ đầu tháng đến cuối tháng. Không thể
                đặt bàn giữa tháng. Bàn được đặt trong giữa tháng sẽ là bàn của
                các tháng sau.
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
              <Text style={styles.inputTitle}>Chọn tháng/năm đặt bàn:</Text>
              <DemoCustomMonthYearPicker
                onSelect={(selectedMonthYear) => {
                  setMonthYear(selectedMonthYear);
                }}
              />
              <Text style={styles.inputTitle}>Chọn thứ trong tuần:</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked1}
                  onValueChange={() => {
                    setChecked1(!isChecked1);
                    if (!isChecked1) {
                      setRecurrenceDays([...recurrenceDays, "Monday"]);
                      console.log("Add Monday");
                    } else {
                      setRecurrenceDays(
                        recurrenceDays.filter((item) => item !== "Monday")
                      );
                      console.log("Remove Monday");
                    }
                  }}
                  color={isChecked1 ? theme.colors.primary : undefined}
                />
                <Text style={styles.checkboxText}>Thứ 2</Text>
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked2}
                  onValueChange={() => {
                    setChecked2(!isChecked2);
                    if (!isChecked2) {
                      setRecurrenceDays([...recurrenceDays, "Tuesday"]);
                      console.log("Add Tuesday");
                    } else {
                      setRecurrenceDays(
                        recurrenceDays.filter((item) => item !== "Tuesday")
                      );
                      console.log("Remove Tuesday");
                    }
                  }}
                  color={isChecked2 ? theme.colors.primary : undefined}
                />
                <Text style={styles.checkboxText}>Thứ 3</Text>
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked3}
                  onValueChange={() => {
                    setChecked3(!isChecked3);
                    if (!isChecked3) {
                      setRecurrenceDays([...recurrenceDays, "Wednesday"]);
                      console.log("Add Wednesday");
                    } else {
                      setRecurrenceDays(
                        recurrenceDays.filter((item) => item !== "Wednesday")
                      );
                      console.log("Remove Wednesday");
                    }
                  }}
                  color={isChecked3 ? theme.colors.primary : undefined}
                />
                <Text style={styles.checkboxText}>Thứ 4</Text>
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked4}
                  onValueChange={() => {
                    setChecked4(!isChecked4);
                    if (!isChecked4) {
                      setRecurrenceDays([...recurrenceDays, "Thursday"]);
                      console.log("Add Thursday");
                    } else {
                      setRecurrenceDays(
                        recurrenceDays.filter((item) => item !== "Thursday")
                      );
                      console.log("Remove Thursday");
                    }
                  }}
                  color={isChecked4 ? theme.colors.primary : undefined}
                />
                <Text style={styles.checkboxText}>Thứ 5</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked5}
                  onValueChange={() => {
                    setChecked5(!isChecked5);
                    if (!isChecked5) {
                      setRecurrenceDays([...recurrenceDays, "Friday"]);
                      console.log("Add Friday");
                    } else {
                      setRecurrenceDays(
                        recurrenceDays.filter((item) => item !== "Friday")
                      );
                      console.log("Remove Friday");
                    }
                  }}
                  color={isChecked5 ? theme.colors.primary : undefined}
                />
                <Text style={styles.checkboxText}>Thứ 6</Text>
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked6}
                  onValueChange={() => {
                    setChecked6(!isChecked6);
                    if (!isChecked6) {
                      setRecurrenceDays([...recurrenceDays, "Saturday"]);
                      console.log("Add Saturday");
                    } else {
                      setRecurrenceDays(
                        recurrenceDays.filter((item) => item !== "Saturday")
                      );
                      console.log("Remove Saturday");
                    }
                  }}
                  color={isChecked6 ? theme.colors.primary : undefined}
                />
                <Text style={styles.checkboxText}>Thứ 7</Text>
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked7}
                  onValueChange={() => {
                    setChecked7(!isChecked7);
                    if (!isChecked7) {
                      setRecurrenceDays([...recurrenceDays, "Sunday"]);
                      console.log("Add Sunday");
                    } else {
                      setRecurrenceDays(
                        recurrenceDays.filter((item) => item !== "Sunday")
                      );
                      console.log("Remove Sunday");
                    }
                  }}
                  color={isChecked7 ? theme.colors.primary : undefined}
                />
                <Text style={styles.checkboxText}>Chủ nhật</Text>
              </View>
              <Button
                title="TÌM KIẾM"
                buttonStyles={styles.searchButton}
                textStyles={styles.searchButtonText}
                onPress={() => {
                  onSubmit();
                }}
                loading={isLoading}
                disabled={
                  !selectedStartTime ||
                  !selectedEndTime ||
                  !storeId ||
                  !billardtypeId ||
                  !areaId ||
                  !monthYear
                }
              />
            </View>
          </View>
          <Text style={styles.title}>Thông tin bàn.</Text>
          {tableData.length === 0 ? (
            <Text style={styles.title2}>Không tìm thấy bàn.</Text>
          ) : (
            tableData.map((item) => (
              <View key={item.id} style={styles.dataBox}>
                <View style={styles.innerBox}>
                  <View style={styles.imageBox}>
                    <Image
                      style={styles.image}
                      source={{ uri: item.image.toString() }}
                    />
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
                    <Text style={styles.infoBoxTitle}>Tên bàn:</Text>
                    <Text style={styles.infoBoxText}>{item.name}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Loại bàn:</Text>
                    <Text style={styles.infoBoxText}>
                      {item.billiardTypeName}
                    </Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Khu vực:</Text>
                    <Text style={styles.infoBoxText}>{item.areaName}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Giá bàn:</Text>
                    <Text style={styles.infoBoxText}>
                      {/* {item.bidaPrice.toLocaleString("en-US")} */}
                      {item.bidaPrice}
                    </Text>
                  </View>
                </View>
                <IconButton
                  iconName={"addCircleIcon"}
                  textStyles={{ fontSize: 13, color: "white" }}
                  buttonStyles={styles.submitButton}
                  title={"ĐẶT BÀN"}
                  onPress={() => {
                    submitTable(item.id);
                  }}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  detailsBox: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    marginHorizontal: 5,
    marginTop: 10,
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
  titleBox: {
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  title2: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  warningBox: {},
  warning: {
    color: "red",
    fontSize: 10,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  searchRow: {
    gap: 10,
    paddingVertical: 10,
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
  },
  searchButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  checkbox: {
    margin: 8,
  },
  checkboxText: {
    fontSize: 15,
  },
  innerBox: {
    backgroundColor: theme.colors.background,
    padding: 15,
    borderRadius: 10,
    borderCurve: "continuous",
  },
  infoBoxTitle: {
    fontSize: 15,
    fontWeight: "bold",
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
  imageBox: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dataBox: {
    backgroundColor: theme.colors.background,
    marginVertical: 5,
    marginHorizontal: 5,
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
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 2,
  },
  submitButton: {
    gap: 5,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
});
