import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/screenWrapper";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";
const Home = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>PoolLab</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("./qrScanner/qrHome")}>
              <Icon
                name="qr"
                size={hp(5)}
                strokeWidth={2.3}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("./userProfile/profile")}>
              <Icon
                name="profile"
                size={hp(5)}
                strokeWidth={2.3}
                color={theme.colors.text}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: wp(2),
  },
  title: {
    color: theme.colors.primary,
    fontSize: hp(8),
    fontWeight: "700",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
});
