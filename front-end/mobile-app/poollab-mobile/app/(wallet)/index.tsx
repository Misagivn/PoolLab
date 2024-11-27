import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputCustom from "@/components/inputCustom";
import { theme } from "@/constants/theme";
import BackButton from "@/components/backButton";
import Icon from "@/assets/icons/icons";
import Button from "@/components/roundButton";

const index = () => {
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
            />
          </View>
          <Button
            title="Nạp tiền"
            buttonStyles={styles.customButton1}
            textStyles={styles.customButtonText1}
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
