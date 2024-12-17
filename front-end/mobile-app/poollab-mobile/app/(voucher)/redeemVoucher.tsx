import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/backButton";
import { theme } from "@/constants/theme";
import { router } from "expo-router";
import Button from "@/components/roundButton";
import {
  get_all_voucher,
  get_redeemable_voucher,
  redeem_voucher,
} from "@/api/vouceher_api";
import { getAccountId } from "@/data/userData";
import IconButton from "@/components/iconButton";
import { get_user_details } from "@/api/user_api";
import CustomAlert from "@/components/alertCustom";

const index = () => {
  const [cusomterId, setCusomterId] = useState("");
  const [userPoints, setUserPoints] = useState("");
  const [voucherData, setVoucherData] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [successResponse, setSuccessResponse] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const alertPopup = (
    title: string | undefined,
    message: string | undefined,
    confirmText: string | undefined,
    cancelText: string | undefined
  ) => {
    return (
      <CustomAlert
        visible={alertVisible}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          setAlertVisible(false);
          setErrorResponse("");
          if (successResponse) {
            router.back();
            setSuccessResponse("");
          }
        }}
        onCancel={() => {}}
      />
    );
  };
  const loadStat = async () => {
    try {
      const accountId = await getAccountId();
      if (accountId) {
        setCusomterId(accountId);
        get_user_details(accountId).then((response) => {
          if (response.data.status === 200) {
            const userPoints = response.data.data.point;
            setUserPoints(userPoints);
          }
        });
      }
    } catch (error) {
      console.error("Error loading stored user:", error);
    }
  };
  const get_redeem_voucher = async () => {
    const data = {
      status: "Kích Hoạt",
    };
    try {
      const response = await get_redeemable_voucher(data);
      if (response.status === 200) {
        setVoucherData(response.data.data.items);
      } else {
        console.log("Error: ", response.data.message);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const redeemVoucher = async (voucherId) => {
    const data = {
      voucherID: voucherId,
      customerID: cusomterId,
    };
    try {
      console.log(data);
      const response = await redeem_voucher(data);
      console.log(response);
      if (response.data.status === 200) {
        setAlertVisible(true);
        setSuccessResponse(response.data.message);
      } else {
        setErrorResponse(response.data.message);
        setAlertVisible(true);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  useEffect(() => {
    loadStat();
    get_redeem_voucher();
  }, []);
  if (alertVisible) {
    if (errorResponse) {
      return alertPopup("Lỗi", errorResponse, "OK", "Hủy");
    } else if (successResponse) {
      return alertPopup("Thông báo", successResponse, "OK", "Hủy");
    }
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <BackButton />
          <View style={styles.titleBox}>
            <Text style={styles.title}>Đổi điểm nhận voucher</Text>
            <Text style={styles.title2}>
              Các voucher được đổi sẽ được đưa vào ví voucher của bạn, và có thế
              sử dụng bất cứ khi nào, không giới hạn thời gian.
            </Text>
            <View style={styles.pointCount}>
              <TextInput
                style={{
                  color: "black",
                  fontSize: 15,
                  fontWeight: "normal",
                  textAlign: "center",
                }}
                editable={false}
                placeholder="0"
                value={userPoints.toString()}
              />
              <Text>điểm</Text>
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
                    <Text style={styles.infoBoxText}>{item.name}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Mã voucher:</Text>
                    <Text style={styles.infoBoxText}>{item.vouCode}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Nội dung voucher:</Text>
                    <Text style={styles.infoBoxText}>{item.description}</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Giá trị giảm giá:</Text>
                    <Text style={styles.infoBoxText}>{item.discount}%</Text>
                  </View>
                  <View style={styles.infoBox2}>
                    <Text style={styles.infoBoxTitle}>Số lượng điểm:</Text>
                    <Text style={styles.infoBoxText}>{item.point}</Text>
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
                      title={"ĐỔI VOUCHER"}
                      onPress={() => redeemVoucher(item.id)}
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
  pointCount: {
    alignSelf: "center",
    marginTop: 5,
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 3,
    borderCurve: "continuous",
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  subTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
});
