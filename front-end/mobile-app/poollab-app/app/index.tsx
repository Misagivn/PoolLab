import { Link, router } from "expo-router";
import { StyleSheet, View, Button, ImageBackground, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "stretch",
  },
});

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
      <ImageBackground
        source={require("../assets/images/init-back.png")}
        style={styles.image}
      >
        <SafeAreaView style={{ flex: 1, alignContent: "center" }}>
          <Text
            style={{
              color: "black",
              fontSize: 65,
              textAlign: "justify",
              marginLeft: 10,
              marginTop: 150,
              marginVertical: 0,
              paddingVertical: 0,
              fontWeight: "bold",
            }}
          >
            Welcome to
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: 55,
              marginLeft: 10,
              marginVertical: 0,
              paddingVertical: 0,
              fontWeight: "bold",
            }}
          >
            PoolLab
          </Text>
          <Link
            href={"/login"}
            style={{
              marginLeft: 10,
              marginVertical: 0,
              paddingVertical: 0,
              fontWeight: "bold",
            }}
          >
            <Text
              style={{ color: "white", fontSize: 50, backgroundColor: "black" }}
            >
              Sign in here __
            </Text>
          </Link>
          <Text
            style={{
              color: "black",
              fontSize: 57,
              marginLeft: 10,
              marginVertical: 0,
              paddingVertical: 0,
              fontWeight: "bold",
            }}
          >
            To get started
          </Text>
          <Link
            href={"/login"}
            style={{
              marginLeft: 10,
              marginVertical: 50,
              paddingVertical: 0,
              fontWeight: "bold",
            }}
          >
            <Text
              style={{ color: "white", fontSize: 15, backgroundColor: "black" }}
            >
              Doesn't have an account yet? Register here __
            </Text>
          </Link>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
