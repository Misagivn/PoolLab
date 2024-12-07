import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { theme } from "@/constants/theme";
import { get_all_event } from "@/api/event_api";
const index = () => {
  const [event, setEvent] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get_all_event();
        if (response?.data.status === 200) {
          setEvent(response.data.data.items);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    fetchData();
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <StatusBar hidden={false} style="dark" />
        <View style={styles.container}>
          <CustomHeader />
          {event.length === 0 ? (
            <Text style={styles.postTitle}>Không có bài đăng nào</Text>
          ) : (
            event.map((item) => (
              <View key={item.id} style={styles.searchBox}>
                <View style={styles.postPersonBox}>
                  <Text style={styles.postPerson}>{item.username}</Text>
                  <Text style={styles.postDate}>
                    Ngày đăng: {item.createdDate.split("T")[0]}
                  </Text>
                </View>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postContent}>{item.descript}</Text>
                <View style={styles.ImageView}>
                  <Image
                    style={styles.Image}
                    source={
                      item.thumbnail
                        ? { uri: item.thumbnail }
                        : require("../../assets/images/eda492de2906a8827a6266e32bcd3ffb.webp")
                    }
                  />
                </View>
              </View>
            ))
          )}
          <View style={styles.customDivider}></View>
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
  postPersonBox: {
    alignItems: "flex-end",
  },
  postPerson: {
    fontSize: 15,
    fontWeight: "normal",
  },
  postDate: {
    fontSize: 8,
    fontWeight: "thin",
    color: "gray",
  },
  postTitle: {
    fontSize: 25,
    fontWeight: "medium",
  },
  postContent: {
    fontSize: 12,
    marginBottom: 10,
  },
  ImageView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Image: {
    width: 325,
    height: 325,
    borderRadius: 20,
    alignSelf: "center",
  },
  customDivider: {
    padding: 50,
  },
});
