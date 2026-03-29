import Category from "@/components/ui/Home/Category";
import Feature from "@/components/ui/Home/Feature";
import Header from "@/components/ui/Home/Header";
import SearchArea from "@/components/ui/Home/SearchArea";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <SearchArea />

        <Category />

        <Feature />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingTop: 8,
    paddingBottom: 120,
  },
});
