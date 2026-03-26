import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleProp, Text, TextInput, TextStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { FONT_FAMILY } from "../constants/fonts";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
