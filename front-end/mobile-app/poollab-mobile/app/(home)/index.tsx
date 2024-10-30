import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { theme } from "@/constants/theme";
import InputCustom from "@/components/inputCustom";
import Icon from "@/assets/icons/icons";

const index = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <StatusBar hidden={false} style="dark" />
        <View style={styles.container}>
          <CustomHeader />
          <View style={styles.searchBox}>
            <Text style={styles.postTitle}>Bai dang o day</Text>
            <Text style={styles.postContent}>demodmeodmeodmoed</Text>
            <View style={styles.ImageView}>
              <Image
                style={styles.Image}
                source={require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")}
              />
            </View>
          </View>
          <View style={styles.searchBox}>
            <Text style={styles.postTitle}>Bai dang o day</Text>
            <Text style={styles.postContent}>demodmeodmeodmoed</Text>
            <View style={styles.ImageView}>
              <Image
                style={styles.Image}
                source={require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")}
              />
            </View>
          </View>
          <View style={styles.searchBox}>
            <Text style={styles.postTitle}>Bai dang o day</Text>
            <Text style={styles.postContent}>demodmeodmeodmoed</Text>
            <View style={styles.ImageView}>
              <Image
                style={styles.Image}
                source={require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {},
  searchBox: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 10,
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
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  postContent: {
    fontSize: 12,
  },
  ImageView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Image: {
    width: 325,
    alignSelf: "center",
  },
});
