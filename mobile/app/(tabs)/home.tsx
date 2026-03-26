import { FlatList, StatusBar, View } from "react-native";
import React from "react";
import Colors from "@/shared/Colors";
import IntroHeader from "@/components/IntroHeader";
import DailyRecipeCarousel from "@/components/DailyRecipeCarousel";
import CreateRecipeBanner from "@/components/CreateRecipeBanner";
import CategoryList from "@/components/CategoryList";
import LatestRecipes from "@/components/LatestRecipes";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <FlatList
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: Colors.background,
          paddingTop: insets.top,
        }}
        ListHeaderComponent={
          <View
            style={{
              padding: 20,
              paddingBottom: 120,
              backgroundColor: Colors.background,
            }}
          >
            <IntroHeader />
            <DailyRecipeCarousel />
            <CreateRecipeBanner />
            <CategoryList />
            <LatestRecipes />
          </View>
        }
      />
    </>
  );
};

export default Home;
