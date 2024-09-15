import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import { Link } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const Page = () => {
  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" />
      <Link href="/register">Register</Link>
    </View>
  );
};

export default Page;
