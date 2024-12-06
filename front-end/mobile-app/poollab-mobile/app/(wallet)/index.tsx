import {
  Alert,
  Image,
  NativeEventEmitter,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputCustom from "@/components/inputCustom";
import { theme } from "@/constants/theme";
import BackButton from "@/components/backButton";
import Icon from "@/assets/icons/icons";
import Button from "@/components/roundButton";
import { add_balance_vnpay } from "@/api/user_api";
import { getAccountId } from "@/data/userData";
import CustomAlert from "@/components/alertCustom";
import { router } from "expo-router";
import { WebView } from "react-native-webview";
import axios from "axios";
const index = () => {
  const [balanceInput, setBalanceInput] = useState("");
  const [text, setText] = useState("OpenSDK");
  const [accountId, setAccountId] = useState("");
  const [errorMessage, setErrorMessage] = useState("Xin hãy nhập số tiền");
  const [alertVisible, setAlertVisible] = useState(false);
  const [numberValidation, setNumberValidation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [transactionData, setTransactionData] = useState("");
  const [isOnWebView, setIsOnWebView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPaymentProcessed, setIsPaymentProcessed] = useState(false); // Cờ chặn nhiều lần xử lý
  const getAccountIdHandler = async () => {
    const accountId = await getAccountId();
    setAccountId(accountId);
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
          setErrorMessage("");
        }}
        onCancel={() => {
          setAlertVisible(false);
        }}
      />
    );
  };

  const validateNumberGreaterThan10000 = () => {
    const numberRegex = /^[1-9]\d{4,6}$/; // Matches numbers > 10000 and < 10 million
    const numericValue = Number(balanceInput);

    if (!numberRegex.test(String(balanceInput)) || numericValue >= 10000000) {
      console.log("Number is not valid");
      setErrorMessage("Xin hãy nhập số từ 10,000 đến 10,000,000");
      setNumberValidation(false);
    } else {
      setErrorMessage("");
      setNumberValidation(true);
    }
  };
  const addBalanceHandler = async () => {
    if (!numberValidation || !balanceInput) {
      console.log(
        "Number is not valid or balanceInput is empty" +
          balanceInput +
          numberValidation
      );
      setAlertVisible(true);
    } else {
      setErrorMessage("");
      setAlertVisible(false);
      setIsLoading(true);
      try {
        const addData = {
          customerId: accountId,
          amount: balanceInput,
        };
        console.log(addData);
        add_balance_vnpay(addData).then((response) => {
          if (response.data.status === 200) {
            setIsLoading(false);
            console.log(response.data);
            setTransactionData(response.data.data);
            console.log("Transaction data: ", response.data.data);
            setIsOnWebView(true);
          } else {
            setAlertVisible(true);
            setErrorResponse(response);
            setIsLoading(false);
          }
        });
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };
  const handleShouldStartLoad = (request) => {
    const { url } = request;
    console.log("url: ", url);
    // Chỉ xử lý khi điều hướng đến URL kết quả và chưa xử lý trước đó
    if (
      url.includes("/api/vnpay/paymentcallbackvnpay") &&
      !isPaymentProcessed
    ) {
      setIsPaymentProcessed(true); // Đánh dấu đã xử lý
      fetchTransactionResult(url);
      return false; // Ngăn WebView tiếp tục điều hướng
    }

    return true; // Cho phép WebView tiếp tục tải URL khác
  };

  const fetchTransactionResult = async (url) => {
    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.status === 200) {
        Alert.alert("Thông báo", "Thanh toán thành công!");
      } else {
        Alert.alert("Thông báo", "Thanh toán thất bại: " + result.message);
      }

      router.push("/(home)"); // Quay lại màn hình trước đó
    } catch (error) {
      console.error("Lỗi khi lấy kết quả thanh toán:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi xử lý thanh toán.");
    }
  };
  useEffect(() => {
    getAccountIdHandler();
  }, []);

  if (isOnWebView) {
    return (
      <WebView
        source={{
          uri: transactionData.toString(),
        }}
        onLoadEnd={() => setLoading(false)}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        style={{ flex: 1 }}
      />
    );
  }
  if (alertVisible) {
    console.log("errorMessage: ", errorMessage);
    console.log("errorResponse: ", errorResponse);
    if (errorMessage) {
      return alertPopup("Lỗi", errorMessage, "OK", "Hủy");
    } else {
      return alertPopup("Lỗi", errorResponse, "OK", "Hủy");
    }
  }
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <BackButton />
        <View style={styles.titleBox}>
          <Text style={styles.title}>Thêm số dư </Text>
          <Text style={styles.subTitle}>vào tài khoản</Text>
          <View style={{ marginTop: 10 }}>
            <InputCustom
              label="Số dư"
              placeholder="Nhập số dư cần nạp"
              keyboardType="number-pad"
              icon={
                <Icon name="moneyIcon" size={25} color={theme.colors.primary} />
              }
              onEndEditing={validateNumberGreaterThan10000}
              onChangeText={(text) => {
                setBalanceInput(text.toString());
              }}
              // Convert input to number and validate
            />
          </View>
          <Button
            title="Nạp tiền"
            buttonStyles={styles.customButton1}
            textStyles={styles.customButtonText1}
            onPress={() => addBalanceHandler()}
            disabled={numberValidation === false}
            loading={isLoading}
          />
          <View style={styles.imageBox}>
            <Image
              source={require("../../assets/images/vnPay.png")}
              style={styles.Image}
            />
          </View>
        </View>
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
  customButton1: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 5,
    marginTop: 10,
  },
  customButtonText1: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  imageBox: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  Image: {
    width: 200,
    height: 200,
  },
});

// import { StyleSheet, Text, View } from "react-native";
// import React from "react";

// const index = () => {
//   return (
//     <View>
//       <Text>index</Text>
//     </View>
//   );
// };

// export default index;

// const styles = StyleSheet.create({});
