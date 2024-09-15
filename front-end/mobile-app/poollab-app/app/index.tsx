import { Link, router } from "expo-router";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 150,
  },
});

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ImageBackground
        source={require("../assets/images/Squares-black-white.png")}
        style={styles.image}
        blurRadius={3}
      >
        <SafeAreaView style={styles.container}>
            <Text
              style={{
                color: "black",
                fontSize: 67,
                fontWeight: "200",
              }}
            >
              Welcome to
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 70,
                fontWeight:"900",
              }}
            >
              PoolLab
            </Text>
            <Link
              href={"/login"}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 65,
                  backgroundColor: "black",
                  fontWeight: "200",
                }}
                onPress={() => router.push("/login")}
              >
                > Sign in
              </Text>
            </Link>
            <Text
              style={{
                color: "black",
                fontSize: 60,
                fontWeight: "200",
              }}
            >
              To get started
            </Text>
        </SafeAreaView>
        <Text
              style={{
                textAlign: "center",
                backgroundColor: "black",
                color: "white",
                fontSize: 23,
                fontWeight: "400",
                marginLeft: 10,
                marginRight: 10,
              }}
              onPress={() => router.push("/register")}
            >
              Doesn't have an account yet? Sign up
            </Text>
      </ImageBackground>
    </View>
  );
}
