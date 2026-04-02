import { ScrollView, StyleSheet, View } from "react-native";

import History from "@/components/ui/Cooking/History";
import InputCard from "@/components/ui/Cooking/InputCard";

const INGREDIENTS = [
  "Milk",
  "Egg",
  "Onion",
  "Potato",
  "Add ingredient",
] as const;

export default function CookingScreen() {
  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <InputCard />
        {/* <Upgrade /> */}
        <History />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 130,
    gap: 27,
  },
});
