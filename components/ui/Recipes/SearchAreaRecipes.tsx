import SearchInputRow from "@/components/Common/ui/SearchInputRow";
import { FONT_FAMILY } from "@/constants/fonts";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SearchAreaRecipes() {
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

      <SearchInputRow variant="recipes" style={styles.searchRow} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 50,
    color: "#15161F",
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
  },
});
