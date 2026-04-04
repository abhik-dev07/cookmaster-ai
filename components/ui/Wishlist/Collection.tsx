import { FONT_FAMILY } from "@/constants/fonts";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Collection() {
  return (
    <View>
      <View style={styles.footerCard}>
        <Image
          source={require("../../../assets/images/common/prop.png")}
          style={styles.footerBackdrop}
          contentFit="contain"
        />
        <Text style={styles.footerTitle}>Organize your wishlist</Text>
        <Text style={styles.footerBody}>
          Group recipes into breakfast, quick lunch, or weekend dinner so your
          next cook is faster.
        </Text>
        <TouchableOpacity activeOpacity={0.86} style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Create collection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerCard: {
    borderRadius: 28,
    backgroundColor: "#D0C4FF",
    padding: 18,
    overflow: "hidden",
  },
  footerBackdrop: {
    position: "absolute",
    right: -90,
    top: -90,
    width: 250,
    height: 250,
    tintColor: "#C1AFFF",
    zIndex: 0,
  },
  footerTitle: {
    color: "#141625",
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.3,
    fontFamily: FONT_FAMILY.bold,
    zIndex: 2,
  },
  footerBody: {
    marginTop: 8,
    color: "#575A6D",
    fontSize: 15,
    lineHeight: 21,
    fontFamily: FONT_FAMILY.regular,
    zIndex: 2,
  },
  footerButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#111321",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  footerButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONT_FAMILY.semibold,
  },
});
