import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import CustomDropdown from "@/components/customDropdown";
import Icon from "@/assets/icons/icons";
import { get_all_Store } from "@/api/store_api";
import Button from "@/components/roundButton";
import { get_courses } from "@/api/course_api";
import IconButton from "@/components/iconButton";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
const CourseScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [courseData, setCourseData] = useState([]);
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

    // Format: "Thứ Hai, 27 Tháng 11, 2024"
    return `${daysOfWeek[date.getDay()]}, ${date.getDate()} ${
      monthNames[date.getMonth()]
    }, ${date.getFullYear()}`;
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
  const fetchData = async () => {
    const searchData = {
      storeId: "",
    };
    try {
      setIsLoading(true);
      get_courses(searchData).then((response) => {
        if (response?.data.status === 200) {
          const rawdata = response.data.data;
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
    fetchData();
    loadStore();
  }, []);
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
          <View style={styles.searchBox}>
            <Text style={styles.title}>Thông tin khóa học.</Text>
            {courseData.length === 0 ? (
              <Text style={styles.title2}>Không tìm thấy khóa học.</Text>
            ) : (
              courseData.map((item) => (
                <View key={item.id} style={styles.dataBox}>
                  <View style={styles.innerBox}>
                    <View style={styles.imageBox}>
                      <Image
                        style={styles.image}
                        source={{ uri: item.accountAvatar }}
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
                      <Text style={styles.infoBoxTitle}>Tên chi nhánh:</Text>
                      <Text style={styles.infoBoxText}>{item.storeName}</Text>
                    </View>
                    <View style={styles.infoBox2}>
                      <Text style={styles.infoBoxTitle}>Địa chỉ quán:</Text>
                      <Text style={styles.infoBoxText}>{item.address}</Text>
                    </View>
                    <View style={styles.infoBox3}>
                      <Text style={styles.infoBoxTitle}>Ngày bắt đầu:</Text>
                      <Text style={styles.infoBoxText}>{item.startDate}</Text>
                    </View>
                    <View style={styles.infoBox3}>
                      <Text style={styles.infoBoxTitle}>Ngày kết thúc:</Text>
                      <Text style={styles.infoBoxText}>{item.endDate}</Text>
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
                      console.log("Đăng ký khóa: " + item.id);
                    }}
                  />
                </View>
              ))
            )}
          </View>
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
