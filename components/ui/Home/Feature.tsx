import { FONT_FAMILY } from "@/constants/fonts";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Feature() {
  const { width, isCompactDisplay, isLargeFont, useCompactCard } =
    useResponsiveLayout();

  const featuredCardWidth = useMemo(() => {
    const horizontalPadding = 15;
    const safeInnerWidth = Math.max(width - horizontalPadding * 2, 300);
    return Math.min(safeInnerWidth, 420);
  }, [width]);

  return (
    <View style={styles.content}>
      <View style={{ gap: 5 }}>
        <LinearGradient
          colors={["#C9B3FF", "#B69CFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.featuredCard,
            {
              width: featuredCardWidth,
              minHeight: useCompactCard ? 336 : 312,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.85} style={styles.favoriteButton}>
            <Ionicons name="heart" size={18} color="#13131E" />
          </TouchableOpacity>

          <View style={styles.cardTextWrap}>
            <Text
              style={[
                styles.cardTitle,
                useCompactCard && styles.cardTitleCompact,
              ]}
              maxFontSizeMultiplier={1.1}
            >
              Aegean
            </Text>
            <Text
              style={[
                styles.cardTitle,
                useCompactCard && styles.cardTitleCompact,
              ]}
              maxFontSizeMultiplier={1.1}
            >
              Breeze Salad
            </Text>

            <View style={styles.timeRow}>
              <Ionicons name="time" size={15} color="#121228" />
              <Text
                style={[
                  styles.timeText,
                  useCompactCard && styles.timeTextCompact,
                ]}
                maxFontSizeMultiplier={1.15}
              >
                20 minutes
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.recipeImageWrap,
              useCompactCard && styles.recipeImageWrapCompact,
            ]}
          >
            <Image
              source={require("../../../assets/images/onboarding/onboarding2.png")}
              style={styles.recipeImage}
              contentFit="cover"
            />
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.seeRecipeButton}>
            <Text
              style={[
                styles.seeRecipeText,
                useCompactCard && styles.seeRecipeTextCompact,
              ]}
              maxFontSizeMultiplier={1.15}
            >
              See Recipe
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={["#C9B3FF", "#B69CFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.featuredCard,
            {
              width: featuredCardWidth,
              minHeight: useCompactCard ? 336 : 312,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.85} style={styles.favoriteButton}>
            <Ionicons name="heart" size={18} color="#13131E" />
          </TouchableOpacity>

          <View style={styles.cardTextWrap}>
            <Text
              style={[
                styles.cardTitle,
                useCompactCard && styles.cardTitleCompact,
              ]}
              maxFontSizeMultiplier={1.1}
            >
              Aegean
            </Text>
            <Text
              style={[
                styles.cardTitle,
                useCompactCard && styles.cardTitleCompact,
              ]}
              maxFontSizeMultiplier={1.1}
            >
              Breeze Salad
            </Text>

            <View style={styles.timeRow}>
              <Ionicons name="time" size={15} color="#121228" />
              <Text
                style={[
                  styles.timeText,
                  useCompactCard && styles.timeTextCompact,
                ]}
                maxFontSizeMultiplier={1.15}
              >
                20 minutes
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.recipeImageWrap,
              useCompactCard && styles.recipeImageWrapCompact,
            ]}
          >
            <Image
              source={require("../../../assets/images/onboarding/onboarding2.png")}
              style={styles.recipeImage}
              contentFit="cover"
            />
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.seeRecipeButton}>
            <Text
              style={[
                styles.seeRecipeText,
                useCompactCard && styles.seeRecipeTextCompact,
              ]}
              maxFontSizeMultiplier={1.15}
            >
              See Recipe
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          colors={["#C9B3FF", "#B69CFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.featuredCard,
            {
              width: featuredCardWidth,
              minHeight: useCompactCard ? 336 : 312,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.85} style={styles.favoriteButton}>
            <Ionicons name="heart" size={18} color="#13131E" />
          </TouchableOpacity>

          <View style={styles.cardTextWrap}>
            <Text
              style={[
                styles.cardTitle,
                useCompactCard && styles.cardTitleCompact,
              ]}
              maxFontSizeMultiplier={1.1}
            >
              Aegean
            </Text>
            <Text
              style={[
                styles.cardTitle,
                useCompactCard && styles.cardTitleCompact,
              ]}
              maxFontSizeMultiplier={1.1}
            >
              Breeze Salad
            </Text>

            <View style={styles.timeRow}>
              <Ionicons name="time" size={15} color="#121228" />
              <Text
                style={[
                  styles.timeText,
                  useCompactCard && styles.timeTextCompact,
                ]}
                maxFontSizeMultiplier={1.15}
              >
                20 minutes
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.recipeImageWrap,
              useCompactCard && styles.recipeImageWrapCompact,
            ]}
          >
            <Image
              source={require("../../../assets/images/onboarding/onboarding2.png")}
              style={styles.recipeImage}
              contentFit="cover"
            />
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.seeRecipeButton}>
            <Text
              style={[
                styles.seeRecipeText,
                useCompactCard && styles.seeRecipeTextCompact,
              ]}
              maxFontSizeMultiplier={1.15}
            >
              See Recipe
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 15,
    paddingTop: 2,
  },
  featuredCard: {
    marginTop: 10,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 24,
    overflow: "hidden",
    minHeight: 312,
  },
  favoriteButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.58)",
  },
  cardTextWrap: {
    maxWidth: "56%",
    zIndex: 2,
    flexShrink: 1,
  },
  cardTitle: {
    color: "#0E1020",
    fontSize: 49,
    lineHeight: 54,
    letterSpacing: -0.6,
    fontFamily: FONT_FAMILY.bold,
  },
  cardTitleCompact: {
    fontSize: 40,
    lineHeight: 45,
  },
  timeRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  timeText: {
    color: "#111125",
    fontSize: 20,
    fontFamily: FONT_FAMILY.medium,
  },
  timeTextCompact: {
    fontSize: 17,
  },
  recipeImageWrap: {
    position: "absolute",
    right: -35,
    top: 90,
    width: 246,
    height: 246,
    borderRadius: 123,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.66)",
    backgroundColor: "#FFFFFF",
    zIndex: 2,
  },
  recipeImageWrapCompact: {
    right: -20,
    top: 112,
    width: 212,
    height: 212,
    borderRadius: 106,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  seeRecipeButton: {
    position: "absolute",
    left: 18,
    bottom: 18,
    minWidth: 136,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  seeRecipeText: {
    color: "#131329",
    fontSize: 17,
    fontFamily: FONT_FAMILY.semibold,
  },
  seeRecipeTextCompact: {
    fontSize: 15,
  },
});
