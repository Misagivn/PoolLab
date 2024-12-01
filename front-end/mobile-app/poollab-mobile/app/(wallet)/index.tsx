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
import { add_balance } from "@/api/user_api";
import { getAccountId } from "@/data/userData";
import CustomAlert from "@/components/alertCustom";
import { router } from "expo-router";
const index = () => {
  const [balanceInput, setBalanceInput] = useState("");
  const [text, setText] = useState("OpenSDK");
  const [accountId, setAccountId] = useState("");
  const [errorMessage, setErrorMessage] = useState("Xin hãy nhập số tiền");
  const [alertVisible, setAlertVisible] = useState(false);
  const [numberValidation, setNumberValidation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
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
    const numberRegex = /^[1-9]\d{4,}$/; // Matches numbers > 10000
    if (!numberRegex.test(String(balanceInput))) {
      console.log("Number is not valid");
      setErrorMessage("Xin hãy nhập số lớn hơn 10,000");
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
        console.log("accountId: ", accountId + " balanceInput: ", balanceInput);
        add_balance(accountId, { amount: Number(balanceInput) }).then(
          (response) => {
            if (response.data.status === 200) {
              setIsLoading(false);
              Alert.alert("Thông báo", "Nạp tiền thành công!", [
                {
                  text: "Hoàn thành",
                  onPress: () => {
                    router.back();
                  },
                },
              ]);
            } else {
              setAlertVisible(true);
              setErrorResponse(response);
              setIsLoading(false);
            }
          }
        );
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getAccountIdHandler();
  }, []);

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
          />
          <Text style={styles.subTitle}>{text}</Text>
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
