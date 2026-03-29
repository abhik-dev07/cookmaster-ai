import { FONT_FAMILY } from "@/constants/fonts";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchArea() {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Explore New Recipes</Text>

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Feather name="search" size={18} color="#9EA0AE" />
          <TextInput
            placeholder="Search recipes"
            placeholderTextColor="#A5A8B7"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.filterButton}>
          <MaterialCommunityIcons
            name="tune-variant"
            size={20}
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
  },
  searchRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputWrap: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F3F8",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#11121C",
    fontFamily: FONT_FAMILY.medium,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B68FF",
  },
});
