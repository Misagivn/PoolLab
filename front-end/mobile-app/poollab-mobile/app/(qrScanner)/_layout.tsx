import { Stack } from "expo-router";
export default function qrScannerLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tableFunction)" options={{ headerShown: false }} />
    </Stack>
  );
}
