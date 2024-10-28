import { Stack } from "expo-router";
export default function innerScreenLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}
