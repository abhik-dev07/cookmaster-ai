import { FONT_FAMILY } from "@/constants/fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Upgrade() {
  return (
    <View style={styles.promoCard}>
      <View>
        <Text style={styles.promoCaption}>Start from $19.99/year</Text>
        <Text style={styles.promoTitle}>Generate Unlimited Recipe!</Text>
      </View>

      <View style={styles.promoArtWrap}>
        <View style={styles.promoArtCircle}>
          <Text style={styles.promoEmoji}>🍜</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  promoCard: {
    borderRadius: 16,
    backgroundColor: "#FFDE9E",
    minHeight: 98,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  promoCaption: {
    color: "#9E7712",
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
    marginBottom: 4,
  },
  promoTitle: {
    color: "#4F3900",
    fontFamily: FONT_FAMILY.bold,
    fontSize: 20,
    lineHeight: 25,
    maxWidth: 190,
  },
  promoArtWrap: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 2,
  },
  promoArtCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.32)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  promoEmoji: {
    fontSize: 34,
  },
});
