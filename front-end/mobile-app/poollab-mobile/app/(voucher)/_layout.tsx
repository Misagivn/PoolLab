import { Stack } from "expo-router";
export default function innerScreenLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="redeemVoucher" options={{ headerShown: false }} />
    </Stack>
  );
}
