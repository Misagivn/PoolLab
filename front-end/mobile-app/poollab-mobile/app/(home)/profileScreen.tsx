import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons/icons";
import { router } from "expo-router";
import { get_user_details } from "@/api/user_api";
import { getStoredUser } from "@/api/tokenDecode";
import CustomHeader from "@/components/customHeader";
const ProfileScreen = () => {
  //Get userId from AsyncStorage
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    const loadStat = async () => {
      try {
        const storedUser = await getStoredUser();
        if (storedUser) {
          get_user_details(storedUser.AccountId).then((response) => {
            if (response.data.status === 200) {
              const userFullName = response.data.data.fullName;
              const userEmail = response.data.data.email;
              setUserFullName(userFullName);
              setUserEmail(userEmail);
            }
          });
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
      }
    };
    loadStat();
  }, []);
  return (
    <SafeAreaView>
      <CustomHeader />
      <View style={styles.header}>
        <Image
          style={styles.headerImage}
          source={require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")}
        />
        <View style={styles.basicInfo}>
          <Text style={styles.infoName}>{userFullName}</Text>
          <Text style={styles.infoEmail}>{userEmail}</Text>
        </View>
      </View>
      <View style={styles.quickFunction}>
        <Pressable
          style={styles.functionBox}
          onPress={() => router.push("../(userProfile)")}
        >
          <Text style={styles.functionName}>Quản lý tài khoản</Text>
          <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
        </Pressable>
        <View style={styles.functionBox}>
          <Text style={styles.functionName}>Quản lý ví tiền</Text>
          <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
        </View>
        <View style={styles.functionBox}>
          <Text style={styles.functionName}>Quản lý khóa học</Text>
          <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
        </View>
        <View style={styles.functionBox}>
          <Text style={styles.functionName}>Ví voucher</Text>
          <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  header: {
    gap: 2,
    flexDirection: "row",
    backgroundColor: theme.colors.background,
    justifyContent: "flex-start",
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
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
  headerImage: {
    marginLeft: 10,
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: theme.colors.primary,
  },
  basicInfo: {
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 0,
  },
  infoName: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  infoEmail: {
    fontSize: 15,
  },
  quickFunction: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 5,
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
  functionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 0.7,
    borderBottomColor: "gray",
  },
  functionName: {
    fontSize: 20,
  },
});
