import { FONT_FAMILY } from "@/constants/fonts";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type SearchInputRowVariant = "home" | "recipes";

type SearchInputRowProps = {
  variant: SearchInputRowVariant;
  isCompactDisplay?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function SearchInputRow({
  variant,
  isCompactDisplay = false,
  style,
}: SearchInputRowProps) {
  const isHomeVariant = variant === "home";

  return (
    <View
      style={[
        styles.row,
        isHomeVariant ? styles.rowHome : styles.rowRecipes,
        style,
      ]}
    >
      <View
        style={[
          styles.inputWrap,
          isHomeVariant ? styles.inputWrapHome : styles.inputWrapRecipes,
          isHomeVariant && isCompactDisplay
            ? styles.inputWrapHomeCompact
            : null,
        ]}
      >
        {isHomeVariant ? (
          <Feather name="search" size={18} color="#9EA0AE" />
        ) : (
          <Ionicons name="search" size={20} color="#A8ADBC" />
        )}

        <TextInput
          placeholder="Search recipes"
          placeholderTextColor={isHomeVariant ? "#A5A8B7" : "#A8ADBB"}
          style={[
            styles.input,
            isHomeVariant ? styles.inputHome : styles.inputRecipes,
            isHomeVariant && isCompactDisplay ? styles.inputHomeCompact : null,
          ]}
          maxFontSizeMultiplier={1.1}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.searchButton,
          isHomeVariant ? styles.searchButtonHome : styles.searchButtonRecipes,
          isHomeVariant && isCompactDisplay
            ? styles.searchButtonHomeCompact
            : null,
        ]}
      >
        <FontAwesome5
          name="search"
          size={isHomeVariant ? (isCompactDisplay ? 18 : 20) : 24}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowHome: {
    gap: 12,
  },
  rowRecipes: {
    gap: 14,
  },
  inputWrap: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  inputWrapHome: {
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 16,
  },
  inputWrapHomeCompact: {
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 14,
  },
  inputWrapRecipes: {
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  inputHome: {
    fontSize: 16,
    color: "#11121C",
    fontFamily: FONT_FAMILY.medium,
  },
  inputHomeCompact: {
    fontSize: 15,
  },
  inputRecipes: {
    fontSize: 17,
    color: "#15161F",
    fontFamily: FONT_FAMILY.regular,
  },
  searchButton: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonHome: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8B68FF",
  },
  searchButtonHomeCompact: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  searchButtonRecipes: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
