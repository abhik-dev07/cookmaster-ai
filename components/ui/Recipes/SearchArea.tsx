import { FONT_FAMILY } from "@/constants/fonts";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SearchArea() {
  const { isCompactDisplay } = useResponsiveLayout();
  return (
    <View>
      <Text style={[styles.title, isCompactDisplay && styles.titleCompact]}>
        Explore All Recipes
      </Text>
      <Text
        style={[styles.subtitle, isCompactDisplay && styles.subtitleCompact]}
      >
        Find colorful dishes for every craving that you created
      </Text>

      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color="#A8ADBC" />
          <Text style={styles.searchPlaceholder}>Search recipes</Text>
        </View>

        <TouchableOpacity activeOpacity={0.86} style={styles.filterButton}>
          <FontAwesome5 name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 50,
    color: "#131626",
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.7,
    fontFamily: FONT_FAMILY.medium,
  },
  titleCompact: {
    fontSize: 32,
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 5,
    color: "#4E5162",
    fontSize: 17,
    lineHeight: 22,
    fontFamily: FONT_FAMILY.regular,
  },
  subtitleCompact: {
    fontSize: 18,
    lineHeight: 22,
  },
  searchRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  searchInput: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    gap: 10,
  },
  searchPlaceholder: {
    color: "#A8ADBB",
    fontSize: 17,
    fontFamily: FONT_FAMILY.regular,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B54F5",
    shadowColor: "#8B54F5",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 3,
  },
});
