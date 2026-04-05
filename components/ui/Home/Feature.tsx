import { FONT_FAMILY } from "@/constants/fonts";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import PROP_IMAGE from "../../../assets/images/common/prop.png";

const RECENT_GENERATED_RECIPES = [
  {
    id: "mediterranean-grain-bowl",
    title: "Mediterranean Grain Bowl",
    description:
      "A colorful grain bowl with fresh veggies, herbs, and a zesty dressing.",
    duration: "18 minutes",
    color: "#D0C4FF",
    propTint: "#C3B2FF",
  },
  {
    id: "garlic-herb-pasta-toss",
    title: "Garlic Herb Pasta Toss",
    description:
      "Quick pasta tossed with garlic, olive oil, herbs, and parmesan.",
    duration: "24 minutes",
    color: "#D6FFD3",
    propTint: "#BDFFB9",
  },
  {
    id: "creamy-pumpkin-soup",
    title: "Creamy Pumpkin Soup",
    description:
      "A velvety pumpkin soup finished with cream, pepper, and warm spices.",
    duration: "30 minutes",
    color: "#E8FFB7",
    propTint: "#DBFF93",
  },
] as const;

type RootStackParamList = {
  recipeDetails: {
    recipeId: string;
    title: string;
    description: string;
  };
};

export default function Feature() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "recipeDetails">
    >();
  const { width, useCompactCard } = useResponsiveLayout();

  const featuredCardWidth = useMemo(() => {
    const horizontalPadding = 16;
    const safeInnerWidth = Math.max(width - horizontalPadding * 2, 300);
    return Math.min(safeInnerWidth, 420);
  }, [width]);

  return (
    <View style={styles.content}>
      {RECENT_GENERATED_RECIPES.slice(0, 3).map((recipe) => (
        <LinearGradient
          key={recipe.title}
          colors={[recipe.color, recipe.color]}
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
          <Image
            source={PROP_IMAGE}
            style={[
              styles.propBackdrop,
              useCompactCard && styles.propBackdropCompact,
              { tintColor: recipe.propTint },
            ]}
            contentFit="contain"
          />

          <TouchableOpacity activeOpacity={0.85} style={styles.favoriteButton}>
            <Ionicons name="heart" size={18} color="#13131E" />
          </TouchableOpacity>

          <View style={styles.cardTextWrap}>
            <Text
              style={[
                styles.cardTitle,
                useCompactCard && styles.cardTitleCompact,
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={1.1}
            >
              {recipe.title}
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
                {recipe.duration}
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
              source={require("../../../assets/images/common/food.jpg")}
              style={styles.recipeImage}
              contentFit="cover"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.seeRecipeButton}
            onPress={() => {
              navigation.navigate("recipeDetails", {
                recipeId: recipe.id,
                title: recipe.title,
                description: recipe.description,
              });
            }}
          >
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
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  featuredCard: {
    marginTop: 10,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    overflow: "hidden",
    minHeight: 312,
    marginBottom: 5,
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
    zIndex: 4,
  },
  propBackdrop: {
    position: "absolute",
    top: 38,
    right: -8,
    width: 320,
    height: 320,
    zIndex: 1,
  },
  propBackdropCompact: {
    top: 44,
    right: -2,
    width: 210,
    height: 210,
  },
  cardTextWrap: {
    maxWidth: "56%",
    zIndex: 3,
    flexShrink: 1,
    paddingBottom: 76,
  },
  cardTitle: {
    color: "#0E1020",
    fontSize: 49,
    lineHeight: 54,
    letterSpacing: -0.6,
    fontFamily: FONT_FAMILY.medium,
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
    right: -44,
    top: 134,
    width: 262,
    height: 210,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.66)",
    backgroundColor: "#FFFFFF",
    zIndex: 3,
  },
  recipeImageWrapCompact: {
    right: -28,
    top: 110,
    width: 224,
    height: 214,
    borderRadius: 30,
  },
  recipeImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
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
    zIndex: 4,
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
