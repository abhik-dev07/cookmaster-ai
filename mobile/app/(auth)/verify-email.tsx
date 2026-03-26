import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useState, useContext } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import Colors from "@/shared/Colors";
import { UserContext } from "@/context/UserContext";
import UserService from "@/services/UserService";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface VerifyEmailProps {
  email: string;
  username: string;
  onBack: () => void;
}
const { height } = Dimensions.get("window");

const VerifyEmail = ({ email, username, onBack }: VerifyEmailProps) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { setUser } = useContext(UserContext)!;
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        // Set the active session
        await setActive({ session: signUpAttempt.createdSessionId });

        // Store user email in AsyncStorage for API authentication
        await AsyncStorage.setItem("user_email", email);

        // Store user data in database after successful verification
        try {
          const userData = await UserService.handleUserVerification(
            email,
            username
          );

          // Update user context with the stored user data
          if (userData) {
            setUser(userData);
            console.log("User verified and stored successfully:", userData);
          } else {
            throw new Error("Failed to create user data");
          }

          // Navigate to home screen
          router.replace("/(tabs)/home");
        } catch (dbError) {
          console.error("Database error:", dbError);

          // Create a temporary user object for the session
          const tempUser = {
            id: 0, // Temporary ID
            email,
            name: username, // Store username in name field
            picture: "",
            credits: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          setUser(tempUser);

          Alert.alert(
            "Warning",
            "Account created but there was an issue saving your profile. You can update it later."
          );
          // Still navigate to home even if database save fails
          router.replace("/(tabs)/home");
        }
      } else {
        Alert.alert("Error", "Verification failed. Please try again.");
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      const message =
        (err as any)?.errors?.[0]?.message || "Verification failed";
      Alert.alert("Error", message);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
      showsVerticalScrollIndicator={false}
    >
      <View style={verificationStyles.container}>
        {/* Image Container */}
        <View style={verificationStyles.imageContainer}>
          <Image
            source={require("../../assets/images/verification.png")}
            style={verificationStyles.image}
            contentFit="contain"
          />
        </View>

        {/* Title */}
        <Text style={verificationStyles.title}>Verify Your Email</Text>
        <Text style={verificationStyles.subtitle}>
          We&apos;ve sent a verification code to {email}
        </Text>

        <View style={verificationStyles.formContainer}>
          {/* Verification Code Input */}
          <View style={verificationStyles.inputContainer}>
            <TextInput
              style={verificationStyles.textInput}
              placeholder="Enter verification code"
              placeholderTextColor={Colors.textLight}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              verificationStyles.authButton,
              loading && verificationStyles.buttonDisabled,
            ]}
            onPress={handleVerification}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={verificationStyles.buttonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>

          {/* Back to Sign Up */}
          <TouchableOpacity
            style={verificationStyles.linkContainer}
            onPress={onBack}
          >
            <Text style={verificationStyles.linkText}>
              <Text style={verificationStyles.link}>Back to Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default VerifyEmail;

const verificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: "center",
    paddingTop: 40,
  },

  imageContainer: {
    height: height * 0.3,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  image: {
    width: 320,
    height: 320,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
    position: "relative",
  },
  textInput: {
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
  },
  authButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    textAlign: "center",
  },
  linkContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  linkText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  link: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
