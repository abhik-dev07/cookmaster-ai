import { FONT_FAMILY } from "@/constants/fonts";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const SAVED_RECIPES = [
  {
    id: "miso-bowl",
    title: "Miso Glow Bowl",
    description:
      "A warm, balanced bowl with roasted vegetables, rice, and umami miso glaze.",
    color: "#D0C4FF",
    propTint: "#C3B2FF",
    tag: "Saved today",
    time: "18 min",
    kcal: "430 kcal",
  },
  {
    id: "salmon-slab",
    title: "Lemon Herb Salmon",
    description:
      "Flaky salmon with citrus butter, herbs, and a bright green side salad.",
    color: "#FFD9C3",
    propTint: "#FFBA96",
    tag: "Pinned recipe",
    time: "24 min",
    kcal: "512 kcal",
  },
  {
    id: "avocado-toast",
    title: "Avocado Morning Toast",
    description:
      "Soft eggs, smashed avocado, and crispy sourdough with chili flakes.",
    color: "#FFF7BA",
    propTint: "#FDEE5F",
    tag: "Quick save",
    time: "12 min",
    kcal: "295 kcal",
  },
] as const;

type SavedRecipeItem = (typeof SAVED_RECIPES)[number];

const HORIZONTAL_GUTTER = 16;
const CAROUSEL_HEIGHT = 430;

export default function CarousalSaved() {
  const { isCompactDisplay, shouldRemoveTopMargin } = useResponsiveLayout();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth;

  return (
    <View>
      <View
        style={[
          styles.header,
          shouldRemoveTopMargin && styles.headerNoTopMargin,
        ]}
      >
        <View style={styles.headerTextWrap}>
          <Text style={[styles.title, isCompactDisplay && styles.titleCompact]}>
            Saved Recipes
          </Text>
          <Text style={styles.subtitle}>
            Keep the dishes you want to cook again.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recently saved</Text>
      </View>

      <View style={styles.carouselWrap}>
        <Carousel<SavedRecipeItem>
          loop
          pagingEnabled
          snapEnabled
          autoPlay={true}
          autoPlayInterval={3000}
          scrollAnimationDuration={1400}
          width={cardWidth}
          height={CAROUSEL_HEIGHT}
          data={[...SAVED_RECIPES]}
          style={{ width: screenWidth, alignSelf: "center" }}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.94,
            parallaxScrollingOffset: 56,
            parallaxAdjacentItemScale: 0.88,
          }}
          renderItem={({ item }) => (
            <View style={styles.itemWrap}>
              <View
                style={[styles.recipeCard, { backgroundColor: item.color }]}
              >
                <View style={styles.recipeImageWrap}>
                  <Image
                    source={require("../../../assets/images/common/food.jpg")}
                    style={styles.recipeImage}
                    contentFit="cover"
                  />
                </View>

                <Image
                  source={require("../../../assets/images/common/prop.png")}
                  style={[styles.randomProp, { tintColor: item.propTint }]}
                  contentFit="contain"
                />

                <View style={styles.recipeTextWrap}>
                  <Text numberOfLines={1} style={styles.recipeTitle}>
                    {item.title}
                  </Text>
                  <Text numberOfLines={2} style={styles.recipeDescription}>
                    {item.description}
                  </Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaPill}>
                      <Ionicons name="time-outline" size={14} color="#1C1E2D" />
                      <Text style={styles.metaText}>{item.time}</Text>
                    </View>
                    <View style={styles.metaPill}>
                      <Ionicons
                        name="flame-outline"
                        size={14}
                        color="#1C1E2D"
                      />
                      <Text style={styles.metaText}>{item.kcal}</Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.primaryButton}
                    >
                      <Text style={styles.primaryButtonText}>Cook again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.secondaryButton}
                    >
                      <MaterialCommunityIcons
                        name="heart"
                        size={18}
                        color="#1A1C2A"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselWrap: {
    marginTop: 2,
    marginBottom: -25,
  },
  itemWrap: {
    paddingHorizontal: HORIZONTAL_GUTTER,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 50,
  },
  headerNoTopMargin: {
    marginTop: -10,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
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
  sectionHeader: {
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: "#171B2A",
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.4,
    fontFamily: FONT_FAMILY.bold,
  },
  recipeCard: {
    width: "100%",
    borderRadius: 28,
    padding: 14,
    overflow: "hidden",
  },
  randomProp: {
    position: "absolute",
    top: 60,
    right: -0,
    width: 300,
    height: 300,
    zIndex: 1,
  },
  recipeImageWrap: {
    height: 160,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.5)",
    zIndex: 3,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    zIndex: 3,
  },
  recipeTextWrap: {
    marginTop: 14,
    zIndex: 3,
  },
  recipeTitle: {
    color: "#141625",
    fontSize: 28,
    lineHeight: 31,
    letterSpacing: -0.5,
    fontFamily: FONT_FAMILY.bold,
    zIndex: 3,
  },
  recipeDescription: {
    marginTop: 8,
    color: "#5D6073",
    fontSize: 16,
    lineHeight: 22,
    fontFamily: FONT_FAMILY.regular,
    zIndex: 3,
  },
  metaRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
    zIndex: 3,
  },
  metaPill: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.8)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    zIndex: 3,
  },
  metaText: {
    color: "#191B2A",
    fontSize: 14,
    fontFamily: FONT_FAMILY.semibold,
  },
  actionRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#111321",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: FONT_FAMILY.semibold,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});
