import { FONT_FAMILY } from "@/constants/fonts";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  const { isCompactDisplay, shouldRemoveTopMargin } = useResponsiveLayout();

  return (
    <View
      style={[
        styles.headerRow,
        isCompactDisplay && styles.headerRowCompact,
        shouldRemoveTopMargin && styles.headerRowNoTopMargin,
      ]}
    >
      <View
        style={[
          styles.userInfoRow,
          isCompactDisplay && styles.userInfoRowCompact,
        ]}
      >
        <Image
          source={require("../../../assets/images/icon.png")}
          style={[styles.avatar, isCompactDisplay && styles.avatarCompact]}
          contentFit="cover"
        />
        <View style={styles.userTextWrap}>
          <Text
            style={[
              styles.greeting,
              isCompactDisplay && styles.greetingCompact,
            ]}
            maxFontSizeMultiplier={1.2}
          >
            Hello
          </Text>
          <Text
            style={[styles.name, isCompactDisplay && styles.nameCompact]}
            maxFontSizeMultiplier={1.2}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Emily Ava
          </Text>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.82} style={styles.bellButton}>
        <Ionicons name="notifications" size={18} color="#101018" />
        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 50,
  },
  headerRowCompact: {
    marginTop: 42,
  },
  headerRowNoTopMargin: {
    marginTop: 0,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  userInfoRowCompact: {
    gap: 9,
    paddingRight: 8,
  },
  userTextWrap: {
    flexShrink: 1,
    minWidth: 0,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E7E9F4",
  },
  avatarCompact: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  greeting: {
    color: "#888B9C",
    fontSize: 15,
    fontFamily: FONT_FAMILY.regular,
  },
  greetingCompact: {
    fontSize: 13,
  },
  name: {
    marginTop: 1,
    color: "#0E101A",
    fontSize: 23,
    lineHeight: 26,
    fontFamily: FONT_FAMILY.medium,
  },
  nameCompact: {
    fontSize: 20,
    lineHeight: 23,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F5FA",
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 13,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4B5A",
  },
});
