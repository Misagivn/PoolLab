import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../constants/theme";
import Button from "@/components/roundButton";
import IconButton from "@/components/iconButton";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();
  return (
    <ImageBackground
      blurRadius={13}
      style={styles.image}
      source={require("../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")}
    >
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View>
          {/* Welcome title */}
          <Text style={styles.title}>Xin chào,</Text>
          <Text style={styles.punchline}>Chào mừng bạn đến với PoolLab.</Text>
          {/* Các button */}
          <View style={styles.buttonView}>
            <Button
              title="Đăng nhập"
              buttonStyles={styles.customButton1}
              textStyles={styles.customButtonText1}
              onPress={() => {
                router.replace("loginScreen");
                //router.push("./(home)");
              }}
            />
            <IconButton
              iconName="ggIcon"
              title="Đăng nhập với Google "
              buttonStyles={styles.customButton3}
              textStyles={styles.customButtonText3}
              onPress={() => {}}
            />
          </View>
          {/* Footer ở đây */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Vẫn chưa có tài khoản PoolLab?
            </Text>
            <Pressable
              onPress={() => {
                router.push("signUpScreen");
              }}
            >
              <Text style={styles.signUpText}>Đăng ký ngay!</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    color: theme.colors.primary,
    fontSize: 65,
    fontWeight: "bold",
  },
  punchline: {
    color: "white",
    fontSize: 23,
    fontWeight: "semibold",
  },
  buttonView: {
    gap: 13,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  customButton1: {
    backgroundColor: theme.colors.primary,
    height: 60,
    borderRadius: 10,
    width: 350,
  },
  customButtonText1: {
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
  },
  customButton2: {
    backgroundColor: theme.colors.darkSecondary,
    height: 60,
    borderRadius: 10,
    width: 350,
  },
  customButtonText2: {
    fontSize: 23,
    color: "white",
  },
  customButton3: {
    backgroundColor: theme.colors.hightLight,
    height: 60,
    borderRadius: 10,
    width: 350,
  },
  customButtonText3: {
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    gap: 5,
    flexDirection: "column",
  },
  footerText: {
    color: "white",
    fontSize: 15,
  },
  signUpText: {
    color: theme.colors.secondary,
    fontSize: 17,
    fontWeight: "bold",
  },
});
