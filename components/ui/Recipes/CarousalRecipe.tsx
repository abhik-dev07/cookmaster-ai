import { FONT_FAMILY } from "@/constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const RANDOM_RECIPES = [
  {
    id: "truffle-pasta",
    title: "Truffle Mushroom Pasta",
    description:
      "Silky pasta with sautéed mushrooms, parmesan cream, and a touch of truffle for a cozy dinner.",
    tag: "Random pick",
    time: "22 min",
    kcal: "410 kcal",
    color: "#D0C4FF",
    propTint: "#C3B2FF",
  },
  {
    id: "summer-bowl",
    title: "Summer Salmon Bowl",
    description:
      "Juicy salmon, avocado, and crisp greens with a bright citrus dressing.",
    tag: "Chef choice",
    time: "28 min",
    kcal: "486 kcal",
    color: "#FFD9C3",
    propTint: "#FFBA96",
  },
  {
    id: "creamy-garlic",
    title: "Creamy Garlic",
    description: "A silky pasta bowl with tender chicken, parmesan, and herbs.",
    tag: "Chef choice",
    time: "28 min",
    kcal: "410 kcal",
    color: "#FFF7BA",
    propTint: "#FDEE5F",
  },
] as const;

type RecipeItem = (typeof RANDOM_RECIPES)[number];

const HORIZONTAL_GUTTER = 16;
const CAROUSEL_HEIGHT = 360;

export default function CarousalRecipe() {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth;

  return (
    <View style={styles.carouselWrap}>
      <Carousel<RecipeItem>
        loop
        pagingEnabled
        snapEnabled
        autoPlay={true}
        autoPlayInterval={3000}
        scrollAnimationDuration={1400}
        width={cardWidth}
        height={CAROUSEL_HEIGHT}
        data={[...RANDOM_RECIPES]}
        style={{ width: screenWidth, alignSelf: "center" }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.94,
          parallaxScrollingOffset: 56,
          parallaxAdjacentItemScale: 0.88,
        }}
        renderItem={({ item }) => (
          <View style={styles.itemWrap}>
            <View style={[styles.randomCard, { backgroundColor: item.color }]}>
              <View style={styles.randomImageWrap}>
                <Image
                  source={require("../../../assets/images/common/food.jpg")}
                  style={styles.randomImage}
                  contentFit="cover"
                />
              </View>

              <Image
                source={require("../../../assets/images/common/prop.png")}
                style={[styles.randomProp, { tintColor: item.propTint }]}
                contentFit="contain"
              />

              <Text numberOfLines={1} style={styles.randomTitle}>
                {item.title}
              </Text>
              <Text numberOfLines={2} style={styles.randomDescription}>
                {item.description}
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.metaPill}>
                  <Ionicons name="time-outline" size={14} color="#22222F" />
                  <Text style={styles.metaText}>{item.time}</Text>
                </View>
                <View style={styles.metaPill}>
                  <Ionicons name="flame-outline" size={14} color="#1C1E2D" />
                  <Text style={styles.metaText}>{item.kcal}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselWrap: {
    marginTop: 18,
  },
  itemWrap: {
    paddingHorizontal: HORIZONTAL_GUTTER,
  },
  randomCard: {
    width: "100%",
    borderRadius: 28,
    padding: 14,
    overflow: "hidden",
  },
  randomImageWrap: {
    height: 196,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.28)",
    zIndex: 3,
  },
  randomImage: {
    width: "100%",
    height: "100%",
  },
  randomProp: {
    position: "absolute",
    top: 180,
    right: -120,
    width: 300,
    height: 300,
    zIndex: 1,
  },
  randomTitle: {
    marginTop: 14,
    color: "#181A2C",
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: -0.5,
    fontFamily: FONT_FAMILY.bold,
    zIndex: 3,
  },
  randomDescription: {
    marginTop: 8,
    color: "#5E6072",
    fontSize: 17,
    lineHeight: 23,
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
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: "#1C1E2B",
    fontSize: 14,
    fontFamily: FONT_FAMILY.semibold,
  },
});
