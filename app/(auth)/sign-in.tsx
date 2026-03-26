import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { FONT_FAMILY } from "../../constants/fonts";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailPasswordSignIn = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter email and password.");
      return;
    }

    Alert.alert("Sign in", "Email/password sign-in clicked.");
  };

  const handleGoogleSignIn = () => {
    Alert.alert("Google sign in", "Google sign-in clicked.");
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#EEE7FF", "#EEE7FF", "#EEE7FF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.screen}
      >
        <KeyboardAwareScrollView
          style={styles.keyboardArea}
          contentContainerStyle={styles.keyboardContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Pressable style={styles.backChip} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="#232433" />
            </Pressable>
            <Text style={styles.headerHint}>Welcome Back</Text>
          </View>

          <View style={styles.titleGroup}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>
              Continue with your account to access your saved recipes.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#A0A5B3"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#A0A5B3"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#6D7285"
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={handleEmailPasswordSignIn}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </Pressable>

            <View style={styles.dividerWrap}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={styles.googleButton} onPress={handleGoogleSignIn}>
              <Image
                source={require("../../assets/images/auth/google-logo.png")}
                style={styles.googleLogo}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>

            <View style={styles.signupPromptWrap}>
              <Text style={styles.signupPromptText}>Don't have account ? </Text>
              <Pressable onPress={() => router.push("/(auth)/sign-up")}>
                <Text style={styles.signupPromptLink}>Create an account</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#EEE7FF",
  },
  screen: {
    flex: 1,
  },
  keyboardArea: {
    flex: 1,
  },
  keyboardContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  backChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerHint: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 15,
    color: "#5E6170",
  },
  titleGroup: {
    marginTop: 26,
    marginBottom: 20,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 42,
    color: "#191B24",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 16,
    lineHeight: 24,
    color: "#55586A",
  },
  card: {
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginTop: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
    color: "#343748",
    marginBottom: 6,
  },
  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EE",
    backgroundColor: "#FAFBFF",
    paddingHorizontal: 14,
    fontFamily: FONT_FAMILY.regular,
    color: "#1A1C28",
    fontSize: 16,
  },
  passwordWrap: {
    position: "relative",
    justifyContent: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    height: 28,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    backgroundColor: "#7E64F2",
  },
  primaryButtonText: {
    fontFamily: FONT_FAMILY.semibold,
    color: "#FFFFFF",
    fontSize: 17,
  },
  dividerWrap: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E4E7F0",
  },
  dividerText: {
    marginHorizontal: 10,
    fontFamily: FONT_FAMILY.medium,
    color: "#8D92A0",
    fontSize: 12,
    letterSpacing: 0.6,
  },
  googleButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE0EC",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleLogo: {
    width: 18,
    height: 18,
  },
  googleButtonText: {
    fontFamily: FONT_FAMILY.semibold,
    color: "#242735",
    fontSize: 16,
  },
  signupPromptWrap: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupPromptText: {
    fontFamily: FONT_FAMILY.regular,
    color: "#636879",
    fontSize: 14,
  },
  signupPromptLink: {
    fontFamily: FONT_FAMILY.semibold,
    color: "#5F45D8",
    fontSize: 14,
  },
});
