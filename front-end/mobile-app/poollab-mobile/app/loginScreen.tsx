import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { theme } from "@/constants/theme";
import BackButton from "@/components/backButton";
import { StatusBar } from "expo-status-bar";
import InputCustom from "@/components/inputCustom";
import Button from "@/components/roundButton";
import { router, useRouter } from "expo-router";
import Icon from "@/assets/icons/icons";
import { useState, useEffect } from "react";
import { user_login } from "@/api/user_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

/**
 * LoginScreen: màn hình đăng nhập
 *
 * - Nhận vào email, mật khẩu
 * - Kiểm tra hợp lệ của email và mật khẩu
 * - Gửi request đăng nhập đến API
 * - Nếu thành công, chuyển đến màn hình home
 * - Nếu thất bại, hiện thông báo lỗi
 */
const LoginScreen = () => {
  const [accEmail, setAccEmail] = useState("");
  const [accPassword, setAccPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailFormat, setEmailFormat] = useState(true);
  const [passwordFormat, setPasswordFormat] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const loginData = {
    email: accEmail,
    password: accPassword,
  };

  /**
   * Validate email format
   *
   * - Kiểm tra email có hợp lệ hay không
   * - Nếu không hợp lệ, hiện thông báo lỗi
   */
  const validateEmail = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(accEmail)) {
      setErrorMessage("Xin hãy nhập địa chỉ email hợp lệ");
      setEmailFormat(false);
    } else {
      setErrorMessage("");
      setEmailFormat(true);
    }
  };

  /**
   * Validate password format
   *
   * - Kiểm tra mật khẩu có hợp lệ hay không
   * - Nếu không hợp lệ, hiện thông báo lỗi
   */
  const validatePassword = () => {
    // Yêu cầu mật khẩu phải tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(accPassword)) {
      setErrorMessage1(
        "Mật khẩu phải tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
      );
      setPasswordFormat(false);
    } else {
      setErrorMessage1("");
      setPasswordFormat(true);
    }
  };

  /**
   * Check login
   *
   * - Kiểm tra email, mật khẩu, và trạng thái của 2 trường trên
   * - Nếu không hợp lệ, hiện thông báo lỗi
   * - Nếu hợp lệ, gửi request đăng nhập đến API
   * - Nếu thành công, chuyển đến màn hình home
   * - Nếu thất bại, hiện thông báo lỗi
   */
  const checkLogin = async () => {
    if (
      accEmail === "" ||
      accPassword === "" ||
      !emailFormat ||
      !passwordFormat
    ) {
      if (!emailFormat) {
        alert(errorMessage);
      } else if (!passwordFormat) {
        alert(errorMessage1);
      } else {
        alert("Please enter the required fields");
      }
    } else {
      setIsLoading(true);
      try {
        user_login(loginData).then((response) => {
          if (response.data.status === 200) {
            const token = response?.data.data;
            const decodedToken = jwtDecode(token);
            // const userName = decodedToken.Username;
            const userId = decodedToken.AccountId;
            AsyncStorage.multiSet([
              ["userToken", JSON.stringify(token)],
              ["userData", JSON.stringify(decodedToken)],
            ]);
            setIsLoading(false);
            router.push("(home)");
          } else {
            alert(response.data.message);
            setIsLoading(false);
          }
        });
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };
  useEffect(() => {
    console.log("Is loading: ", isLoading);
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar hidden={false} style="dark" />
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
          onEndEditing={validateEmail}
          onChangeText={(emailRef) => {
            setAccEmail(emailRef.toLowerCase());
          }}
          //onChangeText={(value) => (emailRef.current = value)}
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <InputCustom
          placeholder="Mật khẩu"
          secureTextEntry={true}
          icon={
            <Icon name="passwordIcon" size={25} strokeWidth={1} color="black" />
          }
          onEndEditing={validatePassword}
          onChangeText={(text) => {
            setAccPassword(text);
          }}
        />
        {errorMessage1 ? (
          <Text style={styles.errorText}>{errorMessage1}</Text>
        ) : null}
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
          loading={isLoading}
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
    paddingTop: 30,
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 5,
  },
  header: {
    paddingLeft: 10,
    paddingTop: 15,
  },
  headerText: {
    fontSize: 50,
    fontWeight: "bold",
  },
  headerText2: {
    color: theme.colors.primary,
    fontSize: 70,
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
  errorText: {
    color: "red",
    fontSize: 14,
  },
});
