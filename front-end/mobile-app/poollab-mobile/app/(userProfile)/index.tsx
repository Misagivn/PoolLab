import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import Button from "@/components/roundButton";
import { theme } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/backButton";
import InputCustom from "@/components/inputCustom";
import Icon from "@/assets/icons/icons";
import { getStoredUser, getStoredToken } from "@/api/tokenDecode";
import { get_user_details, update_user } from "@/api/user_api";
import CustomAlert from "@/components/alertCustom";
import { getAccountId } from "@/data/userData";
import FacebookIcon from "@/assets/icons/fbIcon";
const index = () => {
  //Get userId from AsyncStorage
  const [userId, setUserId] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userNumber, setUserNumber] = useState(0);
  const [userToken, setUserToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailFormat, setEmailFormat] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");
  const [imageSource, setImageSource] = useState(
    require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")
  );
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
  useEffect(() => {
    setIsLoading(true);
    const loadStat = async () => {
      try {
        const accountId = await getAccountId();
        const storedToken = await getStoredToken();
        if (accountId && storedToken) {
          const token = storedToken;
          setUserToken(token);
          get_user_details(accountId).then((response) => {
            if (response.data.status === 200) {
              const userId = response.data.data.id;
              const userFullName = response.data.data.fullName;
              const userName = response.data.data.userName;
              const userEmail = response.data.data.email;
              const userNumber = response.data.data.phoneNumber;
              setUserId(userId);
              setUserFullName(userFullName);
              setUserEmail(userEmail);
              setUserName(userName);
              setUserNumber(userNumber);
            }
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
      }
    };
    loadStat();
  }, []);
  const updateData = {
    fullName: userFullName,
    userName: userName,
    email: userEmail,
    phoneNumber: userNumber,
  };
  const updateUser = async () => {
    if (
      userFullName === "" ||
      userName === "" ||
      userEmail === "" ||
      userNumber === null
    ) {
      if (!emailFormat) {
        setAlertVisible(true);
        // alertPopup("Lỗi", errorMessage, "OK", "Hủy");
      } else {
        alert("Xin hãy nhập tất cả các trường");
      }
    } else {
      setIsLoading(true);
      try {
        update_user(updateData, userId, userToken).then((response) => {
          if (response.status === 200) {
            setAlertVisible(true);
            setSuccessResponse("Cập nhật thành công");
            //alert("Cập nhật thành công");
            //router.push("/(home)/profileScreen");
            setIsLoading(false);
          } else {
            console.log("error message:", response.data.message);
            setAlertVisible(true);
            setErrorResponse(response.data.message);
            //alert(response.data.message);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };
  if (alertVisible) {
    if (!errorMessage && !errorResponse && !successResponse) {
      return alertPopup("Lỗi", "Vui lòng nhập tất cả các trường", "OK", "Hủy");
    } else if (errorMessage && !errorResponse && !successResponse) {
      return alertPopup("Lỗi", errorMessage, "OK", "Hủy");
    } else if (errorResponse && !successResponse) {
      return alertPopup("Lỗi", errorResponse, "OK", "Hủy");
    } else if (successResponse) {
      return alertPopup("Lỗi", successResponse, "OK", "Hủy");
    }
  }
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <BackButton />
        <View style={styles.detailsBox}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Cập nhật thông tin</Text>
            <Text style={styles.title2}>tài khoản.</Text>
          </View>
          <Pressable>
            <View style={styles.imageBox}>
              <Image style={styles.image} source={imageSource} />
              <View style={styles.cameraIconOverlay}>
                <Icon size={24} name="cameraIcon" />
              </View>
            </View>
          </Pressable>
          <View style={styles.detailsRow}>
            <InputCustom
              placeholder="Email"
              icon={
                <Icon
                  name="emailIcon"
                  size={25}
                  strokeWidth={1}
                  color="black"
                />
              }
              value={userEmail}
              onEndEditing={validateEmail}
              onChangeText={(text) => {
                setUserEmail(text);
              }}
            />
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
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
              placeholder="Họ và Tên"
              icon={
                <Icon name="infoIcon" size={25} strokeWidth={1} color="black" />
              }
              value={userFullName}
              onChangeText={(text) => {
                setUserFullName(text);
              }}
            />
            <InputCustom
              placeholder="Số điện thoại"
              icon={
                <Icon
                  name="phoneIcon"
                  size={25}
                  strokeWidth={1}
                  color="black"
                />
              }
              value={userNumber}
              onChangeText={(text) => {
                setUserNumber(text);
              }}
            />
            <Button
              title="Cập nhật"
              buttonStyles={styles.updateButton}
              textStyles={styles.updateButtonText}
              onPress={() => {
                updateUser();
              }}
              loading={isLoading}
            />
            <View style={styles.footer}>
              <Text style={styles.footerText}>Cần thay đổi mật khẩu?</Text>
              <Pressable
                onPress={() => {
                  router.push("signUpScreen");
                }}
              >
                <Text style={styles.footerTextLink}>Nhấn vào đây!</Text>
              </Pressable>
            </View>
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
  detailsBox: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    marginHorizontal: 5,
    marginTop: 30,
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
  titleBox: {
    justifyContent: "flex-start",
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
  imageBox: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    position: "relative",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: theme.colors.primary,
  },
  cameraIconOverlay: {
    position: "absolute",
    right: 100,
    bottom: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsRow: {
    marginTop: 10,
    gap: 15,
    paddingVertical: 10,
  },
  updateButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
  },
  updateButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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