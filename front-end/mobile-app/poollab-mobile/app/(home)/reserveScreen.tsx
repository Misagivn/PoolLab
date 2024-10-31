import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomHeader from "@/components/customHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import InputCustom from "@/components/inputCustom";
import Icon from "@/assets/icons/icons";
import IconButton from "@/components/iconButton";
const ReserveScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <CustomHeader />
        <View style={styles.searchBox}>
          <View style={styles.searchRow}>
            <InputCustom
              placeholder="Address"
              icon={
                <Icon
                  name="emailIcon"
                  size={10}
                  strokeWidth={1}
                  color="black"
                />
              }
            />
            <InputCustom
              placeholder="AAAAAA"
              icon={
                <Icon
                  name="emailIcon"
                  size={10}
                  strokeWidth={1}
                  color="black"
                />
              }
            />
            <InputCustom
              placeholder="AAAAAA"
              icon={
                <Icon
                  name="emailIcon"
                  size={10}
                  strokeWidth={1}
                  color="black"
                />
              }
            />
            <InputCustom
              placeholder="AAAAAA"
              icon={
                <Icon
                  name="emailIcon"
                  size={10}
                  strokeWidth={1}
                  color="black"
                />
              }
            />
            <IconButton
              title="Tim kiem"
              iconName="addIcon"
              buttonStyles={styles.searchButton}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReserveScreen;

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
  searchRow: {
    gap: 10,
    paddingVertical: 10,
  },
  searchButton: {
    backgroundColor: theme.colors.secondary,
  },
});
