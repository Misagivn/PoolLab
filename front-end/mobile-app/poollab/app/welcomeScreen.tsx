import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import ScreenWrapper from "../components/screenWrapper";
import Button from "../components/Button";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Welcome Image Here */}
        <Image
          style={styles.welcomeImage}
          source={require("../assets/images/login-background.png")}
          resizeMode="contain"
        />
        {/* Add Application title */}
        <View style={{ gap: 5 }}>
          <Text style={styles.title}>PoolLab</Text>
          <Text style={styles.punchline}>
            Your favorite game, anywhere, anytime.
          </Text>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Getting Started"
            buttonStyles={{ marginHorizontal: wp(3) }}
            onPress={() => router.push("signUp")}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Pressable>
              <Text
                style={[
                  styles.loginText,
                  styles.loginText,
                  { color: theme.colors.primaryDark, fontWeight: 600 },
                ]}
                onPress={() => router.push("login")}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    //backgroundColor: "red",
    height: wp(40),
    width: wp(50),
    alignSelf: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(15),
    textAlign: "center",
    fontWeight: "800", //theme.fonts.bold,
  },
  punchline: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(3),
    paddingHorizontal: wp(10),
  },
  footer: {
    gap: 10,
    width: "115%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(4),
  },
});
