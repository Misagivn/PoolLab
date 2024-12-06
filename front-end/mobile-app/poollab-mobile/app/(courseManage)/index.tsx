import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  cancel_booking_recurring,
  get_user_booking_recurring,
} from "@/api/booking_api";
import { getStoredUser } from "@/api/tokenDecode";
import { theme } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/backButton";
import { get_all_Store } from "@/api/store_api";
import CustomDropdown from "@/components/customDropdown";
import Icon from "@/assets/icons/icons";
import CustomAlert from "@/components/alertCustom";
import Button from "@/components/roundButton";
import IconButton from "@/components/iconButton";
import { getAccountId } from "@/data/userData";
import { cancel_courses, get_course_enroll } from "@/api/course_api";
const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [storeData, setStoreData] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [infoStatus, setInfoStatus] = useState("");
  const [courseData, setCourseData] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const statusData = [
    {
      label: "Kích hoạt",
      value: "Kích Hoạt",
    },
    {
      label: "Vô hiệu",
      value: "Vô Hiệu",
    },
  ];
  const convertScheduleToVietnamese = (scheduleString) => {
    // Create a mapping of English day names to Vietnamese
    const dayMapping = {
      Monday: "Thứ Hai",
      Tuesday: "Thứ Ba",
      Wednesday: "Thứ Tư",
      Thursday: "Thứ Năm",
      Friday: "Thứ Sáu",
      Saturday: "Thứ Bảy",
      Sunday: "Chủ Nhật",
    };

    // Split the schedule string into an array of days
    const days = scheduleString.split(",");

    // Convert each day to Vietnamese
    const vietnameseDays = days.map((day) => {
      // Trim any whitespace and get the Vietnamese translation
      const trimmedDay = day.trim();
      return dayMapping[trimmedDay] || trimmedDay;
    });

    // Join the days back into a string
    return vietnameseDays.join(", ");
  };
  const alertPopup = (title, message, confirmText, cancelText) => {
    return (
      <CustomAlert
        visible={alertVisible}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          setAlertVisible(false);
          setStoreId("");
          setSearchError(false);
          setDeleteSuccess(false);
        }}
        onCancel={() => {}}
      />
    );
  };
  const searchFunction = async () => {
    const data = {
      userId: customerId,
      storeId: storeId,
      status: infoStatus,
    };
    console.log(data);
    try {
      get_course_enroll(data).then((response) => {
        if (response.data.status === 200) {
          setCourseData(response.data.data.items);

          setIsLoading(false);
        } else {
          console.log(response.errors);
          setIsLoading(false);
          setAlertVisible(true);
          setSearchError(true);
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
  const handleCancelCourse = async (bookingId) => {
    try {
      const response = await cancel_courses(bookingId);
      console.log(response);
      if (response.status === 200) {
        console.log("success delete:");
        setAlertVisible(true);
        setDeleteSuccess(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchData = async () => {
    const userId = await getAccountId();
    setCustomerId(userId);
    const data = {
      userId: userId,
      storeId: "",
      status: "",
    };
    setIsLoading(true);
    try {
      get_course_enroll(data).then((response) => {
        setIsLoading(false);
        if (response.data.status === 200) {
          setCourseData(response.data.data.items);
        }
      });
    } catch (error) {
      console.error("Error loading stored user:", error);
    }
  };
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
  useEffect(() => {
    loadStore();
    fetchData();
  }, []);
  if (alertVisible) {
    if (searchError) {
      return alertPopup(
        "Lỗi",
        "Không tim thầy khóa học, vui lòng đổi chi nhánh",
        "OK",
        "Hủy"
      );
    }
    if (deleteSuccess) {
      return alertPopup("Thông báo", "Huỷ khóa học thành công", "OK");
    }
  }
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ScrollView>
          <BackButton />
          <View style={styles.titleBox}>
            <Text style={styles.title}>Tìm kiếm thông tin</Text>
            <Text style={styles.subTitle}>khóa học</Text>
            <Text style={styles.warning}>
              *Lưu ý: Người dùng có thể hủy khóa học.
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
              placeholder="Chọn vị trí"
              data={storeData}
              onSelect={async (item) => {
                setStoreId(item.value);
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
              placeholder="Chọn trạng thái khóa học"
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
                  Khóa học đã đăng ký
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
                <Text style={{ color: "black", fontSize: 10 }}>
                  Khóa học đã hủy
                </Text>
              </View>
            </View>
            <Button
              title="TÌM KIẾM KHÓA HỌC"
              buttonStyles={styles.updateButton}
              textStyles={styles.updateButtonText}
              onPress={() => {
                handleSearch();
              }}
              loading={isLoading}
            />
          </View>
          {courseData.length === 0 ? (
            <Text style={styles.title2}>Không tìm thấy khóa học.</Text>
          ) : (
            courseData.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.dataBox,
                  item.status === "Kích Hoạt"
                    ? styles.confirmedBox
                    : styles.pendingBox,
                ]}
              >
                <View style={styles.innerBox}>
                  <View style={styles.infoBox3}>
                    <Text style={styles.infoBoxTitle}>Tên khóa học:</Text>
                    <Text style={styles.infoBoxText}>{item.title}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Tên giáo viên:</Text>
                    <Text style={styles.infoBoxText}>{item.mentorName}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Tên chi nhánh:</Text>
                    <Text style={styles.infoBoxText}>{item.storeName}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Địa chỉ quán:</Text>
                    <Text style={styles.infoBoxText}>{item.address}</Text>
                  </View>
                  <View style={styles.infoBox3}>
                    <Text style={styles.infoBoxTitle}>
                      Ngày bắt đầu - kết thúc:
                    </Text>
                    <Text style={styles.infoBoxText}>
                      {item.startDate.split("T")[0]} đến{" "}
                      {item.endDate.split("T")[0]}
                    </Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Thời gian học:</Text>
                    <Text style={styles.infoBoxText}>
                      {item.startTime} - {item.endTime}
                    </Text>
                  </View>
                  <View style={styles.infoBox3}>
                    <Text style={styles.infoBoxTitle}>Các buổi học:</Text>
                    <Text style={styles.infoBoxText}>
                      {convertScheduleToVietnamese(item.schedule)}
                    </Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Giá khóa học:</Text>
                    <Text style={styles.infoBoxText}>
                      {item.price.toLocaleString("en-US")}
                    </Text>
                  </View>
                  {item.status === "Kích Hoạt" && (
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
                        title={"HỦY KHÓA HỌC"}
                        onPress={() => handleCancelCourse(item.id)}
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
