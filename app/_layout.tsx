import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";
import * as Sentry from "@sentry/react-native";
import "./globals.css";

Sentry.init({
  dsn: "https://1ada22a36567ce88676ae46e6ba33adf@o4509866563010560.ingest.de.sentry.io/4510025278947408",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-ExtraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
    "Outfit-Black": require("../assets/fonts/Outfit-Black.ttf"),
    "Outfit-ExtraLight": require("../assets/fonts/Outfit-ExtraLight.ttf"),
    "Outfit-Thin": require("../assets/fonts/Outfit-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    async function fetchUser() {
      await fetchAuthenticatedUser();
    }
    fetchUser();
  }, [fetchAuthenticatedUser]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
});
