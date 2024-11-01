import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import InputCustom from "@/components/inputCustom";
import CustomDropdown from "@/components/customDropdown";
import Icon from "@/assets/icons/icons";
import IconButton from "@/components/iconButton";
import { get_all_Store } from "@/api/store_api";
import Button from "@/components/roundButton";
//demo data
const dropdownData = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];
const ReserveScreen = () => {
  const [storeData, setStoreData] = useState([]);
  const [address, setAddress] = useState("");
  // const transformData = (storeData: any[]) => {
  //   return storeData.map((item) => ({
  //     label: item.name,
  //     value: item.id,
  //   }));
  // };
  useEffect(() => {
    const loadStore = async () => {
      try {
        const storedStore = await get_all_Store();
        if (storedStore) {
          //setStoreData(storedStore.data.data);
          const rawdata = storedStore.data.data;
          const transformData = rawdata.map(
            (item: { name: any; id: any; address: any }) => ({
              label: item.name,
              value: item.id,
              address: item.address,
            })
          );
          setStoreData(transformData);
          console.log(storedStore.data.data);
          console.log(transformData);
        }
      } catch (error) {
        console.error("Error loading stored store:", error);
      }
    };
    // const loadBillardType = async () => {
    //   try {
    //     const storedBillardType = await get_all_Store();
    //     if (storedBillardType) {
    //       //setStoreData(storedStore.data.data);
    //       const rawdata = storedBillardType.data.data;
    //       const transformData = rawdata.map((item: { name: any; id: any }) => ({
    //         label: item.name,
    //         value: item.id,
    //       }));
    //       setStoreData(transformData);
    //       console.log(storedBillardType.data.data);
    //       console.log(transformData);
    //     }
    //   } catch (error) {
    //     console.error("Error loading stored store:", error);
    //   }
    // };
    loadStore();
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <CustomHeader />
        <View style={styles.searchBox}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Nhập thông tin</Text>
            <Text style={styles.subTitle}>đặt bàn</Text>
          </View>
          <View style={styles.warningBox}>
            <Text style={styles.warning}>
              *Lưu ý: Dựa vào các thông tin người dùng cung cấp. Hệ thống sẽ tự
              động tìm kiếm các bàn thích hợp và đưa ra lựa chọn phù hợp nhât.
              Người dùng không thể chỉnh sửa thông tin của bàn được chọn.
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
            />
            <InputCustom
              placeholder="AAAAAA"
              icon={
                <Icon
                  name="emailIcon"
                  size={10}
                  strokeWidth={1}
                  color="black"
                />
              }
            />
            <InputCustom
              placeholder="AAAAAA"
              icon={
                <Icon
                  name="emailIcon"
                  size={10}
                  strokeWidth={1}
                  color="black"
                />
              }
            />
            <InputCustom
              placeholder="AAAAAA"
              icon={
                <Icon
                  name="emailIcon"
                  size={10}
                  strokeWidth={1}
                  color="black"
                />
              }
            />
            <Button
              title="TÌM KIẾM & ĐẶT BÀN"
              buttonStyles={styles.updateButton}
              textStyles={styles.updateButtonText}
              onPress={() => {
                console.log("Đặt bàn button");
              }}
            />
          </View>
        </View>
      </View>
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
  titleBox: {},
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
  warningBox: {},
  warning: {
    color: "red",
    fontSize: 12,
  },
  searchRow: {
    gap: 10,
    paddingVertical: 10,
  },
  updateButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
  },
  updateButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
