import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { React, useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons/icons";
import { getStoredUser } from "@/api/tokenDecode";
import { get_user_details } from "@/api/user_api";
import { store } from "expo-router/build/global-state/router-store";
const CustomHeader = () => {
  //Get username from AsyncStorage
  const [userName, setUserName] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  useEffect(() => {
    const loadStat = async () => {
      try {
        const storedUser = await getStoredUser();
        if (storedUser) {
          setUserName(storedUser.Username); // Assuming the stored user data has a 'Username' property
          get_user_details(storedUser.AccountId).then((response) => {
            if (response.data.status === 200) {
              const userBalance = response.data.data.balance;
              setUserBalance(userBalance);
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
    <View
      style={{
        paddingTop: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
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
                console.log("add money");
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
    paddingHorizontal: 35,
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
    paddingHorizontal: 15,
    paddingVertical: 5,
    gap: 10,
    borderColor: theme.colors.primary,
    borderCurve: "continuous",
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
});
