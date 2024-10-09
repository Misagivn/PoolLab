import React from "react";
import { router, useRouter } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const qrScanner = () => {
  router.push("../(qrScanner)");
  // return (
  //   <SafeAreaView>
  //     <View>
  //       <Text
  //         onPress={() => {
  //           router.push("../(qrScanner)");
  //         }}
  //       >
  //         Gayyy
  //       </Text>
  //     </View>
  //   </SafeAreaView>
  // );
};

export default qrScanner;
