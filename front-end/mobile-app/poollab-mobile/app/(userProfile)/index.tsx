import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import Button from "@/components/roundButton";
import { theme } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/backButton";
import InputCustom from "@/components/inputCustom";
import Icon from "@/assets/icons/icons";
import { getStoredToken } from "@/api/tokenDecode";
import {
  get_user_details,
  update_user,
  update_user_avatar,
} from "@/api/user_api";
import CustomAlert from "@/components/alertCustom";
import { getAccountId } from "@/data/userData";
import * as ImagePicker from "expo-image-picker";
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
    if (!emailRegex.test(userEmail)) {
      setErrorMessage("Xin hãy nhập địa chỉ email hợp lệ");
      setEmailFormat(false);
    } else {
      setErrorMessage("");
      setEmailFormat(true);
    }
  };
  const alertPopup = (
    title: string | undefined,
    message: string | undefined,
    confirmText: string | undefined,
    cancelText: string | undefined
  ) => {
    return (
      <CustomAlert
        visible={alertVisible}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          setAlertVisible(false);
          setErrorResponse("");
          if (successResponse) {
            router.push("/(home)/profileScreen");
            setSuccessResponse("");
          }
        }}
        onCancel={() => {}}
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
              const userAvatar = response.data.data.avatarUrl;
              setUserId(userId);
              setUserFullName(userFullName);
              setUserEmail(userEmail);
              setUserName(userName);
              setUserNumber(userNumber);
              setImageSource(userAvatar);
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
  const requestPermissions = async () => {
    if (Platform.OS !== "android") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
        return false;
      }
      return true;
    }
    return true;
  };
  // Utility function to convert blob to base64 if needed
  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        setImageSource(selectedImage);
        const imageToUpload = {
          uri: selectedImage.uri,
          base64: selectedImage.base64,
          type: "image/jpeg",
          name: "avatar.jpg",
        };
        // Convert image to binary
        try {
          update_user_avatar(imageToUpload).then((response) => {
            if (response.status === 200) {
              setImageSource(response.data);
            } else {
              Alert.alert("Error", "Image upload failed", response.data);
            }
          });
        } catch (error) {
          console.error("Error uploading image:", error);
        }
        return selectedImage;
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };
  const updateData = {
    fullName: userFullName.trim(),
    userName: userName.trim(),
    email: userEmail,
    phoneNumber: userNumber,
    avatarUrl: imageSource,
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
      } else {
        setErrorMessage("Xin hãy nhập tất cả các trường");
      }
    } else {
      setIsLoading(true);
      try {
        update_user(updateData, userId, userToken).then((response) => {
          if (response.status === 200) {
            setAlertVisible(true);
            setSuccessResponse("Cập nhật thành công");
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
    if (!errorMessage && !errorResponse && !successResponse) {
      return alertPopup("Lỗi", "Vui lòng nhập tất cả các trường", "OK", "Hủy");
    } else if (errorMessage && !errorResponse && !successResponse) {
      return alertPopup("Lỗi", errorMessage, "OK", "Hủy");
    } else if (errorResponse && !successResponse) {
      return alertPopup("Lỗi", errorResponse, "OK", "Hủy");
    } else if (successResponse) {
      return alertPopup("Thông báo", successResponse, "OK", "Hủy");
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
          <Pressable onPress={pickImage}>
            <View style={styles.imageBox}>
              <Image
                style={styles.image}
                source={
                  imageSource
                    ? { uri: imageSource.toString() }
                    : require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")
                }
              />
              <View style={styles.cameraIconOverlay}>
                <Icon size={24} name="cameraIcon" />
              </View>
            </View>
          </Pressable>
          <View style={styles.detailsRow}>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
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
                setUserEmail(text.trim());
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
              title="CẬP NHẬT"
              buttonStyles={styles.updateButton}
              textStyles={styles.updateButtonText}
              onPress={() => {
                updateUser();
              }}
              loading={isLoading}
              disabled={
                (userFullName === "" ||
                  userName === "" ||
                  userEmail === "" ||
                  userNumber === null) &&
                errorMessage !== ""
              }
            />
            <View style={styles.footer}>
              <Text style={styles.footerText}>Cần thay đổi mật khẩu?</Text>
              <Pressable
                onPress={() => {
                  console.log("click change password");
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
