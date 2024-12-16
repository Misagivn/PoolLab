import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/backButton";
import { theme } from "@/constants/theme";
import { router } from "expo-router";
import Button from "@/components/roundButton";
import { get_all_voucher } from "@/api/vouceher_api";
import { getAccountId } from "@/data/userData";
import IconButton from "@/components/iconButton";

const index = () => {
  const [voucherData, setVoucherData] = useState([]);
  const getVoucher = async () => {
    const customerId = await getAccountId();
    try {
      const response = await get_all_voucher(customerId);
      setVoucherData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getVoucher();
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <BackButton />
          <View style={styles.titleBox}>
            <Text style={styles.title}>Thông tin voucher</Text>
            <Text style={styles.title2}>
              Người dùng có thể đổi điểm để nhận các voucher khuyến mãi đặc biệt
            </Text>
            <View style={{ marginTop: 10 }}>
              <Button
                title="ĐỔI ĐIỂM"
                onPress={() => router.push("./redeemVoucher")}
              />
            </View>
          </View>
          {voucherData.length === 0 ? (
            <Text style={styles.subTitle}>Không có voucher nào</Text>
          ) : (
            voucherData.map((item) => (
              <View key={item.id} style={styles.dataBox}>
                <View style={styles.innerBox}>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Tên voucher:</Text>
                    <Text style={styles.infoBoxText}>{item.voucherName}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Mã voucher:</Text>
                    <Text style={styles.infoBoxText}>{item.vouCode}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Giá trị giảm giá:</Text>
                    <Text style={styles.infoBoxText}>{item.discount}%</Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "flex-end",
                      marginTop: 5,
                    }}
                  >
                    <IconButton
                      iconName={"voucherIcon"}
                      textStyles={{ fontSize: 13, color: "white" }}
                      buttonStyles={styles.useButton}
                      title={"DÙNG VOUCHER"}
                      onPress={() => router.push("../(home)/qrScanner")}
                    />
                  </View>
                </View>
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  title2: {
    fontSize: 15,
    fontWeight: "normal",
    color: "black",
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
  useButton: {
    gap: 5,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
  subTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
});
