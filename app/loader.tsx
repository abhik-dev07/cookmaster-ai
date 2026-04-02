import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function Loader() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // User is logged in, navigate to home
      router.replace("/(tabs)/home");
    } else {
      // User not logged in, show onboarding
      router.replace("/(auth)/onboarding");
    }
  }, [isLoaded, isSignedIn, router]);

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
