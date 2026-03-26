import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Colors from "@/shared/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "@/context/UserContext";
import { useSavedRecipesStore } from "@/services/useSavedRecipesStore";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const RecipeIntro = ({ recipe }: any) => {
  const { user } = useContext(UserContext);
  const { fetchSavedRecipes, saveRecipe, removeRecipe, savedRecipes } =
    useSavedRecipesStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(true);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  useEffect(() => {
    if (user?.email) {
      fetchSavedRecipes(user.email);
    }
  }, [user, fetchSavedRecipes]);

  // Component mount/unmount tracking
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      scaleAnim.stopAnimation();
      rotateAnim.stopAnimation();
      messageAnim.stopAnimation();
    };
  }, [scaleAnim, rotateAnim, messageAnim]);

  // Get the current saved state directly from the store
  // Adding savedRecipes as dependency to ensure re-render when store updates
  const recipeId = recipe?.id?.toString() || recipe?.documentId;
  const isSaved = recipeId ? savedRecipes.includes(recipeId) : false;

  const showSuccessMessage = useCallback(
    (text: string) => {
      if (isAnimating.current || !isMounted) return; // Prevent multiple animations or updates on unmounted component

      isAnimating.current = true;
      setMessage(text);
      setShowMessage(true);

      // Stop any existing animation
      messageAnim.stopAnimation();
      messageAnim.setValue(0);

      Animated.sequence([
        Animated.timing(messageAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(messageAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowMessage(false);
        isAnimating.current = false;
      });
    },
    [messageAnim, isMounted]
  );

  const handleToggleSave = useCallback(async () => {
    if (!user?.email || isLoading || !recipeId || isAnimating.current) return;

    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Animate button press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate icon rotation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        rotateAnim.setValue(0);
      });

      if (isSaved) {
        await removeRecipe(user.email, recipeId);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showSuccessMessage("Removed from favorites");
      } else {
        await saveRecipe(user.email, recipeId);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showSuccessMessage("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showSuccessMessage("Failed to update recipe");
    } finally {
      setIsLoading(false);
    }
  }, [
    user?.email,
    isLoading,
    recipeId,
    isSaved,
    removeRecipe,
    saveRecipe,
    showSuccessMessage,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe?.recipeImage || recipe?.recipe_image }}
          style={styles.recipeImage}
        />
        <Animated.View
          style={[
            styles.saveButton,
            {
              transform: [
                { scale: scaleAnim },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          {isSaved && (
            <View style={styles.savedIndicator}>
              <Ionicons name="checkmark" size={12} color={Colors.white} />
            </View>
          )}
          <TouchableOpacity
            onPress={handleToggleSave}
            activeOpacity={0.8}
            disabled={isLoading || isAnimating.current}
            style={styles.saveButtonTouchable}
            accessibilityLabel={
              isSaved ? "Remove from favorites" : "Add to favorites"
            }
            accessibilityHint={
              isSaved
                ? "Double tap to remove this recipe from your favorites"
                : "Double tap to save this recipe to your favorites"
            }
          >
            {isLoading || isAnimating.current ? (
              <ActivityIndicator
                size="small"
                color={isSaved ? Colors.white : Colors.primary}
              />
            ) : (
              <LinearGradient
                colors={
                  isSaved
                    ? (["#4CAF50", "#2E7D32"] as [string, string])
                    : (["#FFFFFF", "#F5F5F5"] as [string, string])
                }
                style={styles.saveButtonGradient}
              >
                <Ionicons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={24}
                  color={isSaved ? Colors.white : Colors.text}
                />
              </LinearGradient>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Success Message */}
      {showMessage && (
        <Animated.View
          style={[
            styles.successMessage,
            {
              opacity: messageAnim,
              transform: [
                {
                  translateY: messageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"] as [string, string]}
            style={styles.successMessageGradient}
          >
            <Ionicons name="checkmark-circle" size={16} color={Colors.white} />
            <Text style={styles.successMessageText}>{message}</Text>
          </LinearGradient>
        </Animated.View>
      )}

      <View style={styles.content}>
        <Text style={styles.recipeName}>
          {recipe.recipeName || recipe.recipe_name}
        </Text>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{recipe.description}</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="leaf" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureValue}>{recipe?.calories} Cal</Text>
              <Text style={styles.featureLabel}>Calories</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="timer" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureValue}>
                {recipe?.cookTime || recipe?.cook_time} Min
              </Text>
              <Text style={styles.featureLabel}>Time</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="people" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureValue}>
                {recipe?.serveTo || recipe?.serve_to} Serve
              </Text>
              <Text style={styles.featureLabel}>Serve</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecipeIntro;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: 240,
    borderRadius: 20,
  },
  saveButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButtonTouchable: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  savedIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.white,
    zIndex: 1,
  },
  successMessage: {
    position: "absolute",
    top: 185,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  successMessageGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successMessageText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "outfit",
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  recipeName: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    color: Colors.text,
    marginBottom: 15,
    lineHeight: 30,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 22,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  featureCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.grayLight,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 80,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureContent: {
    alignItems: "center",
  },
  featureValue: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  featureLabel: {
    fontFamily: "outfit",
    fontSize: 13,
    color: Colors.textLight,
    textAlign: "center",
  },
});
