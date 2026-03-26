import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/shared/Colors";
import { useRouter } from "expo-router";

const RecipeCard = ({ recipe, source, categoryName }: any) => {
  const router = useRouter();

  const handlePress = () => {
    const params: any = {
      source: source,
      categoryName: categoryName,
    };

    // If recipe has an ID, use it for database fetching
    if (recipe?.id) {
      params.recipeId = recipe.id.toString();
    }
    // Otherwise, pass the recipe data as JSON (fallback for existing functionality)
    else {
      params.recipeData = JSON.stringify(recipe);
    }

    router.push({
      pathname: "/recipe-detail",
      params,
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        margin: 5,
      }}
    >
      <Image
        source={{ uri: recipe?.recipeImage || recipe?.recipe_image }}
        style={{
          width: "100%",
          height: 220,
          borderRadius: 20,
        }}
      />
      <LinearGradient
        // Background Linear Gradient
        colors={[
          "transparent",
          "rgba(0,0,0,0.8)",
          "rgba(0,0,0,0.8)",
          "rgba(0,0,0,0.8)",
        ]}
        style={{
          position: "absolute",
          bottom: 0,
          padding: 10,
          width: "100%",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <View>
          <Text
            style={{ color: Colors.white, fontFamily: "outfit", fontSize: 16 }}
          >
            {recipe?.recipeName || recipe?.recipe_name}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default RecipeCard;
