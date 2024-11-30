import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { React, useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons/icons";
import {getAccountId, getUserName, getUserBalance} from '@/data/userData'
import { router } from "expo-router";
const CustomHeader = () => {
  //Get username from AsyncStorage
  const [userName, setUserName] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const loadStat = async () => {
    try {
      const userId = await getAccountId();
      const userName = await getUserName();
      if (userId, userName) {
        setUserName(userName);
        getUserBalance(userId).then((userBalance) => {
          if (userBalance) {
            setUserBalance(userBalance);
          }
        });
      }
  } catch (error) {
      console.error("Error loading stored user:", error);
    }
  };
  useEffect(() => {
    loadStat();
  }, []);
  return (
    <View
      style={{
        paddingTop: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        marginHorizontal: 10,
      }}
    >
      <View style={styles.container}>
        <View style={styles.userInfo}>
          <Text style={{ fontSize: 15, fontWeight: "condensedBold" }}>
            {userName}
          </Text>
        </View>
        <View style={styles.quickInfo}>
          <View style={styles.walletCount}>
            <Pressable
              onPress={() => {
                router.push("/(wallet)");
              }}
            >
              <Icon name="addIcon" size={20} strokeWidth={1.5} color="black" />
            </Pressable>
            <TextInput
              style={{
                color: "black",
                fontSize: 15,
                fontWeight: "normal",
                textAlign: "center",
              }}
              editable={false}
              placeholder="0"
              value={Number(JSON.parse(userBalance)).toLocaleString("en-US")}
            />
            <Text>đ</Text>
            <Pressable
            style={{
              marginLeft: 5,
              backgroundColor: theme.colors.primary,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              borderCurve: "continuous",
              padding: 5,
            }}
              onPress={() => {
                loadStat();
              }}
            >
              <Icon name="refreshIcon" size={15} strokeWidth={3} color="white" />
            </Pressable>
          </View>
          <Icon name="notiIcon" size={25} strokeWidth={2} color="black" />
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flex1: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    height: 70,
    width: "100%",
    paddingHorizontal: 15,
    borderCurve: "continuous",
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 6,
  },
  userInfo: {
    paddingRight: 5,
    paddingHorizontal: 3,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
  },
  quickInfo: {
    flexDirection: "row",
    paddingLeft: 25,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  walletCount: {
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 3,
    borderColor: theme.colors.primary,
    borderCurve: "continuous",
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
});
