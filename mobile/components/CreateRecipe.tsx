import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useRef, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/shared/Colors";
import GlobalApi from "@/services/GlobalApi";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import LoadingDialog from "./LoadingDialog";
import { UserContext } from "@/context/UserContext";
import Prompt from "./../services/Prompt";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import RecipeService from "@/services/RecipeService";

interface CreateRecipeProps {
  selectedCategory?: string;
  selectedQuickAction?: string;
  shortHint?: boolean;
}

const CreateRecipe = ({
  selectedCategory,
  selectedQuickAction,
  shortHint = false,
}: CreateRecipeProps) => {
  const { user, isVegMode, setUser } = useContext(UserContext);
  const [userInput, setUserInput] = useState<string>("");
  const [recipeOptions, setRecipeOptions] = useState<any | null>([]);
  const [loading, setLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [openLoading, setOpenLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingFullRecipe, setIsGeneratingFullRecipe] = useState(false);
  const router = useRouter();

  // Non-vegetarian items list for validation
  const nonVegItems = [
    "chicken",
    "beef",
    "pork",
    "lamb",
    "mutton",
    "fish",
    "shrimp",
    "prawn",
    "crab",
    "lobster",
    "duck",
    "turkey",
    "bacon",
    "ham",
    "sausage",
    "pepperoni",
    "salmon",
    "tuna",
    "cod",
    "sardine",
    "anchovy",
    "oyster",
    "mussel",
    "clam",
    "squid",
    "octopus",
    "meat",
    "seafood",
    "poultry",
    "egg",
    "eggs",
  ];

  // Check for non-veg items in user input
  const checkNonVegItems = (
    input: string
  ): { hasNonVeg: boolean; items: string[] } => {
    const lowerInput = input.toLowerCase();
    const foundItems = nonVegItems.filter((item) =>
      lowerInput.includes(item.toLowerCase())
    );
    return {
      hasNonVeg: foundItems.length > 0,
      items: foundItems,
    };
  };

  // Generate comprehensive prompt based on available inputs
  const generatePrompt = (): string => {
    let promptParts: string[] = [];

    // Add user input if available
    if (userInput && userInput.trim()) {
      promptParts.push(`User Request: ${userInput.trim()}`);
    }

    // Add selected category if available
    if (selectedCategory) {
      promptParts.push(`Category: ${selectedCategory}`);
    }

    // Add quick action if available
    if (selectedQuickAction) {
      promptParts.push(`Quick Action: ${selectedQuickAction}`);
    }

    // Add dietary preference
    if (isVegMode) {
      promptParts.push(
        "Dietary Preference: Vegetarian (strictly no meat, fish, poultry, eggs, or any non-vegetarian ingredients)"
      );
    } else {
      promptParts.push("Dietary Preference: No restrictions");
    }

    // Combine all parts
    const combinedPrompt = promptParts.join(". ");

    return combinedPrompt + " " + Prompt.GENERATE_RECIPE_OPTION_PROMPT;
  };

  const OnGenerate = async () => {
    if (isGenerating) return;

    // Check if we have any input (user input, category, or quick action)
    if (!userInput?.trim() && !selectedCategory && !selectedQuickAction) {
      Alert.alert(
        "Input Required",
        "Please enter recipe details, select a category, or choose a quick action to generate recipes."
      );
      return;
    }

    // Check for non-veg items when in veg mode
    if (isVegMode && userInput?.trim()) {
      const nonVegCheck = checkNonVegItems(userInput);
      if (nonVegCheck.hasNonVeg) {
        const itemText = nonVegCheck.items.length === 1 ? "item" : "items";
        const itemsList = nonVegCheck.items.join(", ");
        Alert.alert(
          "Vegetarian Mode Active",
          `You're in vegetarian mode, but your request includes non-vegetarian ${itemText}: ${itemsList}. Please remove these ${itemText} or switch to non-vegetarian mode.`
        );
        return;
      }
    }

    setIsGenerating(true);
    setLoading(true);

    try {
      const prompt = generatePrompt();
      console.log("Generated prompt:", prompt);

      const result = await GlobalApi.AiModel(prompt);
      const extractJson =
        result.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const jsonMatch = extractJson.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error("AI response does not contain JSON");
      }
      const jsonString = jsonMatch[1];
      const parsedJsonResp = JSON.parse(jsonString || "{}");
      console.log("AI Response:", parsedJsonResp);

      // Validate that generated recipes are vegetarian if in veg mode
      if (isVegMode && Array.isArray(parsedJsonResp)) {
        const filteredRecipes = parsedJsonResp.filter((recipe) => {
          const recipeText = `${recipe.recipeName} ${
            recipe.description
          } ${JSON.stringify(recipe)}`.toLowerCase();
          return !nonVegItems.some((item) =>
            recipeText.includes(item.toLowerCase())
          );
        });

        if (filteredRecipes.length === 0) {
          throw new Error(
            "No suitable vegetarian recipes found. Please try different ingredients or keywords."
          );
        }

        setRecipeOptions(filteredRecipes);
      } else {
        setRecipeOptions(parsedJsonResp);
      }

      actionSheetRef.current?.show();
    } catch (error) {
      console.error("Error generating options", error);
      Alert.alert(
        "Generation Error",
        "Failed to generate recipe options. Please try again with different inputs."
      );
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const GenerateCompleteRecipe = async (option: any) => {
    if (isGeneratingFullRecipe) return;

    console.log("Starting GenerateCompleteRecipe...");
    actionSheetRef.current?.hide();
    setLoadingMessage("Generating complete recipe...");
    setOpenLoading(true);
    setIsGeneratingFullRecipe(true);

    // Small delay to ensure loading dialog shows up
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      let completePrompt = `RecipeName: ${option.recipeName}. Description: ${option?.description}`;

      // Add dietary restrictions to complete recipe prompt
      if (isVegMode) {
        completePrompt +=
          ". IMPORTANT: This must be a completely vegetarian recipe with no meat, fish, poultry, eggs, or any non-vegetarian ingredients whatsoever.";
      }

      // Add context from original selections
      if (selectedCategory) {
        completePrompt += `. Category Context: ${selectedCategory}`;
      }
      if (selectedQuickAction) {
        completePrompt += `. Quick Action Context: ${selectedQuickAction}`;
      }
      if (userInput?.trim()) {
        completePrompt += `. User Requirements: ${userInput.trim()}`;
      }

      completePrompt += " " + Prompt.GENERATE_COMPLETE_RECIPE_PROMPT;

      const result = await GlobalApi.AiModel(completePrompt);

      const extractJson =
        result.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const jsonMatch = extractJson.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error("AI response does not contain JSON");
      }
      const jsonString = jsonMatch[1];
      const parsedJsonResp = JSON.parse(jsonString || "{}");

      // Final validation for vegetarian mode
      if (isVegMode) {
        const recipeContent = JSON.stringify(parsedJsonResp).toLowerCase();
        const hasNonVegContent = nonVegItems.some((item) =>
          recipeContent.includes(item.toLowerCase())
        );

        if (hasNonVegContent) {
          throw new Error(
            "Generated recipe contains non-vegetarian ingredients. Please try again."
          );
        }
      }

      console.log("Complete recipe generated:", parsedJsonResp);

      setLoadingMessage("Generating recipe image...");
      console.log("Generating recipe image...");
      const imageUrl = await GenerateRecipeAiImage(parsedJsonResp.imagePrompt);
      setLoadingMessage("Saving recipe to database...");
      console.log("Saving recipe to database...");
      const insertedRecordResult = await SaveDb(parsedJsonResp, imageUrl);
      console.log("Recipe saved successfully:", insertedRecordResult);

      if (insertedRecordResult?.id) {
        router.push({
          pathname: "/recipe-detail",
          params: {
            recipeId: insertedRecordResult.id.toString(),
          },
        });
      } else {
        throw new Error("Failed to get recipe ID after creation");
      }
    } catch (error) {
      console.error("Error generating complete recipe:", error);
      Alert.alert("Error", "Failed to generate recipe. Please try again.");
    } finally {
      // Ensure loading states are always cleared
      setLoadingMessage("Loading...");
      console.log("Cleaning up loading states...");
      setOpenLoading(false);
      setIsGeneratingFullRecipe(false);
      console.log("Loading states cleared");
    }
  };

  const GenerateRecipeAiImage = async (imagePrompt: string) => {
    try {
      // Add vegetarian context to image prompt if in veg mode
      let finalImagePrompt = imagePrompt;
      if (isVegMode) {
        finalImagePrompt +=
          " (vegetarian food only, no meat or non-vegetarian ingredients visible)";
      }

      const response = await GlobalApi.RecipeImageApi.post("/image/generate", {
        prompt: finalImagePrompt,
      });
      console.log("Image generated successfully:", response.data.imageUrl);
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error generating recipe image:", error);
      throw new Error("Failed to generate recipe image");
    }
  };

  const SaveDb = async (parsedJsonResp: any, imageUrl: string) => {
    try {
      // Validate user data
      if (!user?.email || !user?.id) {
        throw new Error("User data is incomplete. Please sign in again.");
      }

      const data = {
        ...parsedJsonResp,
        recipeImage: imageUrl,
        userEmail: user.email,
      };

      console.log("Saving recipe to database:", JSON.stringify(data, null, 2));

      // Use RecipeService for better error handling and validation
      const result = await RecipeService.createRecipe(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to create recipe");
      }

      console.log("Recipe saved successfully:", result.data);
      return result.data;
    } catch (error: any) {
      console.error("Error saving recipe to database:", error);

      // Show user-friendly error message
      const errorMessage = error.message || "Unknown error occurred";
      Alert.alert(
        "Recipe Save Error",
        `Failed to save recipe: ${errorMessage}`
      );
      throw error;
    }
  };

  // Cleanup loading states on unmount
  useEffect(() => {
    return () => {
      setOpenLoading(false);
      setIsGenerating(false);
      setIsGeneratingFullRecipe(false);
      setLoadingMessage("Loading...");
    };
  }, []);

  // Debug loading state changes
  useEffect(() => {
    console.log(
      "Loading state changed - openLoading:",
      openLoading,
      "loadingMessage:",
      loadingMessage
    );
  }, [openLoading, loadingMessage]);

  // Get context display text
  const getContextDisplay = () => {
    const contexts = [];
    if (selectedCategory) contexts.push(`Category: ${selectedCategory}`);
    if (selectedQuickAction) contexts.push(`Action: ${selectedQuickAction}`);
    return contexts.length > 0 ? contexts.join(" • ") : null;
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"] as [string, string]}
            style={styles.iconGradient}
          >
            <Ionicons name="sparkles" size={28} color={Colors.white} />
          </LinearGradient>
        </View>
        <Text style={styles.title}>AI Recipe Generator</Text>
        <Text style={styles.subtitle}>
          Describe what you want to cook and let AI create amazing recipes for
          you
        </Text>

        {/* Vegetarian Mode Indicator */}
        {isVegMode && (
          <View style={styles.vegModeIndicator}>
            <Ionicons name="leaf" size={16} color="#4CAF50" />
            <Text style={styles.vegModeText}>Vegetarian Mode Active</Text>
          </View>
        )}
      </View>

      {/* Context Display */}
      {getContextDisplay() && (
        <View style={styles.contextSection}>
          <Text style={styles.contextLabel}>Selected Options:</Text>
          <Text style={styles.contextText}>{getContextDisplay()}</Text>
        </View>
      )}

      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            value={userInput}
            onChangeText={(value) => setUserInput(value)}
            placeholder={`What would you like to cook? ${
              isVegMode
                ? "Include vegetarian ingredients, cuisine type, or preferences..."
                : "Include ingredients, cuisine type, or preferences..."
            }`}
            placeholderTextColor={Colors.textLight}
            textAlignVertical="top"
          />
          <View style={styles.inputFooter}>
            <Ionicons name="bulb" size={16} color={Colors.textLight} />
            <Text style={styles.inputHint}>
              {shortHint
                ? "Be specific for better results."
                : "Be specific for better results. You can combine text input with category and quick action selections for optimal results."}
            </Text>
          </View>
        </View>
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[
          styles.generateButton,
          loading && styles.generateButtonDisabled,
        ]}
        onPress={OnGenerate}
        disabled={loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#4CAF50", "#2E7D32"] as [string, string]}
          style={styles.generateButtonGradient}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color={Colors.white} />
              <Text style={styles.generateButtonText}>Generate Recipe</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Recipe Options Action Sheet */}
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.actionSheetContainer}
        indicatorStyle={styles.actionSheetIndicator}
        gestureEnabled={true}
        closeOnPressBack={true}
        closeOnTouchBackdrop={true}
        defaultOverlayOpacity={0.3}
      >
        <View style={styles.actionSheetContent}>
          <View style={styles.actionSheetHeader}>
            <View style={styles.actionSheetIconContainer}>
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"] as [string, string]}
                style={styles.actionSheetIconGradient}
              >
                <Ionicons name="restaurant" size={24} color={Colors.white} />
              </LinearGradient>
            </View>
            <View style={styles.actionSheetTextContainer}>
              <Text style={styles.actionSheetTitle}>Choose Your Recipe</Text>
              <Text style={styles.actionSheetSubtitle}>
                Select the recipe you'd like to create
                {isVegMode && " • Vegetarian recipes only"}
              </Text>
            </View>
          </View>

          <View style={styles.recipeOptionsContainer}>
            {Array.isArray(recipeOptions) && recipeOptions.length > 0 ? (
              recipeOptions.map((item: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recipeOptionCard}
                  onPress={() => GenerateCompleteRecipe(item)}
                  activeOpacity={0.8}
                >
                  <View style={styles.recipeOptionContent}>
                    <View style={styles.recipeOptionHeader}>
                      <Text style={styles.recipeOptionTitle}>
                        {item?.recipeName || item?.title || "Unnamed Recipe"}
                      </Text>
                      {isVegMode && (
                        <Ionicons name="leaf" size={16} color="#4CAF50" />
                      )}
                    </View>
                    <Text style={styles.recipeOptionDescription}>
                      {item?.description || "No description available"}
                    </Text>
                  </View>
                  <View style={styles.recipeOptionArrow}>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.gray}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <LinearGradient
                  colors={["#BDBDBD", "#9E9E9E"] as [string, string]}
                  style={styles.emptyStateIconGradient}
                >
                  <Ionicons name="restaurant" size={40} color={Colors.white} />
                </LinearGradient>
                <Text style={styles.emptyStateTitle}>No Recipes Found</Text>
                <Text style={styles.emptyStateText}>
                  Try adjusting your description or ingredients
                </Text>
              </View>
            )}
          </View>
        </View>
      </ActionSheet>

      {/* Loading Dialog */}
      <LoadingDialog loading={openLoading} title={loadingMessage} />
    </View>
  );
};

