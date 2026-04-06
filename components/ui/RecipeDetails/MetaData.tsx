import { FONT_FAMILY } from "@/constants/fonts";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const INGREDIENTS = [
  { emoji: "🍗", name: "Chicken breast", quantity: "2 pieces" },
  { emoji: "🥬", name: "Mixed greens", quantity: "1 cup" },
  { emoji: "🥑", name: "Avocado", quantity: "1 whole" },
  { emoji: "🍅", name: "Cherry tomatoes", quantity: "1/2 cup" },
  { emoji: "🫒", name: "Olive oil", quantity: "2 tbsp" },
  { emoji: "🍋", name: "Lemon juice", quantity: "1 tbsp" },
] as const;

const STEPS = [
  "Season and grill chicken for 8-10 minutes.",
  "Slice the grilled chicken into strips.",
  "Add greens, avocado, and tomatoes to a bowl.",
  "Top with chicken and drizzle dressing.",
  "Toss lightly and serve immediately.",
] as const;

type RecipeTab = "ingredients" | "steps";

export default function MetaData() {
  const [activeTab, setActiveTab] = React.useState<RecipeTab>("ingredients");
  const [segmentWidth, setSegmentWidth] = React.useState(0);

  const activeIndex = useSharedValue(0);
  const contentOpacity = useSharedValue(1);

  const handleSelectTab = React.useCallback(
    async (nextTab: RecipeTab) => {
      const nextIndex = nextTab === "ingredients" ? 0 : 1;

      if (nextTab === activeTab) {
        return;
      }

      if (Platform.OS !== "web") {
        await Haptics.selectionAsync();
      }

      activeIndex.value = withTiming(nextIndex, { duration: 220 });
      contentOpacity.value = 0;
      setActiveTab(nextTab);
      requestAnimationFrame(() => {
        contentOpacity.value = withTiming(1, { duration: 220 });
      });
    },
    [activeTab, activeIndex, contentOpacity],
  );

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: (segmentWidth / 2 - 4) * activeIndex.value,
      },
    ],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: (1 - contentOpacity.value) * 8 }],
  }));

  return (
    <View>
      <View style={styles.tabSection}>
        <View
          style={styles.segmentWrap}
          onLayout={(event) => {
            setSegmentWidth(event.nativeEvent.layout.width);
          }}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.segmentIndicator,
              { width: segmentWidth > 0 ? segmentWidth / 2 - 4 : undefined },
              indicatorAnimatedStyle,
            ]}
          />

          <TouchableOpacity
            activeOpacity={0.86}
            style={styles.segment}
            onPress={() => {
              void handleSelectTab("ingredients");
            }}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "ingredients" && styles.segmentTextActive,
              ]}
            >
              Ingredients
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.86}
            style={styles.segment}
            onPress={() => {
              void handleSelectTab("steps");
            }}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "steps" && styles.segmentTextActive,
              ]}
            >
              Steps
            </Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.tabContentWrap, contentAnimatedStyle]}>
          {activeTab === "ingredients"
            ? INGREDIENTS.map((item) => (
                <View
                  key={`${item.name}-${item.quantity}`}
                  style={styles.ingredientRow}
                >
                  <View style={styles.ingredientLeft}>
                    <View style={styles.ingredientEmojiWrap}>
                      <Text style={styles.ingredientEmoji}>{item.emoji}</Text>
                    </View>
                    <Text style={styles.ingredientName}>{item.name}</Text>
                  </View>

                  <Text style={styles.ingredientQuantity}>{item.quantity}</Text>
                </View>
              ))
            : STEPS.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.tabItemRow}>
                  <Text style={styles.stepIndex}>{index + 1}.</Text>
                  <Text style={styles.tabItemText}>{item}</Text>
                </View>
              ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  segmentWrap: {
    marginTop: 16,
    flexDirection: "row",
    padding: 4,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.9)",
    marginBottom: 10,
    position: "relative",
    overflow: "hidden",
  },
  segmentIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 24,
    backgroundColor: "#F5F7FB",
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    height: 42,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  segmentText: {
    color: "#6A6D80",
    fontSize: 15,
    fontFamily: FONT_FAMILY.medium,
  },
  segmentTextActive: {
    color: "#1B1D29",
  },
  tabSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  tabContentWrap: {
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  ingredientRow: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: "#F3F4F7",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ingredientLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ingredientEmojiWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#DED5EF",
    alignItems: "center",
    justifyContent: "center",
  },
  ingredientEmoji: {
    fontSize: 18,
    lineHeight: 21,
  },
  ingredientName: {
    color: "#232736",
    fontSize: 16,
    fontFamily: FONT_FAMILY.semibold,
  },
  ingredientQuantity: {
    color: "#9AA1AF",
    fontSize: 16,
    fontFamily: FONT_FAMILY.semibold,
  },
  tabItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  stepIndex: {
    minWidth: 22,
    color: "#222535",
    fontSize: 16,
    lineHeight: 20,
    fontFamily: FONT_FAMILY.semibold,
  },
  tabItemText: {
    flex: 1,
    color: "#3F4456",
    fontSize: 16,
    lineHeight: 20,
    fontFamily: FONT_FAMILY.regular,
  },
});
