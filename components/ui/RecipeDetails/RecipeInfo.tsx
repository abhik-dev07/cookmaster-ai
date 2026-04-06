import { FONT_FAMILY } from "@/constants/fonts";
import { showSuccessToast } from "@/utils/toast";
import {
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  recipeDetails: {
    recipeId: string;
    title: string;
    description: string;
  };
};

export default function RecipeInfo() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "recipeDetails">>();
  const title = route.params?.title ?? "Mix Grilled Chicken Salad";
  const description =
    route.params?.description ??
    "Do you have a sweet tooth, but need to lessen your sugar intake? There are ways to achieve this without cutting...";
  const [isLoved, setIsLoved] = React.useState(false);

  const handleToggleLoved = React.useCallback(async () => {
    if (Platform.OS !== "web") {
      await Haptics.selectionAsync();
    }

    setIsLoved((prev) => {
      const next = !prev;

      showSuccessToast(
        next ? "Added to favorites" : "Removed from favorites",
        next ? `${title} is now in your favorites.` : `${title} was removed.`,
      );

      return next;
    });
  }, [title]);
  return (
    <View>
      <View style={styles.recipeCard}>
        <View style={styles.imageWrap}>
          <View style={styles.imageHeaderActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionButton}
              onPress={async () => {
                if (Platform.OS !== "web") {
                  await Haptics.selectionAsync();
                }

                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
            >
              <Ionicons name="close" size={28} color="#13141D" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionButton}
              onPress={() => {
                void handleToggleLoved();
              }}
            >
              <MaterialCommunityIcons
                name={isLoved ? "heart" : "heart-outline"}
                size={24}
                color={isLoved ? "#F64B67" : "#13141D"}
              />
            </TouchableOpacity>
          </View>

          <Image
            source={require("../../../assets/images/common/food.jpg")}
            style={styles.heroImage}
            contentFit="cover"
          />

          <View style={styles.timePill}>
            <Ionicons name="time-outline" size={14} color="#12131A" />
            <Text style={styles.timeText}>20 min</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText} numberOfLines={2}>
              {title}
            </Text>
          </View>
          <Text style={styles.quoteText}>{description}</Text>

          <View style={styles.nutritionRow}>
            <View style={[styles.nutritionCard, styles.nutritionCardGreen]}>
              <Image
                source={require("../../../assets/images/common/prop.png")}
                style={[styles.nutritionProp, styles.nutritionPropGreen]}
                contentFit="contain"
              />
              <View
                style={[styles.nutritionIconWrap, styles.nutritionIconLight]}
              >
                <FontAwesome5 name="fire" size={22} color="#111218" />
              </View>
              <Text style={styles.nutritionPrimary}>570 Kcal</Text>
              <Text style={styles.nutritionSecondary}>Calories</Text>
            </View>

            <View style={[styles.nutritionCard, styles.nutritionCardPurple]}>
              <Image
                source={require("../../../assets/images/common/prop.png")}
                style={[styles.nutritionProp, styles.nutritionPropPurple]}
                contentFit="contain"
              />
              <View
                style={[styles.nutritionIconWrap, styles.nutritionIconDark]}
              >
                <MaterialCommunityIcons
                  name="fruit-grapes"
                  size={22}
                  color="#111218"
                />
              </View>
              <Text style={styles.nutritionPrimary}>10 Healthy</Text>
              <Text style={styles.nutritionSecondary}>Ingredients</Text>
            </View>
          </View>

          <View style={styles.nutritionRow}>
            <View style={[styles.nutritionCard, styles.nutritionCardOrange]}>
              <Image
                source={require("../../../assets/images/common/prop.png")}
                style={[styles.nutritionProp, styles.nutritionPropOrange]}
                contentFit="contain"
              />
              <View
                style={[styles.nutritionIconWrap, styles.nutritionIconLight]}
              >
                <Ionicons name="flash" size={22} color="#111218" />
              </View>
              <Text style={styles.nutritionPrimary}>58 Gm</Text>
              <Text style={styles.nutritionSecondary}>Proteins</Text>
            </View>

            <View style={[styles.nutritionCard, styles.nutritionCardYellow]}>
              <Image
                source={require("../../../assets/images/common/prop.png")}
                style={[styles.nutritionProp, styles.nutritionPropYellow]}
                contentFit="contain"
              />
              <View
                style={[styles.nutritionIconWrap, styles.nutritionIconDark]}
              >
                <FontAwesome6 name="plate-wheat" size={22} color="#111218" />
              </View>
              <Text style={styles.nutritionPrimary}>2 Person</Text>
              <Text style={styles.nutritionSecondary}>Serving</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recipeCard: {
    borderRadius: 34,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#101015",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  imageWrap: {
    height: 212,
    backgroundColor: "#C9B9FA",
    position: "relative",
  },
  imageHeaderActions: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.82)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignSelf: "center",
  },
  timePill: {
    position: "absolute",
    right: 14,
    bottom: 12,
    backgroundColor: "rgba(255,255,255,0.86)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    zIndex: 5,
  },
  timeText: {
    color: "#13141D",
    fontSize: 13,
    fontFamily: FONT_FAMILY.medium,
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  titleText: {
    flex: 1,
    color: "#16171F",
    fontSize: 37,
    lineHeight: 39,
    fontFamily: FONT_FAMILY.semibold,
    letterSpacing: -0.8,
  },
  nutritionRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  nutritionCard: {
    flex: 1,
    borderRadius: 30,
    padding: 12,
    minHeight: 94,
    overflow: "hidden",
    position: "relative",
  },
  nutritionCardGreen: {
    backgroundColor: "#A2FE86",
  },
  nutritionCardPurple: {
    backgroundColor: "#D0C4FF",
  },
  nutritionCardOrange: {
    backgroundColor: "#FFD9C3",
  },
  nutritionCardYellow: {
    backgroundColor: "#E8FFB7",
  },
  nutritionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    zIndex: 2,
  },
  nutritionIconLight: {
    backgroundColor: "#FFFFFF",
  },
  nutritionIconDark: {
    backgroundColor: "#FFFFFF",
  },
  nutritionPrimary: {
    color: "#15161D",
    fontSize: 19,
    lineHeight: 22,
    fontFamily: FONT_FAMILY.medium,
    zIndex: 2,
  },
  nutritionSecondary: {
    marginTop: 1,
    color: "#323543",
    fontSize: 16,
    lineHeight: 18,
    fontFamily: FONT_FAMILY.regular,
    zIndex: 2,
  },
  nutritionProp: {
    position: "absolute",
    top: 30,
    right: -45,
    width: 120,
    height: 120,
    zIndex: 1,
  },
  nutritionPropGreen: {
    tintColor: "#84FF5F",
  },
  nutritionPropPurple: {
    tintColor: "#C3B2FF",
  },
  nutritionPropOrange: {
    tintColor: "#FFBA96",
  },
  nutritionPropYellow: {
    tintColor: "#DBFF93",
  },
  quoteText: {
    marginTop: 8,
    color: "#4B5062",
    fontSize: 16,
    lineHeight: 19,
    fontFamily: FONT_FAMILY.regular,
  },
});
