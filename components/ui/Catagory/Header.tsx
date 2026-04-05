import { FONT_FAMILY } from "@/constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import {
  type RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import {
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RootStackParamList = {
  "(tabs)": undefined;
  categoryRecipe: {
    categoryId: string;
    categoryName: string;
  };
};

type CategoryRecipeRouteProp = RouteProp<RootStackParamList, "categoryRecipe">;
type CategoryRecipeNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "categoryRecipe"
>;

export default function Header() {
  const navigation = useNavigation<CategoryRecipeNavigationProp>();
  const route = useRoute<CategoryRecipeRouteProp>();
  const categoryName = route.params?.categoryName ?? "Category";

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );

      return () => backHandler.remove();
    }, []),
  );

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("(tabs)");
  };

  return (
    <View>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          onPress={() => {
            if (Platform.OS !== "web") {
              void Haptics.selectionAsync();
            }

            handleBack();
          }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#232433"
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text numberOfLines={1} pointerEvents="none" style={styles.headerTitle}>
          {categoryName} Recipes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 18,
    minHeight: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.86)",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  backIcon: {
    textAlign: "center",
    lineHeight: 24,
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 24,
    color: "#11121C",
    fontWeight: "700",
    paddingHorizontal: 64,
    fontFamily: FONT_FAMILY.medium,
  },
});
