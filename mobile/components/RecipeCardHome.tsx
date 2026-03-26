import { Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/shared/Colors";
import { useRouter } from "expo-router";

const RecipeCardHome = ({ recipe, source }: any) => {
  const router = useRouter();

  const handlePress = () => {
    const params: any = {
      source: source,
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
      style={{
        margin: 5,
      }}
      onPress={handlePress}
    >
      <Image
        source={{ uri: recipe?.recipeImage || recipe?.recipe_image }}
        style={{
          width: 220,
          height: 140,
          borderRadius: 15,
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
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}
      >
        <Text
          style={{
            color: Colors.white,
            fontFamily: "outfit",
            fontSize: 16,
          }}
        >
          {recipe?.recipeName || recipe?.recipe_name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default RecipeCardHome;
