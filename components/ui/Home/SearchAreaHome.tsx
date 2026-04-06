import SearchInputRow from "@/components/Common/ui/SearchInputRow";
import { FONT_FAMILY } from "@/constants/fonts";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SearchAreaHome() {
  const { isCompactDisplay } = useResponsiveLayout();

  return (
    <View style={styles.content}>
      <Text
        style={[styles.title, isCompactDisplay && styles.titleCompact]}
        maxFontSizeMultiplier={1.2}
      >
        Explore New Recipes
      </Text>

      <SearchInputRow
        variant="home"
        isCompactDisplay={isCompactDisplay}
        style={[styles.searchRow, isCompactDisplay && styles.searchRowCompact]}
      />
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
  },
  searchRowCompact: {
    marginTop: 16,
  },
});
