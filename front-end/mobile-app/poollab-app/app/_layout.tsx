import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Initial", headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{ title: "Login", presentation: "modal" }}
      />
      <Stack.Screen
        name="register"
        options={{ title: "Register", presentation: "modal" }}
      />
    </Stack>
  );
}
