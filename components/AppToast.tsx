import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { ToastConfig } from "react-native-toast-message";

import { FONT_FAMILY } from "../constants/fonts";

type ToastVariant = "success" | "error" | "pending";

type IconName = "checkmark-circle" | "alert-circle" | "time";

const variantStyles: Record<
  ToastVariant,
  {
    iconColor: string;
    titleColor: string;
    bodyColor: string;
    icon: IconName;
  }
> = {
  success: {
    iconColor: "#38D39D",
    titleColor: "#1E3D33",
    bodyColor: "#3B5C51",
    icon: "checkmark-circle",
  },
  error: {
    iconColor: "#FF7777",
    titleColor: "#5C232A",
    bodyColor: "#7A3D45",
    icon: "alert-circle",
  },
  pending: {
    iconColor: "#B8A7FF",
    titleColor: "#33247A",
    bodyColor: "#4F4691",
    icon: "time",
  },
};

const supportsNativeBlur =
  Platform.OS !== "android" || Number(Platform.Version) >= 31;

const renderToast = (
  variant: ToastVariant,
  text1?: string,
  text2?: string,
): ReactNode => {
  const current = variantStyles[variant];

  return (
    <View style={styles.wrapper}>
      {supportsNativeBlur ? (
        <BlurView
          intensity={90}
          tint="extraLight"
          experimentalBlurMethod="dimezisBlurView"
          style={styles.blurLayer}
        />
      ) : null}
      <View
        style={[
          styles.tintLayer,
          supportsNativeBlur
            ? styles.tintLayerWithBlur
            : styles.tintLayerFallback,
        ]}
      />
      <Ionicons name={current.icon} size={22} color={current.iconColor} />
      <View style={styles.content}>
        {!!text1 && (
          <Text style={[styles.title, { color: current.titleColor }]}>
            {text1}
          </Text>
        )}
        {!!text2 && (
          <Text style={[styles.message, { color: current.bodyColor }]}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  );
};

export const appToastConfig: ToastConfig = {
  success: ({ text1, text2 }) => renderToast("success", text1, text2),
  error: ({ text1, text2 }) => renderToast("error", text1, text2),
  pending: ({ text1, text2 }) => renderToast("pending", text1, text2),
};

const styles = StyleSheet.create({
  wrapper: {
    width: "89%",
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 10,
    position: "relative",
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  tintLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  tintLayerWithBlur: {
    backgroundColor: "rgba(126, 100, 242, 0.2)",
  },
  tintLayerFallback: {
    backgroundColor: "rgba(238, 231, 255, 0.9)",
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: FONT_FAMILY.semibold,
    fontSize: 15,
    marginBottom: 2,
  },
  message: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
