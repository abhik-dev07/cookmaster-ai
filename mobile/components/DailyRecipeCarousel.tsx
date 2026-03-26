import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/shared/Colors";
import RecipeService from "@/services/RecipeService";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = 200;
const SPACING = 16;

interface Recipe {
  id: number;
  recipe_name: string;
  description: string;
  ingredients: any[];
  steps: any[];
  calories: number;
  cook_time: number;
  serve_to: number;
  image_prompt: string;
  category: string;
  recipe_image: string;
  user_email: string;
  likes: number;
  created_at: string;
  updated_at: string;
}

const PaginationDot = ({
  index,
  scrollX,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const inputRange = [
    (CARD_WIDTH + SPACING) * (index - 1),
    (CARD_WIDTH + SPACING) * index,
    (CARD_WIDTH + SPACING) * (index + 1),
  ];

  const dotStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1.4, 0.8],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 28, 8],
      Extrapolate.CLAMP
    );
    const borderWidth = interpolate(
      scrollX.value,
      inputRange,
      [1, 0, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
      width,
      borderWidth,
      borderColor: "rgba(0,0,0,0.2)",
    };
  });

  const gradientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  return (
    <Animated.View style={[styles.paginationDot, dotStyle]}>
      <Animated.View style={[styles.paginationGradient, gradientStyle]}>
        <LinearGradient
          colors={["#4CAF50", "#2E7D32"]}
          style={styles.paginationGradient}
        />
      </Animated.View>
    </Animated.View>
  );
};

const DailyRecipeCarousel = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<any>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  useEffect(() => {
    checkOrFetchDailyRecipes();
  }, []);

  useEffect(() => {
    if (recipes.length > 1) {
      setCurrentIndex(0);
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: 0, animated: false });
      }, 100);
    }
  }, [recipes]);

  useEffect(() => {
    if (recipes.length > 1 && !isUserScrolling) {
      const timer = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % recipes.length;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * (CARD_WIDTH + SPACING),
          animated: true,
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isUserScrolling, recipes.length]);

  const checkOrFetchDailyRecipes = async () => {
    try {
      setLoading(true);
      const today = new Date().toDateString();
      const lastFetchedDate = await AsyncStorage.getItem("lastFetchedDate");

      if (lastFetchedDate === today) {
        const stored = await AsyncStorage.getItem("storedRecipes");
        const parsed = stored ? JSON.parse(stored) : [];
        setRecipes(parsed);
        console.log("Loaded cached recipes");
      } else {
        const result = await RecipeService.getRandomRecipes(3);
        if (result.error) {
          setError(result.error);
          return;
        }
        setRecipes(result.data);
        await AsyncStorage.setItem(
          "storedRecipes",
          JSON.stringify(result.data)
        );
        await AsyncStorage.setItem("lastFetchedDate", today);
        console.log("Fetched and stored new recipes for today");
      }
    } catch (error) {
      console.error("Error loading recipes:", error);
      setError("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = (recipe: Recipe) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/recipe-detail",
      params: { recipeId: recipe.id.toString() },
    });
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + SPACING));
    setCurrentIndex(index);
    setIsUserScrolling(true);
    setTimeout(() => setIsUserScrolling(false), 3000);
  };

  const renderRecipeCard = (recipe: Recipe) => (
    <View key={recipe.id} style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleRecipePress(recipe)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.recipe_image }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageOverlay}
          />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{recipe.category}</Text>
          </View>
          <Text style={styles.recipeTitle} numberOfLines={2}>
            {recipe.recipe_name}
          </Text>
          <Text style={styles.recipeDescription} numberOfLines={2}>
            {recipe.description}
          </Text>
          <View style={styles.recipeStats}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={14} color={Colors.white} />
              <Text style={styles.statText}>{recipe.cook_time} min</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={14} color={Colors.white} />
              <Text style={styles.statText}>{recipe.calories} cal</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={14} color={Colors.white} />
              <Text style={styles.statText}>{recipe.serve_to} serves</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (loading || error || recipes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Picks</Text>
          <Text style={styles.subtitle}>Discover amazing recipes</Text>
        </View>
        <View style={loading ? styles.loadingContainer : styles.errorContainer}>
          {loading ? (
            <>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading daily picks...</Text>
            </>
          ) : (
            <>
              <Ionicons
                name="restaurant-outline"
                size={40}
                color={Colors.textLight}
              />
              <Text style={styles.errorText}>
                {error || "No recipes available"}
              </Text>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <LinearGradient
            colors={["#FF6B6B", "#FF8E53"]}
            style={styles.titleGradient}
          >
            <Ionicons name="star" size={20} color={Colors.white} />
          </LinearGradient>
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>Daily Picks</Text>
            <Text style={styles.subtitle}>Discover amazing recipes</Text>
          </View>
        </View>
      </View>

      <View style={styles.carouselContainer}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScroll}
          onScrollBeginDrag={() => setIsUserScrolling(true)}
          onScrollEndDrag={() =>
            setTimeout(() => setIsUserScrolling(false), 3000)
          }
        >
          {recipes.map(renderRecipeCard)}
        </Animated.ScrollView>

        <View style={styles.paginationContainer}>
          {recipes.map((_, index) => (
            <PaginationDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  header: { marginBottom: 16 },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titleGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  titleTextContainer: { flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginTop: 2,
  },
  carouselContainer: { position: "relative" },
  scrollContent: { paddingHorizontal: 22 },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: SPACING,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 20,
    overflow: "hidden",
  },
  imageContainer: { flex: 1, position: "relative" },
  recipeImage: { width: "100%", height: "100%" },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
    fontFamily: "outfit",
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
    fontFamily: "outfit-bold",
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "outfit",
    marginBottom: 12,
    lineHeight: 18,
  },
  recipeStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: "outfit",
  },
  loadingContainer: {
    height: CARD_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: "outfit",
  },
  errorContainer: {
    height: CARD_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 10,
    paddingHorizontal: 20,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.active,
    overflow: "hidden",
  },
  paginationGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
  },
});

export default DailyRecipeCarousel;
