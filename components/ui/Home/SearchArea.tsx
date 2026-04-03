import { FONT_FAMILY } from "@/constants/fonts";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchArea() {
  const { isCompactDisplay } = useResponsiveLayout();

  return (
    <View style={styles.content}>
      <Text
        style={[styles.title, isCompactDisplay && styles.titleCompact]}
        maxFontSizeMultiplier={1.2}
      >
        Explore New Recipes
      </Text>

      <View
        style={[styles.searchRow, isCompactDisplay && styles.searchRowCompact]}
      >
        <View
          style={[
            styles.searchInputWrap,
            isCompactDisplay && styles.searchInputWrapCompact,
          ]}
        >
          <Feather name="search" size={18} color="#9EA0AE" />
          <TextInput
            placeholder="Search recipes"
            placeholderTextColor="#A5A8B7"
            style={[
              styles.searchInput,
              isCompactDisplay && styles.searchInputCompact,
            ]}
            maxFontSizeMultiplier={1.1}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.filterButton,
            isCompactDisplay && styles.filterButtonCompact,
          ]}
        >
          <FontAwesome5
            name="search"
            size={isCompactDisplay ? 18 : 20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 15,
  },
  title: {
    marginTop: 26,
    color: "#11121C",
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.5,
    fontFamily: FONT_FAMILY.semibold,
    width: "100%",
    flexShrink: 1,
  },
  titleCompact: {
    fontSize: 30,
    lineHeight: 34,
  },
  searchRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchRowCompact: {
    marginTop: 16,
    gap: 8,
  },
  searchInputWrap: {
    flex: 1,
    minWidth: 0,
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  searchInputWrapCompact: {
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#11121C",
    fontFamily: FONT_FAMILY.medium,
  },
  searchInputCompact: {
    fontSize: 15,
  },
  filterButton: {
    flexShrink: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B68FF",
  },
  filterButtonCompact: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
});
