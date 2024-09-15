import { Stack } from "expo-router";
import { TamaguiProvider, YStack, createTamagui } from "tamagui";
//import { config } from "@tamagui/config/v3";

//const tamaguiConfig = createTamagui(config);

// type Conf = typeof tamaguiConfig;
// declare module "@tamagui/core" {
//   interface TamaguiCustomConfig extends Conf {}
// }
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Initial", headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{ title: "Sign in", presentation: "modal" }}
      />
      <Stack.Screen
        name="register"
        options={{ title: "Sign up", presentation: "modal" }}
      />
    </Stack>
  );
}
