import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { theme } from "@/constants/theme";
import BackButton from "@/components/backButton";
import { StatusBar } from "expo-status-bar";
import InputCustom from "@/components/inputCustom";
import Button from "@/components/roundButton";
import { router } from "expo-router";
import Icon from "@/assets/icons/icons";
import { register_user } from "@/api/user_api";
import CustomAlert from "@/components/alertCustom";

/**
 * SignUpScreen: màn hình đăng ký
 *
 * - Nhận vào email, password, tên người dùng và họ tên
 * - Kiểm tra hợp lệ của email và password
 * - Gửi request đăng ký đến API
 * - Nếu thành công, chuyển đến màn hình đăng nhập
 * - Nếu thất bại, hiện thông báo lỗi
 */
const SignUpScreen = () => {
  const [userName, setUserName] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const [emailFormat, setEmailFormat] = useState(true);
  const [passwordFormat, setPasswordFormat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  /**
   * Validate email format
   *
   * - Kiểm tra email có hợp lệ hay không
   * - Nếu không hợp lệ, hiện thông báo lỗi
   */
  const validateEmail = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
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
   * - Kiểm tra password có hợp lệ hay không
   * - Nếu không hợp lệ, hiện thông báo lỗi
   */
  const validatePassword = () => {
    // Yêu cầu mật khẩu phải tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage1(
        "Mật khẩu phải tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
      );
      setPasswordFormat(false);
    } else {
      setErrorMessage1("");
      setPasswordFormat(true);
    }
  };

  const signupData = {
    email: email,
    password: password,
    userName: userName,
    fullName: userFullName,
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
        }}
        onCancel={() => {
          setAlertVisible(false);
        }}
      />
    );
  };

  /**
   * Check sign up
   *
   * - Kiểm tra email, password, tên người dùng và họ tên có hợp lệ hay không
   * - Nếu không hợp lệ, hiện thông báo lỗi
   * - Nếu hợp lệ, gửi request đăng ký đến API
   * - Nếu thành công, chuyển đến màn hình đăng nhập
   * - Nếu thất bại, hiện thông báo lỗi
   */
  const checkSignUp = async () => {
    if (
      email === "" ||
      password === "" ||
      userName === "" ||
      userFullName === "" ||
      !emailFormat ||
      !passwordFormat
    ) {
      if (!emailFormat) {
        setAlertVisible(true);
      } else if (!passwordFormat) {
        setAlertVisible(true);
      } else {
        setAlertVisible(true);
      }
    } else {
      setIsLoading(true);
      try {
        register_user(signupData).then((response) => {
          if (response?.data.status === 200) {
            setAlertVisible(true);
            setSuccessResponse("Đăng ký thành công, xin hãy đăng nhập.");
            //alert("Đăng ký thành công, xin hãy đăng nhập.");
            router.push("loginScreen");
            setIsLoading(false);
          } else {
            setAlertVisible(true);
            setErrorResponse(response.data.message);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };
  if (alertVisible) {
    if (!errorMessage && !errorMessage1 && !errorResponse && !successResponse) {
      return alertPopup("Lỗi", "Vui lòng nhập tất cả các trường", "OK", "Hủy");
    } else if (!errorMessage && !errorResponse && !successResponse) {
      return alertPopup("Lỗi", errorMessage1, "OK", "Hủy");
    } else if (!errorMessage1 && !errorResponse && !successResponse) {
      return alertPopup("Lỗi", errorMessage, "OK", "Hủy");
    } else if (
      errorMessage &&
      errorMessage1 &&
      !errorResponse &&
      !successResponse
    ) {
      return alertPopup("Lỗi", "Vui lòng nhập tất cả đúng format", "OK", "Hủy");
    } else if (errorResponse && !successResponse) {
      return alertPopup("Lỗi", errorResponse, "OK", "Hủy");
    } else if (successResponse) {
      return alertPopup("Lỗi", successResponse, "OK", "Hủy");
    }
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden={false} style="dark" />
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
          value={userFullName}
          onChangeText={(text) => {
            setUserFullName(text);
          }}
        />
        <InputCustom
          placeholder="Tên người dùng"
          icon={
            <Icon name="userIcon" size={25} strokeWidth={1} color="black" />
          }
          value={userName}
          onChangeText={(text) => {
            setUserName(text);
          }}
        />
        <InputCustom
          value={email}
          placeholder="Email"
          icon={
            <Icon name="emailIcon" size={25} strokeWidth={1} color="black" />
          }
          value={email}
          onChangeText={(text) => {
            setEmail(text.toLowerCase());
          }}
          onEndEditing={validateEmail}
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <InputCustom
          placeholder="Mật khẩu"
          secureTextEntry={showPassword}
          icon={
            <Icon name="passwordIcon" size={25} strokeWidth={1} color="black" />
          }
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          onEndEditing={validatePassword}
          iconRight={
            <Icon
              name="showPasswordIcon"
              size={25}
              strokeWidth={1}
              color="black"
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            />
          }
        />
        {errorMessage1 ? (
          <Text style={styles.errorText}>{errorMessage1}</Text>
        ) : null}
      </View>
      {/* Button đăng ký */}
      <View style={styles.button}>
        <Button
          title="Đăng ký"
          buttonStyles={styles.customButton1}
          textStyles={styles.customButtonText1}
          onPress={() => checkSignUp()}
          loading={isLoading}
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
    marginTop: 30,
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
  passwordText: {
    color: "black",
    fontSize: 14,
    alignSelf: "flex-end",
    textAlign: "right",
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
    fontSize: 23,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
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
