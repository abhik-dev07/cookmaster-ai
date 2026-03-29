import { FONT_FAMILY } from "@/constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.headerRow}>
      <View style={styles.userInfoRow}>
        <Image
          source={require("../../../assets/images/icon.png")}
          style={styles.avatar}
          contentFit="cover"
        />
        <View>
          <Text style={styles.greeting}>Hello</Text>
          <Text style={styles.name}>Emily Ava</Text>
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
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E7E9F4",
  },
  greeting: {
    color: "#888B9C",
    fontSize: 15,
    fontFamily: FONT_FAMILY.regular,
  },
  name: {
    marginTop: 1,
    color: "#0E101A",
    fontSize: 23,
    lineHeight: 26,
    fontFamily: FONT_FAMILY.medium,
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
