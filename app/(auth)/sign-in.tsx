import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";

import { FONT_FAMILY } from "../../constants/fonts";

export default function SignIn() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#F5F4FF", "#F3F0FF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.screen}
      >
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Welcome back. Continue your cooking journey.
        </Text>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F4FF",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 40,
    color: "#191B24",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 18,
    lineHeight: 28,
    color: "#55586A",
    textAlign: "center",
    marginBottom: 26,
  },
  backButton: {
    height: 50,
    minWidth: 130,
    paddingHorizontal: 18,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8E7BE8",
  },
  backButtonText: {
    fontFamily: FONT_FAMILY.semibold,
    color: "#FFFFFF",
    fontSize: 18,
  },
});
