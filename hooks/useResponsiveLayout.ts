import { Platform, useWindowDimensions } from "react-native";

export interface ResponsiveLayoutValues {
  width: number;
  height: number;
  fontScale: number;
  isCompactDisplay: boolean;
  isLargeFont: boolean;
  shouldRemoveTopMargin: boolean;
  useCompactCard: boolean;
  androidApiLevel: number;
}

export function useResponsiveLayout(): ResponsiveLayoutValues {
  const { width, height, fontScale } = useWindowDimensions();

  const androidApiLevel =
    Platform.OS === "android" && typeof Platform.Version === "number"
      ? Platform.Version
      : 0;

  const isCompactDisplay = width < 380;
  const isLargeFont = fontScale > 1.15;
  const shouldRemoveTopMargin =
    Platform.OS === "android" && androidApiLevel < 35;
  const useCompactCard = isLargeFont || isCompactDisplay;

  return {
    width,
    height,
    fontScale,
    isCompactDisplay,
    isLargeFont,
    shouldRemoveTopMargin,
    useCompactCard,
    androidApiLevel,
  };
}
