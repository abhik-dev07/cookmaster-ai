import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleProp, Text, TextInput, TextStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";
import { appToastConfig } from "../components/AppToast";
import { FONT_FAMILY } from "../constants/fonts";
import { UserContextProvider } from "../context/UserContext";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;

if (!convexUrl) {
  throw new Error(
    "Missing EXPO_PUBLIC_CONVEX_URL. Add it to your .env file and restart Expo.",
  );
}

const convex = new ConvexReactClient(convexUrl);

SplashScreen.preventAutoHideAsync();

let hasAppliedGlobalFont = false;

type TextComponentWithDefaults = {
  defaultProps?: {
    style?: StyleProp<TextStyle>;
  };
};

export default function RootLayout() {
  const [loaded] = useFonts({
    [FONT_FAMILY.regular]: require("../assets/fonts/LufgaRegular.ttf"),
    [FONT_FAMILY.medium]: require("../assets/fonts/LufgaMedium.ttf"),
    [FONT_FAMILY.semibold]: require("../assets/fonts/LufgaSemiBold.ttf"),
    [FONT_FAMILY.bold]: require("../assets/fonts/LufgaBold.ttf"),
  });

  useEffect(() => {
    if (!loaded) {
      return;
    }

    if (!hasAppliedGlobalFont) {
      const TextWithDefaults = Text as unknown as TextComponentWithDefaults;
      const TextInputWithDefaults =
        TextInput as unknown as TextComponentWithDefaults;

      TextWithDefaults.defaultProps ??= {};
      TextWithDefaults.defaultProps.style = [
        { fontFamily: FONT_FAMILY.regular },
        TextWithDefaults.defaultProps.style,
      ];

      TextInputWithDefaults.defaultProps ??= {};
      TextInputWithDefaults.defaultProps.style = [
        { fontFamily: FONT_FAMILY.regular },
        TextInputWithDefaults.defaultProps.style,
      ];

      hasAppliedGlobalFont = true;
    }

    SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ConvexProvider client={convex}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <UserContextProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <Slot />
            </KeyboardProvider>
            <Toast config={appToastConfig} />
          </GestureHandlerRootView>
        </UserContextProvider>
      </ClerkProvider>
    </ConvexProvider>
  );
}
