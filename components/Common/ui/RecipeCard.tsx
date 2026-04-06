import { FONT_FAMILY } from "@/constants/fonts";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

type RecipeCardMode = "category" | "recipes" | "wishlist";

type RecipeCardItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  kcal: string;
  color: string;
  propTint: string;
  tags: string[];
};

type RootStackParamList = {
  recipeDetails: {
    recipeId: string;
    title: string;
    description: string;
  };
};

type RecipeCardProps = {
  mode?: RecipeCardMode;
  selectedFilter?: string;
  showHeader?: boolean;
};

const TOP_PICKS: RecipeCardItem[] = [
  {
    id: "creamy-garlic",
    title: "Creamy Garlic",
    description: "A silky pasta bowl with tender chicken, parmesan, and herbs.",
    time: "25 min",
    kcal: "410 kcal",
    color: "#D0C4FF",
    propTint: "#C3B2FF",
    tags: ["Pasta", "Dinner", "Soup"],
  },
  {
    id: "lemon-herb",
    title: "Lemon Herb",
    description: "Citrusy roasted salmon paired with a bright, fresh finish.",
    time: "30 min",
    kcal: "410 kcal",
    color: "#D6FFD3",
    propTint: "#BDFFB9",
    tags: ["Lunch", "Rice dishes", "Biryani"],
  },
  {
    id: "avocado-morning",
    title: "Avocado Morning",
    description:
      "Creamy avocado, soft egg, and crunchy toast finished with herbs.",
    time: "15 min",
    kcal: "410 kcal",
    color: "#E8FFB7",
    propTint: "#DBFF93",
    tags: ["Breakfast", "Eggs", "Toast"],
  },
  {
    id: "rainbow-bowl",
    title: "Rainbow Grain Bowl",
    description:
      "A bright bowl of grains, roasted veggies, chickpeas, and greens.",
    time: "20 min",
    kcal: "410 kcal",
    color: "#FFD9C3",
    propTint: "#FFBA96",
    tags: ["Lunch", "Rice dishes", "Salad"],
  },
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function RecipeCard({
  mode = "recipes",
  selectedFilter = "All",
  showHeader = true,
}: RecipeCardProps) {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "recipeDetails">
    >();
  const [lovedRecipeIds, setLovedRecipeIds] = React.useState<string[]>([]);

  const activeFilter = selectedFilter;
  const normalizedFilter = normalize(activeFilter);

  const visiblePicks = React.useMemo(() => {
    if (normalizedFilter === "all") {
      return TOP_PICKS;
    }

    return TOP_PICKS.filter((item) =>
      item.tags.some((tag) => normalize(tag) === normalizedFilter),
    );
  }, [normalizedFilter]);

  const sectionTitle =
    mode === "wishlist"
      ? `${activeFilter} Saved Recipes`
      : `${activeFilter} Recipes`;

  const triggerHaptics = async () => {
    if (Platform.OS !== "web") {
      await Haptics.selectionAsync();
    }
  };

  const handleToggleLoved = async (recipeId: string) => {
    await triggerHaptics();

    setLovedRecipeIds((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId],
    );
  };

  return (
    <View>
      {showHeader ? (
        <View style={styles.sectionHeaderTopPicks}>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        </View>
      ) : null}

      <View style={styles.grid}>
        {visiblePicks.map((item, index) => {
          const loved = lovedRecipeIds.includes(item.id);
          const heartName = loved ? "heart" : "heart-outline";
          const heartColor = loved ? "#F64B67" : "#1A1C2A";

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.92}
              onPress={async () => {
                await triggerHaptics();
                navigation.navigate("recipeDetails", {
                  recipeId: item.id,
                  title: item.title,
                  description: item.description,
                });
              }}
              style={[styles.pickCard, { backgroundColor: item.color }]}
            >
              <View style={styles.pickImageWrap}>
                <Image
                  source={require("../../../assets/images/common/food.jpg")}
                  style={styles.pickImage}
                  contentFit="cover"
                />
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.pickHeartButton}
                  onPress={async (event) => {
                    event.stopPropagation();
                    await handleToggleLoved(item.id);
                  }}
                >
                  <MaterialCommunityIcons
                    name={heartName}
                    size={18}
                    color={heartColor}
                  />
                </TouchableOpacity>
              </View>

              <Image
                source={require("../../../assets/images/common/prop.png")}
                style={[
                  styles.pickProp,
                  index % 2 === 0 ? styles.pickPropLeft : styles.pickPropRight,
                  { tintColor: item.propTint },
                ]}
                contentFit="contain"
              />

              <Text numberOfLines={1} style={styles.pickTitle}>
                {item.title}
              </Text>
              <Text numberOfLines={2} style={styles.pickDescription}>
                {item.description}
              </Text>

              <View style={styles.pickMetaRow}>
                <Text style={styles.pickTime}>
                  <Ionicons name="time-outline" size={14} color="#22222F" />{" "}
                  {item.time}
                </Text>
                <Text style={styles.pickTime}>
                  <Ionicons name="flame-outline" size={14} color="#22222F" />{" "}
                  {item.kcal}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {visiblePicks.length === 0 ? (
        <View style={styles.emptyStateWrap}>
          <Text style={styles.emptyStateText}>
            No recipes found for this filter.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerChrome: {
    width: "100%",
  },
  headerChromeCategory: {
    marginTop: 18,
    marginBottom: 14,
  },
  headerChromeRecipes: {
    marginTop: 2,
    marginBottom: 10,
  },
  headerChromeWishlist: {
    marginTop: 2,
    marginBottom: 8,
  },
  sectionHeaderTopPicks: {
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  pickCard: {
    width: "48%",
    minHeight: 280,
    borderRadius: 24,
    padding: 10,
    overflow: "hidden",
  },
  pickImageWrap: {
    height: 105,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.55)",
    zIndex: 3,
    position: "relative",
  },
  pickHeartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 4,
  },
  pickImage: {
    width: "100%",
    height: "100%",
  },
  pickProp: {
    position: "absolute",
    top: 150,
    width: 200,
    height: 200,
    zIndex: 1,
  },
  pickPropLeft: {
    left: -80,
  },
  pickPropRight: {
    right: -80,
  },
  pickTitle: {
    marginTop: 14,
    color: "#171A2B",
    fontSize: 25,
    lineHeight: 28,
    letterSpacing: -0.4,
    fontFamily: FONT_FAMILY.medium,
    zIndex: 3,
  },
  pickDescription: {
    marginTop: 8,
    color: "#6A6D80",
    fontSize: 15,
    lineHeight: 21,
    fontFamily: FONT_FAMILY.regular,
    zIndex: 3,
  },
  pickMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 3,
  },
  pickTime: {
    marginTop: 24,
    color: "#202233",
    fontSize: 15,
    fontFamily: FONT_FAMILY.semibold,
    gap: 6,
    zIndex: 3,
  },
  emptyStateWrap: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  emptyStateText: {
    color: "#6A6D80",
    fontSize: 14,
    fontFamily: FONT_FAMILY.medium,
  },
});
