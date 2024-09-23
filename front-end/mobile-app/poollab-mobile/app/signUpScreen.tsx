import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import BackButton from "@/components/backButton";
import { StatusBar } from "expo-status-bar";
import InputCustom from "@/components/inputCustom";
import Button from "@/components/roundButton";
import { router } from "expo-router";
import Icon from "@/assets/icons/icons";
const SignUpScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {/* Back button import từ backButton.jsx */}
      <BackButton />
      <View style={styles.header}>
        <Text style={styles.headerText}>đăng ký</Text>
        <Text style={styles.headerText}>tài khoản</Text>
        <Text style={styles.headerText2}>PoolLab.</Text>
      </View>
      {/* Form đăng ký */}
      <View style={styles.form}>
        <InputCustom
          placeholder="Họ và Tên"
          icon={
            <Icon name="userIcon" size={25} strokeWidth={1} color="black" />
          }
        />
        <InputCustom
          placeholder="Email"
          icon={
            <Icon name="emailIcon" size={25} strokeWidth={1} color="black" />
          }
        ></InputCustom>
        <InputCustom
          placeholder="Mật khẩu"
          icon={
            <Icon name="passwordIcon" size={25} strokeWidth={1} color="black" />
          }
        ></InputCustom>
      </View>
      {/* Button đăng ký */}
      <View style={styles.button}>
        <Button
          title="Đăng ký"
          buttonStyles={styles.customButton1}
          textStyles={styles.customButtonText1}
          onPress={() => {}}
        />
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Đã có tài khoản PoolLab?</Text>
        <Pressable
          onPress={() => {
            router.push("loginScreen");
          }}
        >
          <Text style={styles.footerTextLink}>Đăng nhập ngay!</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 5,
  },
  header: {
    paddingLeft: 10,
    paddingTop: 15,
  },
  headerText: {
    fontSize: 70,
    fontWeight: "bold",
  },
  headerText2: {
    color: theme.colors.primary,
    fontSize: 60,
    fontWeight: "bold",
  },
  form: {
    paddingTop: 20,
    paddingBottom: 5,
    gap: 20,
    paddingHorizontal: 10,
  },
  button: {
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  customButton1: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 5,
  },
  customButtonText1: {
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    gap: 5,
  },
  footerText: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
  footerTextLink: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
});
