import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import BackButton from "@/components/backButton";
import { StatusBar } from "expo-status-bar";
import InputCustom from "@/components/inputCustom";
import Button from "@/components/roundButton";
import { router, useRouter } from "expo-router";
import Icon from "@/assets/icons/icons";
import { useState, useEffect } from "react";
import axios from "axios";
const LoginScreen = () => {
  const [accEmail, setAccEmail] = useState("");
  const [accPassword, setAccPassword] = useState([]);
  const [loggedIn, setLoggedIn] = useState([]);
  const loginData = {
    email: accEmail,
    password: accPassword,
  };

  const checkLogin = async (event) => {
    if (!accEmail || !accPassword) {
      alert("Email và mật khẩu không được để trống");
      return;
    }

    try {
      const response = await axios.post(
        "https://poollabwebapi20241008201316.azurewebsites.net/api/Auth/Login",
        loginData
      );

      if (response.status === 200) {
        console.log(response.data), console.log("Login success");
        router.push("/(home)");
      } else {
        throw (new Error("Login failed"), console.log(response.data));
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setAccEmail("");
      setAccPassword("");
      alert("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {/* Back button import từ backButton.jsx */}
      <BackButton />
      <View style={styles.header}>
        <Text style={styles.headerText}>đăng nhập</Text>
        <Text style={styles.headerText2}>PoolLab.</Text>
      </View>
      {/* Form đăng nhập */}
      <View style={styles.form}>
        <InputCustom
          placeholder="Email"
          icon={
            <Icon name="emailIcon" size={25} strokeWidth={1} color="black" />
          }
          onChangeText={(text) => {
            setAccEmail(text);
          }}
        />
        <InputCustom
          placeholder="Mật khẩu"
          secureTextEntry={true}
          icon={
            <Icon name="passwordIcon" size={25} strokeWidth={1} color="black" />
          }
          onChangeText={(text) => {
            setAccPassword(text);
          }}
        />
      </View>
      {/* Link quên mật khẩu */}
      <View
        style={{
          alignItems: "flex-end",
          paddingHorizontal: 10,
        }}
      >
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: 15,
              fontWeight: "semibold",
            }}
          >
            Quên mật khẩu?
          </Text>
        </Pressable>
      </View>
      {/* Button đăng nhập */}
      <View style={styles.button}>
        <Button
          title="Đăng nhập"
          buttonStyles={styles.customButton1}
          textStyles={styles.customButtonText1}
          onPress={() => {
            checkLogin();
          }}
        />
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Chưa có tài khoản PoolLab?</Text>
        <Pressable
          onPress={() => {
            router.push("signUpScreen");
          }}
        >
          <Text style={styles.footerTextLink}>Đăng ký ngay!</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;

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
    paddingTop: 30,
  },
  customButton1: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 5,
  },
  customButtonText1: {
    color: "white",
    fontSize: 25,
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
