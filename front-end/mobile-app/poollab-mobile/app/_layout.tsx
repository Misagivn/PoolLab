import { Stack } from "expo-router/stack";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="loginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="signUpScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
      <Stack.Screen name="(qrScanner)" options={{ headerShown: false }} />
      <Stack.Screen name="(userProfile)" options={{ headerShown: false }} />
      <Stack.Screen name="(reserveTable)" options={{ headerShown: false }} />
      <Stack.Screen name="(wallet)" options={{ headerShown: false }} />
      <Stack.Screen name="(memberReserve)" options={{ headerShown: false }} />
      <Stack.Screen name="(walletManage)" options={{ headerShown: false }} />
      <Stack.Screen name="(advanceReserve)" options={{ headerShown: false }} />
      <Stack.Screen name="(recurringManage)" options={{ headerShown: false }} />
      <Stack.Screen name="(calendar)" options={{ headerShown: false }} />
      <Stack.Screen name="(courseManage)" options={{ headerShown: false }} />
    </Stack>
  );
}
