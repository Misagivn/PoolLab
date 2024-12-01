import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/backButton";
import { theme } from "@/constants/theme";
import CustomDropdown from "@/components/customDropdown";
import Icon from "@/assets/icons/icons";
import { getAccountId } from "@/data/userData";
import Button from "@/components/roundButton";
import { wallet_manage } from "@/api/user_api";
const index = () => {
  const [transactionType, setTransactionType] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const transactionTypeData = [
    {
      label: "Thanh toán",
      value: -1,
    },
    {
      label: "Nhận tiền",
      value: 1,
    },
  ];
  const getUserId = async () => {
    try {
      const storedUser = await getAccountId();
      if (storedUser) {
        setUserId(storedUser);
        return storedUser;
      }
    } catch (error) {
      console.error("Error loading stored user:", error);
    }
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
  const fetchData = async () => {
    setIsLoading(true);
    const userId = await getUserId();
    try {
      console.log("gave data: ", userId + " " + transactionType);
      const response = await wallet_manage(userId, transactionType);
      if (response.status === 200) {
        setTransactionData(response.data.data.items);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading stored user:", error);
      setIsLoading(false);
    }
  };
  const searchFunction = async () => {
    try {
      wallet_manage(userId, transactionType).then((response) => {
        if (response.data.status === 200) {
          setTransactionData(response.data.data.items);
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Error loading stored user:", error);
      setIsLoading(false);
    }
  };
  const handleSearch = () => {
    setIsLoading(true);
    searchFunction();
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <BackButton />
          <View style={styles.titleBox}>
            <Text style={styles.title}>Tìm kiếm thông tin</Text>
            <Text style={styles.title2}>giao dịch tài khoản.</Text>
            <CustomDropdown
              icon={
                <Icon
                  name="locationIcon"
                  size={25}
                  strokeWidth={1.5}
                  color="black"
                />
              }
              placeholder="Loại giao dịch"
              data={transactionTypeData}
              onSelect={async (item) => setTransactionType(item.value)}
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
                  Giao dịch nhận tiền
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
                  Giao dịch thanh toán
                </Text>
              </View>
            </View>
            <Button
              title="TÌM KIẾM"
              buttonStyles={styles.updateButton}
              textStyles={styles.updateButtonText}
              onPress={() => handleSearch()}
              loading={isLoading}
            />
          </View>
          {transactionData.map((item) => (
            <View
              key={item.id}
              style={[
                styles.dataBox,
                item.typeCode === 1 ? styles.confirmedBox : styles.pendingBox,
              ]}
            >
              <View style={styles.innerBox}>
                <View style={styles.infoBox2}>
                  <Text style={styles.infoBoxTitle}>
                    Phương thức giao dịch:
                  </Text>
                  <Text style={styles.infoBoxText}>{item.paymentMethod}</Text>
                </View>
                <View style={styles.infoBox2}>
                  <Text style={styles.infoBoxTitle}>Thông tin giao dịch:</Text>
                  <Text style={styles.infoBoxText}>{item.paymentInfo}</Text>
                </View>
                <View style={styles.infoBox2}>
                  <Text style={styles.infoBoxTitle}>Tên người giao dich:</Text>
                  <Text style={styles.infoBoxText}>{item.username}</Text>
                </View>
                <View style={styles.infoBox2}>
                  <Text style={styles.infoBoxTitle}>Giá trị giao dịch:</Text>
                  <Text style={styles.infoBoxText}>
                    {Number(JSON.parse(item.amount)).toLocaleString("en-US")}
                  </Text>
                </View>
                <View style={styles.infoBox3}>
                  <Text style={styles.infoBoxTitle}>Ngày tạo giao dịch:</Text>
                  <Text style={styles.infoBoxText}>
                    {formatTime(item.paymentDate)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
    fontSize: 25,
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
  infoBoxTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  infoBox2: {
    flexDirection: "row",
    gap: 10,
  },
  infoBoxText: {
    fontSize: 15,
  },
  infoBox3: {
    gap: 2,
  },
  checkInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