export default CreateRecipe;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
    lineHeight: 22,
  },
  vegModeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
    gap: 6,
  },
  vegModeText: {
    fontSize: 13,
    color: "#4CAF50",
    fontFamily: "outfit",
    fontWeight: "500",
  },
  contextSection: {
    backgroundColor: Colors.grayLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contextLabel: {
    fontSize: 13,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginBottom: 4,
  },
  contextText: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: "outfit",
    fontWeight: "500",
  },
  inputSection: {
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    padding: 20,
    fontSize: 16,
    color: Colors.text,
    fontFamily: "outfit",
    minHeight: 120,
  },
  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    paddingTop: 0,
    backgroundColor: Colors.grayLight,
  },
  inputHint: {
    fontSize: 13,
    color: Colors.textLight,
    fontFamily: "outfit",
    flex: 1,
  },
  generateButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  generateButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    gap: 12,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "outfit",
  },
  actionSheetContainer: {
    padding: 24,
  },
  actionSheetContent: {
    paddingBottom: 32,
  },
  actionSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  actionSheetIconContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionSheetIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  actionSheetTextContainer: {
    flex: 1,
  },
  actionSheetIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textLight,
    opacity: 0.6,
    marginBottom: 20,
  },
  actionSheetTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 4,
  },
  actionSheetSubtitle: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
  },
  recipeOptionsContainer: {
    gap: 16,
  },
  recipeOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeOptionContent: {
    flex: 1,
  },
  recipeOptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  recipeOptionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
    fontFamily: "outfit-bold",
    flex: 1,
  },
  recipeOptionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: "outfit",
    lineHeight: 20,
  },
  recipeOptionArrow: {
    marginLeft: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
    lineHeight: 22,
  },
});
