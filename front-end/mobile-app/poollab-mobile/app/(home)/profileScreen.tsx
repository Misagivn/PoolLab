import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons/icons";
import { router } from "expo-router";
import { get_user_details } from "@/api/user_api";
import CustomHeader from "@/components/customHeader";
import { getAccountId } from "@/data/userData";
const ProfileScreen = () => {
  //Get userId from AsyncStorage
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [image, setImage] = useState(
    require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")
  );
  const [userPoints, setUserPoints] = useState("");
  useEffect(() => {
    const loadStat = async () => {
      try {
        const accountId = await getAccountId();
        if (accountId) {
          get_user_details(accountId).then((response) => {
            if (response.data.status === 200) {
              const userFullName = response.data.data.fullName;
              const userEmail = response.data.data.email;
              const userImage = response.data.data.avatarUrl;
              const point = response.data.data.point;
              setUserFullName(userFullName);
              setUserEmail(userEmail);
              setImage(userImage);
              setUserPoints(point);
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
      <ScrollView>
        <CustomHeader />
        <View style={styles.header}>
          <Image
            style={styles.headerImage}
            source={{ uri: image.toString() }}
          />
          <View style={styles.basicInfo}>
            <Text style={styles.infoName}>{userFullName}</Text>
            {/* <Text style={styles.infoEmail}>{userEmail}</Text> */}
            <View style={styles.pointCount}>
              <TextInput
                style={{
                  color: "black",
                  fontSize: 15,
                  fontWeight: "normal",
                  textAlign: "center",
                }}
                editable={false}
                placeholder="0"
                value={userPoints.toString()}
              />
              <Text>điểm</Text>
            </View>
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
          <Pressable
            style={styles.functionBox}
            onPress={() => router.push("../(walletManage)")}
          >
            <Text style={styles.functionName}>Quản lý giao dịch</Text>
            <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
          </Pressable>
          <Pressable
            style={styles.functionBox}
            onPress={() => router.push("../(reserveTable)")}
          >
            <Text style={styles.functionName}>Quản lý đặt bàn</Text>
            <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
          </Pressable>
          <Pressable
            style={styles.functionBox}
            onPress={() => router.push("../(recurringManage)")}
          >
            <Text style={styles.functionName}>
              Quản lý đặt bàn thường xuyên
            </Text>
            <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
          </Pressable>
          <Pressable
            style={styles.functionBox}
            onPress={() => router.push("../(courseManage)")}
          >
            <Text style={styles.functionName}>Quản lý khóa học</Text>
            <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
          </Pressable>
          <Pressable
            style={styles.functionBox}
            onPress={() => router.push("../(calendar)")}
          >
            <Text style={styles.functionName}>Lịch đặt bàn</Text>
            <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
          </Pressable>
          <Pressable
            style={styles.functionBox}
            onPress={() => router.push("../(calendarCourse)")}
          >
            <Text style={styles.functionName}>Lịch học</Text>
            <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
          </Pressable>
          <Pressable
            style={styles.functionBox}
            onPress={() => router.push("../(voucher)")}
          >
            <Text style={styles.functionName}>Ví Voucher</Text>
            <Icon name="arrowRight" size={20} strokeWidth={3} color="black" />
          </Pressable>
        </View>
        <View style={styles.customDivider}></View>
      </ScrollView>
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
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: 10,
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: theme.colors.primary,
  },
  basicInfo: {
    paddingLeft: 5,
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
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  functionName: {
    fontSize: 20,
  },
  customDivider: {
    padding: 50,
  },
  pointCount: {
    marginTop: 5,
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 3,
    borderCurve: "continuous",
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
});
