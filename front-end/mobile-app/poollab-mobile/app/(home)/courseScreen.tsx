import { ScrollView, StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import CustomDropdown from "@/components/customDropdown";
import Icon from "@/assets/icons/icons";
import { get_all_Store } from "@/api/store_api";
import Button from "@/components/roundButton";
import { get_courses, register_course } from "@/api/course_api";
import IconButton from "@/components/iconButton";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getAccountId } from "@/data/userData";
import CustomAlert from "@/components/alertCustom";
import { router } from "expo-router";
const CourseScreen = () => {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [courseData, setCourseData] = useState([]);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const getUserId = async () => {
    try {
      const userId = await getAccountId();
      setUserId(userId);
    } catch (error) {
      console.error("Error loading user id:", error);
    }
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
          router.push("../(courseManage)");
        }}
        onCancel={() => {}}
      />
    );
  };
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
  const loadStore = async () => {
    try {
      const storedStore = await get_all_Store();
      if (storedStore) {
        const rawdata = storedStore.data.data;
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
  const onSubmit = () => {
    const searchData = {
      storeId: storeId,
      status: "Kích Hoạt",
    };
    if (storeId === "") {
      console.log("Store id is empty");
    } else {
      setIsLoading(true);
      try {
        get_courses(searchData).then((response) => {
          if (response?.data.status === 200) {
            const rawdata = response.data.data;
            setCourseData(rawdata.items);
            setIsLoading(false);
          } else if (response.data.status === 404) {
            setIsLoading(false);
            setCourseData([]);
          } else {
            setIsLoading(false);
            console.log("Error: ", response.data);
          }
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };
  const registerCourse = async (courseId) => {
    const data = {
      studentId: userId,
      courseId: courseId,
    };
    console.log("data: ", data);
    try {
      register_course(data).then((response) => {
        if (response.status === 200) {
          setRegisterSuccess(true);
          setAlertVisible(true);
        } else {
          Alert.alert("Lỗi", response.data.message);
        }
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const fetchData = async () => {
    const searchData = {
      storeId: "",
      status: "Kích Hoạt",
    };
    try {
      setIsLoading(true);
      get_courses(searchData).then((response) => {
        if (response?.data.status === 200) {
          setCourseData(response.data.data.items);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log("Error fetch: ", response.data);
        }
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  useEffect(() => {
    getUserId();
    fetchData();
    loadStore();
  }, []);
  if (alertVisible) {
    return alertPopup(
      "Thông báo",
      "Đã thực hiện thêm khóa học thành công",
      "OK"
    );
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader />
          <View style={styles.searchBox}>
            <View style={styles.titleBox}>
              <Text style={styles.title}>Nhập thông tin</Text>
              <Text style={styles.subTitle}>tìm kiếm khóa học</Text>
            </View>
            <View style={styles.warningBox}>
              <Text style={styles.warning}>
                *Lưu ý: Chúng tôi không thu phí khóa học. Mọi chi phí trong khóa
                sẽ được học viên trả trực tiếp cho giáo viên. Bạn có thể hủy
                đăng ký học. Đồng thời khóa học cũng có thể bị hủy vì nhiều lý
                do. Mong bạn nên kiểm tra trangh thái khóa học thường xuyên.
              </Text>
            </View>
            <View style={styles.searchRow}>
              <Text style={styles.inputTitle}>Chọn chi nhánh:</Text>
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
                }}
                onClear={() => {
                  setStoreId("");
                }}
              />
              <Button
                title="TÌM KIẾM"
                buttonStyles={styles.updateButton}
                textStyles={styles.updateButtonText}
                onPress={() => {
                  onSubmit();
                }}
                loading={isLoading}
                disabled={storeId === ""}
              />
            </View>
          </View>
          {courseData.length === 0 ? (
            <Text style={styles.title2}>Không tìm thấy khóa học.</Text>
          ) : (
            courseData.map((item) => (
              <View key={item.id} style={styles.dataBox}>
                <View style={styles.innerBox}>
                  <View style={styles.imageBox}>
                    <Image
                      style={styles.image}
                      source={
                        item.accountAvatar
                          ? { uri: item.accountAvatar }
                          : require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")
                      }
                    />
                  </View>
                  <View style={styles.infoBox3}>
                    <Text style={styles.infoBoxTitle}>Tên khóa học:</Text>
                    <Text style={styles.infoBoxText}>{item.title}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Tên giáo viên:</Text>
                    <Text style={styles.infoBoxText}>{item.accountName}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Đánh giá khóa học:</Text>
                    <Text style={styles.infoBoxText}>{item.level}</Text>
                  </View>
                  <View style={styles.infoBox3}>
                    <Text style={styles.infoBoxTitle}>Mô tả khóa học:</Text>
                    <Text style={styles.infoBoxText}>{item.descript}</Text>
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
                      {item.startDate} đến {item.endDate}
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
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>
                      Số lượng người tham gia:
                    </Text>
                    <Text style={styles.infoBoxText}>{item.quantity}</Text>
                  </View>
                </View>
                <IconButton
                  iconName={"addCircleIcon"}
                  textStyles={{ fontSize: 13, color: "white" }}
                  buttonStyles={styles.submitButton}
                  title={"ĐẶT KHÓA HỌC"}
                  onPress={() => {
                    registerCourse(item.id);
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

export default CourseScreen;

const styles = StyleSheet.create({
  container: {},
  searchBox: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    marginHorizontal: 10,
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
  inputTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
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
  customDivider: {
    padding: 50,
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
  submitButton: {
    gap: 5,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
  imageBox: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 2,
  },
});
