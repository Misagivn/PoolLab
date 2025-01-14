import {  StyleSheet,  View } from "react-native";
import React from "react";
import Icon from "@/assets/icons/icons";
import { router } from "expo-router";
const NotiIconWithBadge = ({ hasUnread = false }, ...props) => {
  return (
    <View style={styles.container}>
        <Icon name="notiIcon" size={20} strokeWidth={1.5} color="black" />
        {hasUnread && <View style={styles.badge}></View>}
    </View>
  );
};

export default NotiIconWithBadge;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },
});
