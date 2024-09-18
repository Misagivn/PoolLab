import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/screenWrapper";
import BackButton from "@/components/BackButton";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { wp, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Input from "@/components/Input";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
const SignUp = () => {
  const router = useRouter();
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign up", "Please fill all the fields");
      return;
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Backbutton here */}
        <BackButton router={router} />
        {/* Welcome Text */}
        <View>
          <Text style={styles.welcomeText}>Let,</Text>
          <Text style={styles.welcomeText}>Get started</Text>
        </View>
        {/* Login form */}
        <View style={styles.form}>
          <Text>Please fill the details for create an account</Text>
          <Input
            icon={<Icon name="profile" size={24} strokeWidth={2.3} />}
            placeholder="Enter your name"
            onChangeText={(value) => nameRef.current.value}
          />
          <Input
            icon={<Icon name="email" size={24} strokeWidth={2.3} />}
            placeholder="Enter your email"
            onChangeText={(value) => emailRef.current.value}
          />
          <Input
            icon={<Icon name="password" size={24} strokeWidth={2.3} />}
            placeholder="Enter your Password"
            secureTextEntry
            onChangeText={(value) => passwordRef.current.value}
          />
          <Button title="Sign up" loading={loading} onPress={onSubmit} />
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push("login")}>
            <Text
              style={
                (styles.footerText,
                { color: theme.colors.primaryDark, fontWeight: "800" })
              }
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    paddingHorizontal: wp(1.5),
  },
  welcomeText: {
    fontSize: 50,
    fontWeight: "700",
    color: theme.colors.text,
  },
  form: { gap: 30 },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "600",
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(3.8),
  },
});
