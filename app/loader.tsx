import { useAuth } from "@clerk/expo";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

type RootStackParamList = {
  index: undefined;
  loader: undefined;
  "(auth)": undefined;
  "(tabs)": undefined;
  categoryRecipe: undefined;
  recipeDetails: undefined;
};

export default function Loader() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // User is logged in, navigate to home
      navigation.replace("(tabs)");
    } else {
      // User not logged in, show onboarding
      navigation.replace("(auth)");
    }
  }, [isLoaded, isSignedIn, navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/images/onboarding/loader.json")}
        autoPlay
        loop
        renderMode="AUTOMATIC"
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D0C4FF",
  },
  animation: {
    width: 300,
    height: 300,
  },
});
