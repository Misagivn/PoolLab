import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { cancel_booking, get_user_booking } from "@/api/booking_api";
import { getStoredUser } from "@/api/tokenDecode";
import { theme } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/backButton";
import { get_all_Store } from "@/api/store_api";
import CustomDropdown from "@/components/customDropdown";
import Icon from "@/assets/icons/icons";
import { get_all_billard_type_area } from "@/api/area_api";
import { get_all_billard_type } from "@/api/billard_type";
import CustomAlert from "@/components/alertCustom";
import Button from "@/components/roundButton";
import IconButton from "@/components/iconButton";
const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [areaError, setAreaError] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [deleteResponse, setDeleteResponse] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [bookingData, setBookingData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [billardtypeData, setBillardTypeData] = useState([]);
  const [billardtypeId, setBillardTypeId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [areaData, setAreaData] = useState([]);
  const [infoStatus, setInfoStatus] = useState("");
  const searchData = {
    CustomerId: customerId,
    billiardTypeId: billardtypeId,
    storeId: storeId,
    areaId: areaId,
    status: infoStatus,
    SortBy: "createdDate",
    SortAscending: false,
    PageNumber: "1",
  };
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
  const statusData = [
    {
      label: "Đã đặt",
      value: "Đã Đặt",
    },
    {
      label: "Đã hủy",
      value: "Đã Huỷ",
    },
    {
      label: "Hoàn thành",
      value: "Hoàn Thành",
    },
    {
      label: "Trống",
      value: "",
    },
  ];
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
            setStoreId("");
            setBillardTypeId("");
            setAreaId("");
            setAlertVisible(false);
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
          } else {
            setAlertVisible(false);
          }
        }}
        onCancel={() => {}}
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
        setAreaData(transformData);
      }
    } catch (error) {
      setAlertVisible(true);
      setAreaError(
        "Không thể tải dữ liệu của Area!. Hãy thử đổi địa chỉ hoặc loại bàn."
      );
    }
  };
  const searchFunction = async () => {
    try {
      get_user_booking(searchData).then((response) => {
        if (response.data.status === 200) {
          setBookingData(response.data.data.items);
          setIsLoading(false);
        } else if (response.data.status === 404) {
          setAlertVisible(true);
          setErrorResponse(response.data.message);
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSearch = () => {
    setIsLoading(true);
    searchFunction();
  };
  const handleCancelBooking = async (bookingId) => {
    console.log("id deleted: ", bookingId);
    try {
      const response = await cancel_booking({ bookingId, cancelAnswer: "yes" });
      if (response.status === 200) {
        console.log("success delete: ", response.message);
        setAlertVisible(true);
        setDeleteResponse("Thành công hủy đặt lịch");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchData = async () => {
    const storedUser = await getStoredUser();
    setIsLoading(true);
    try {
      if (storedUser) {
        setCustomerId(storedUser.AccountId);
        const dataDefault = {
          CustomerId: storedUser.AccountId,
          billiardTypeId: billardtypeId,
          storeId: storeId,
          areaId: areaId,
          status: infoStatus,
          SortBy: "createdDate",
          SortAscending: false,
          PageNumber: "1",
        };
        get_user_booking(dataDefault).then((response) => {
          if (response.data.status === 200) {
            setBookingData(response.data.data.items);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            console.log("Error fetch: ", response.data);
          }
        });
      }
    } catch (error) {
      console.error("Error loading stored user:", error);
      setIsLoading(false);
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
  useEffect(() => {
    loadStore();
    loadBillardType();
    fetchData();
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
        `${errorResponse}`,
        "OK",
        "Hủy",
        undefined,
        true,
        undefined
      );
    } else if (deleteResponse) {
      return alertPopup(
        "Thành công",
        deleteResponse,
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
      <View style={styles.container}>
        <ScrollView>
          <BackButton />
          <View style={styles.titleBox}>
            <Text style={styles.title}>Tìm kiếm thông tin</Text>
            <Text style={styles.subTitle}>bàn đặt</Text>
            <Text style={styles.warning}>
              *Lưu ý: Người dùng có thể hủy đặt bàn sau khi đã đặt 20 phút để
              được hoàn tiền 100%. Sau khi quá thời gian 20 phút kể từ khi tạo
              đơn đặt bàn. Hủy bàn sẽ không được hoàn tiền.
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
              containerStyles={{ marginVertical: 5 }}
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
              containerStyles={{ marginVertical: 5 }}
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
              placeholder="Chọn khu vực"
              data={areaData}
              onSelect={async (item) => {
                setAreaId(item.value);
              }}
              containerStyles={{ marginVertical: 5 }}
            />
            <CustomDropdown
              icon={
                <Icon
                  name="checkIcon"
                  size={25}
                  strokeWidth={1.5}
                  color="black"
                />
              }
              placeholder="Chọn trạng thái bàn"
              data={statusData}
              onSelect={async (item) => {
                setInfoStatus(item.value);
              }}
              containerStyles={{ marginVertical: 5 }}
            />
            <View style={styles.checkInfo}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: theme.colors.secondary,
                    borderCurve: 20,
                    borderRadius: 10,
                  }}
                />
                <Text style={{ color: "black", fontSize: 10 }}>
                  Bàn được đặt
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: theme.colors.hightLight,
                    borderCurve: 20,
                    borderRadius: 10,
                  }}
                />
                <Text style={{ color: "black", fontSize: 10 }}>Bàn đã hủy</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: theme.colors.greenCheck,
                    borderCurve: 20,
                    borderRadius: 10,
                  }}
                />
                <Text style={{ color: "black", fontSize: 10 }}>
                  Bàn đã hoàn thành
                </Text>
              </View>
            </View>
            <Button
              title="TÌM KIẾM BÀN ĐẶT"
              buttonStyles={styles.updateButton}
              textStyles={styles.updateButtonText}
              onPress={() => {
                handleSearch();
              }}
              loading={isLoading}
            />
          </View>
          {bookingData.length === 0 ? (
            <Text style={styles.subTitle}>Không tìm thấy lịch đặt bàn.</Text>
          ) : (
            bookingData.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.dataBox,
                  item.status === "Đã Đặt"
                    ? styles.confirmedBox
                    : item.status === "Đã Huỷ"
                    ? styles.pendingBox
                    : styles.completeBox,
                ]}
              >
                <View style={styles.innerBox}>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Tên bàn:</Text>
                    <Text style={styles.infoBoxText}>{item.tableName}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Ngày chơi:</Text>
                    <Text style={styles.infoBoxText}>{item.bookingDate}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Thời gian chơi:</Text>
                    <Text style={styles.infoBoxText}>
                      {item.timeStart} - {item.timeEnd}
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
                    <Text style={styles.infoBoxTitle}>Tiền cọc:</Text>
                    <Text style={styles.infoBoxText}>
                      {Number(JSON.parse(item.deposit)).toLocaleString("en-US")}
                    </Text>
                  </View>
                  <View style={styles.infoBox3}>
                    <Text style={styles.infoBoxTitle}>Ngày tạo:</Text>
                    <Text style={styles.infoBoxText}>
                      {formatTime(item.createdDate)}
                    </Text>
                  </View>
                  {item.status === "Đã Đặt" && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "flex-end",
                        marginTop: 5,
                      }}
                    >
                      <IconButton
                        iconName={"trashIcon"}
                        textStyles={{ fontSize: 13, color: "white" }}
                        buttonStyles={styles.cancelButton}
                        title={"HỦY BÀN"}
                        onPress={() => handleCancelBooking(item.id)}
                      />
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  titleBox: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    marginHorizontal: 5,
    marginVertical: 5,
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
  dataBox: {
    backgroundColor: theme.colors.background,
    marginVertical: 5,
    marginHorizontal: 5,
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
  confirmedBox: {
    backgroundColor: theme.colors.secondary,
    marginVertical: 5,
    marginHorizontal: 5,
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
  pendingBox: {
    backgroundColor: theme.colors.hightLight,
    marginVertical: 5,
    marginHorizontal: 5,
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
  completeBox: {
    backgroundColor: theme.colors.greenCheck,
    marginVertical: 5,
    marginHorizontal: 5,
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.colors.primary,
  },

  subTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  warning: {
    color: "red",
    fontSize: 10,
  },
  checkInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
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
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
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
  cancelButton: {
    gap: 5,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
});
