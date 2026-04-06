import { useAuth, useSignUp } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { FONT_FAMILY } from "../../constants/fonts";
import {
  hideToast,
  showErrorToast,
  showPendingToast,
  showSuccessToast,
} from "../../utils/toast";

type AuthStackParamList = {
  onboarding: undefined;
  "sign-in": undefined;
  "sign-up": undefined;
};

function SignUp() {
  const { signUp } = useSignUp();
  const { signOut, isLoaded: isAuthLoaded } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, "sign-up">>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const triggerSelectionHaptic = () => {
    if (Platform.OS !== "web") {
      void Haptics.selectionAsync();
    }
  };

  const triggerSuccessHaptic = () => {
    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const triggerErrorHaptic = () => {
    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const showHapticErrorToast = (title: string, message: string) => {
    triggerErrorHaptic();
    showErrorToast(title, message);
  };

  const splitName = (fullName: string) => {
    const clean = fullName.trim().replace(/\s+/g, " ");
    if (!clean) {
      return { firstName: "", lastName: "" };
    }

    const [firstName, ...rest] = clean.split(" ");
    return { firstName, lastName: rest.join(" ") };
  };

  const buildUsernameCandidates = () => {
    const emailLocalPart = email.trim().toLowerCase().split("@")[0] ?? "";
    const normalizedFromEmail = emailLocalPart
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

    const normalizedFromName = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

    const base = (normalizedFromEmail || normalizedFromName || "cookmasteruser")
      .slice(0, 24)
      .padEnd(3, "0");

    const suffix = `${Date.now()}`.slice(-6);

    return [base, `${base}_${suffix}`];
  };

  const completeMissingFieldsIfRequired = async (): Promise<boolean> => {
    if (!isAuthLoaded || !signUp) {
      hideToast();
      showHapticErrorToast(
        "Please wait",
        "Authentication is still loading. Try again in a moment.",
      );
      return false;
    }

    if (signUp.status === "complete") {
      return true;
    }

    const missingFields = new Set(signUp.missingFields ?? []);
    const needsFirstName = missingFields.has("first_name");
    const needsLastName = missingFields.has("last_name");
    const needsUsername = missingFields.has("username");

    if (!needsFirstName && !needsLastName && !needsUsername) {
      return false;
    }

    const { firstName, lastName } = splitName(name);
    const updates: Record<string, string> = {};

    if (needsFirstName && !firstName) {
      hideToast();
      showHapticErrorToast(
        "Name required",
        "Please enter your full name to finish creating your account.",
      );
      return false;
    }

    if (needsLastName && !lastName) {
      hideToast();
      showHapticErrorToast(
        "Last name required",
        "Please include both first and last name to finish sign-up.",
      );
      return false;
    }

    if (needsFirstName) {
      updates.firstName = firstName;
    }

    if (needsLastName) {
      updates.lastName = lastName;
    }

    const applyUpdate = async (payload: Record<string, string>) => {
      const { error } = await signUp.update(payload);

      if (!error) {
        return { ok: true, retry: false };
      }

      const updateErrorCode = (error as any)?.errors?.[0]?.code;
      const updateErrorParam = (error as any)?.errors?.[0]?.meta?.paramName;

      if (
        updateErrorCode === "form_param_unknown" &&
        [
          "first_name",
          "last_name",
          "firstName",
          "lastName",
          "username",
        ].includes(updateErrorParam)
      ) {
        return { ok: true, retry: false };
      }

      const shouldRetryUsername =
        updateErrorParam === "username" &&
        (updateErrorCode === "form_identifier_exists" ||
          updateErrorCode === "form_param_format_invalid" ||
          updateErrorCode === "form_param_value_invalid");

      if (shouldRetryUsername) {
        return { ok: false, retry: true };
      }

      hideToast();
      const updateMessage =
        (error as any)?.errors?.[0]?.longMessage ??
        (error as any)?.errors?.[0]?.message ??
        "Could not save your profile details.";
      showHapticErrorToast("Sign up failed", updateMessage);
      return { ok: false, retry: false };
    };

    if (needsUsername) {
      const candidates = buildUsernameCandidates();

      for (const candidate of candidates) {
        const result = await applyUpdate({ ...updates, username: candidate });
        if (result.ok) {
          await (signUp as any).reload?.();
          return true;
        }

        if (!result.retry) {
          return false;
        }
      }

      hideToast();
      showHapticErrorToast(
        "Username unavailable",
        "Could not generate an available username. Please try again.",
      );
      return false;
    }

    const updateResult = await applyUpdate(updates);
    if (updateResult.ok) {
      await (signUp as any).reload?.();
    }
    return updateResult.ok;
  };

  const completeVerifiedSignUp = async () => {
    hideToast();

    if (!isAuthLoaded || !signUp) {
      showHapticErrorToast(
        "Please wait",
        "Authentication is still loading. Try again in a moment.",
      );
      return;
    }

    const readyToFinalize = await completeMissingFieldsIfRequired();
    if (!readyToFinalize) {
      return;
    }

    if (signUp.status !== "complete") {
      const remainingFields =
        (signUp.missingFields ?? []).join(", ") || "unknown";
      hideToast();
      showHapticErrorToast(
        "Sign up incomplete",
        `Additional required fields are still missing: ${remainingFields}.`,
      );
      return;
    }

    try {
      const finalizeResult = await signUp.finalize({
        navigate: async ({ session }) => {
          try {
            if (session?.currentTask) {
              hideToast();
              showHapticErrorToast(
                "Action required",
                "Please complete the pending account task to continue.",
              );
              return;
            }

            const clerkUserId =
              (session as any)?.user?.id ?? (signUp as any)?.createdUserId;

            if (!clerkUserId) {
              hideToast();
              showHapticErrorToast(
                "Sign up failed",
                "Could not find a Clerk user id after verification.",
              );
              return;
            }

            if (isAuthLoaded) {
              await signOut().catch((error) => {
                console.error("[sign-up] signOut after finalize failed", error);
              });
            }

            hideToast();
            triggerSuccessHaptic();
            showSuccessToast(
              "Account created",
              "Log in. Make some amazing dishes.",
            );
            navigation.replace("sign-in");
          } catch (error) {
            console.error("[sign-up] finalize navigate failed", error);
            hideToast();
            showHapticErrorToast(
              "Sign up failed",
              "Something went wrong while finishing sign-up.",
            );
          }
        },
      });

      if (finalizeResult?.error) {
        hideToast();
        const finalizeError = (finalizeResult as any)?.error;
        const finalizeMessage =
          finalizeError?.errors?.[0]?.longMessage ??
          finalizeError?.errors?.[0]?.message ??
          "Could not finalize sign-up. Please try again.";
        showHapticErrorToast("Sign up failed", finalizeMessage);
      }
    } catch (error) {
      console.error("[sign-up] finalize failed", error);
      hideToast();
      showHapticErrorToast(
        "Sign up failed",
        "Something went wrong while finishing sign-up.",
      );
    }
  };

  const getClerkErrorMessage = (error: any): string => {
    const firstError = error?.errors?.[0];
    const errorCode = firstError?.code;

    if (errorCode === "form_password_pwned") {
      return "This password was found in a known data breach. Please use a different password.";
    }

    if (
      errorCode === "form_param_unknown" &&
      firstError?.meta?.paramName === "first_name"
    ) {
      return "Sign-up request included an unsupported field. Please try again.";
    }

    if (errorCode === "form_identifier_exists") {
      return "This email is already registered in Clerk. Please log in.";
    }

    return (
      firstError?.longMessage ??
      firstError?.message ??
      "Unable to create account right now."
    );
  };

  const handleCreateAccount = async () => {
    setLoading(true);

    if (!isAuthLoaded || !signUp) {
      showHapticErrorToast(
        "Please wait",
        "Authentication is still loading. Try again in a moment.",
      );
      setLoading(false);
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      showHapticErrorToast(
        "Missing fields",
        "Please fill all fields to continue.",
      );
      setLoading(false);
      return;
    }

    showPendingToast("Creating account", "Preparing your sign-up...");

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { firstName, lastName } = splitName(name);

      if (!firstName || !lastName) {
        hideToast();
        showHapticErrorToast(
          "Full name required",
          "Please enter both first and last name.",
        );
        return;
      }

      const usernameCandidates = buildUsernameCandidates();
      let passwordResult: { error: unknown | null } | null = null;

      for (const username of usernameCandidates) {
        passwordResult = await signUp.password({
          emailAddress: normalizedEmail,
          password,
          firstName,
          lastName,
          username,
        });

        if (!passwordResult.error) {
          break;
        }

        const errorCode = (passwordResult.error as any)?.errors?.[0]?.code;
        const errorParam = (passwordResult.error as any)?.errors?.[0]?.meta
          ?.paramName;
        const isUsernameRetryable =
          errorParam === "username" &&
          (errorCode === "form_identifier_exists" ||
            errorCode === "form_param_format_invalid" ||
            errorCode === "form_param_value_invalid");

        if (!isUsernameRetryable) {
          break;
        }
      }

      if (!passwordResult || passwordResult.error) {
        console.error(JSON.stringify(passwordResult?.error, null, 2));
        showHapticErrorToast(
          "Sign up failed",
          getClerkErrorMessage(passwordResult?.error),
        );
        return;
      }

      const sendCodeResult = await signUp.verifications.sendEmailCode();
      if (sendCodeResult.error) {
        const sendCodeErrorCode = (sendCodeResult.error as any)?.errors?.[0]
          ?.code;
        if (sendCodeErrorCode === "verification_already_verified") {
          await completeVerifiedSignUp();
          return;
        }

        console.error(JSON.stringify(sendCodeResult.error, null, 2));
        showHapticErrorToast(
          "Verification failed",
          "Could not send verification code to email.",
        );
        return;
      }

      setAwaitingVerification(true);
      showSuccessToast(
        "Check your email",
        "We sent a verification code to your email.",
      );
    } catch (error) {
      console.error(error);
      showHapticErrorToast(
        "Sign up failed",
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    setLoading(true);

    if (!isAuthLoaded || !signUp) {
      showHapticErrorToast(
        "Please wait",
        "Authentication is still loading. Try again in a moment.",
      );
      setLoading(false);
      return;
    }

    if (!verificationCode.trim()) {
      showHapticErrorToast(
        "Missing code",
        "Please enter the verification code.",
      );
      setLoading(false);
      return;
    }

    showPendingToast("Verifying code", "Checking your verification code...");

    try {
      const verifyResult = await signUp.verifications.verifyEmailCode({
        code: verificationCode.trim(),
      });

      if (verifyResult.error) {
        const verifyErrorCode = (verifyResult.error as any)?.errors?.[0]?.code;
        if (verifyErrorCode === "verification_already_verified") {
          await completeVerifiedSignUp();
          return;
        }

        const verifyErrorMessage =
          (verifyResult.error as any)?.errors?.[0]?.longMessage ??
          "Please enter a valid verification code.";
        console.error(JSON.stringify(verifyResult.error, null, 2));
        hideToast();
        showHapticErrorToast("Invalid code", verifyErrorMessage);
        return;
      }

      if (__DEV__) {
        console.log("[sign-up] verification state", {
          status: signUp.status,
          missingFields: signUp.missingFields,
        });
      }

      await completeVerifiedSignUp();
    } catch (error) {
      console.error(error);
      hideToast();
      showHapticErrorToast(
        "Verification failed",
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    showPendingToast("Coming soon", "Google sign-up is not configured yet.");
    setTimeout(() => {
      hideToast();
      showHapticErrorToast(
        "Unavailable",
        "Google sign-up is not configured yet.",
      );
    }, 600);
  };

  const handleResendVerificationCode = async () => {
    setLoading(true);

    if (!isAuthLoaded || !signUp) {
      showHapticErrorToast(
        "Please wait",
        "Authentication is still loading. Try again in a moment.",
      );
      setLoading(false);
      return;
    }

    showPendingToast("Resending code", "Sending a new verification code...");

    try {
      const resendResult = await signUp.verifications.sendEmailCode();

      if (resendResult.error) {
        const resendErrorCode = (resendResult.error as any)?.errors?.[0]?.code;
        if (resendErrorCode === "verification_already_verified") {
          await completeVerifiedSignUp();
          return;
        }

        const resendErrorMessage =
          (resendResult.error as any)?.errors?.[0]?.longMessage ??
          "Could not resend verification code.";
        hideToast();
        showHapticErrorToast("Error", resendErrorMessage);
        return;
      }

      hideToast();
      showSuccessToast("Code sent", "A new verification code was sent.");
    } catch (error) {
      console.error(error);
      hideToast();
      showHapticErrorToast("Error", "Could not resend verification code.");
    } finally {
      setLoading(false);
    }
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
        <Image
          source={require("../../assets/images/common/prop.png")}
          style={styles.cardBackdropImage}
          resizeMode="contain"
        />
        <KeyboardAwareScrollView
          style={styles.keyboardArea}
          contentContainerStyle={styles.keyboardContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backChip}
              onPress={() => {
                triggerSelectionHaptic();
                navigation.goBack();
              }}
            >
              <Ionicons name="arrow-back" size={18} color="#232433" />
            </Pressable>
            <Text style={styles.headerHint}>Create Account</Text>
          </View>

          <View style={styles.titleGroup}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>
              Start your cooking journey and save your favorite recipes.
            </Text>
          </View>

          <View style={styles.card}>
            {!awaitingVerification ? (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Name</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Your full name"
                    placeholderTextColor="#A0A5B3"
                    style={styles.input}
                  />
                </View>

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
                      placeholder="Create a password"
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

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={() => {
                    triggerSelectionHaptic();
                    void handleCreateAccount();
                  }}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? "Creating..." : "Create Account"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Verification Code</Text>
                  <TextInput
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder="Enter code from email"
                    placeholderTextColor="#A0A5B3"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={() => {
                    triggerSelectionHaptic();
                    void handleVerifyEmailCode();
                  }}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? "Verifying..." : "Verify Email"}
                  </Text>
                </TouchableOpacity>

                <Pressable
                  style={styles.resendCodeButton}
                  onPress={handleResendVerificationCode}
                  disabled={loading}
                >
                  <Text style={styles.resendCodeText}>Resend code</Text>
                </Pressable>
              </>
            )}

            <View style={styles.dividerWrap}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={styles.googleButton}
              onPress={() => {
                triggerSelectionHaptic();
                handleGoogleSignUp();
              }}
            >
              <Image
                source={require("../../assets/images/auth/google-logo.png")}
                style={styles.googleLogo}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>

            <View style={styles.loginPromptWrap}>
              <Text style={styles.loginPromptText}>
                Already have an account ?{" "}
              </Text>
              <Pressable
                onPress={() => {
                  triggerSelectionHaptic();
                  navigation.goBack();
                }}
              >
                <Text style={styles.loginPromptLink}>Log in</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </View>
  );
}

export default SignUp;

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
    marginBottom: 20,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 42,
    color: "#191B24",
    bottom: 10,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 16,
    lineHeight: 24,
    color: "#55586A",
    bottom: 5,
  },
  cardBackdropImage: {
    position: "absolute",
    top: 706,
    right: -106,
    tintColor: "#C3B2FF",
    width: 300,
    height: 300,
    zIndex: 0,
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
    bottom: 15,
    zIndex: 1,
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
  buttonDisabled: {
    opacity: 0.7,
  },
  resendCodeButton: {
    marginTop: 12,
    alignItems: "center",
  },
  resendCodeText: {
    fontFamily: FONT_FAMILY.semibold,
    color: "#5F45D8",
    fontSize: 14,
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
  loginPromptWrap: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginPromptText: {
    fontFamily: FONT_FAMILY.regular,
    color: "#636879",
    fontSize: 14,
  },
  loginPromptLink: {
    fontFamily: FONT_FAMILY.semibold,
    color: "#5F45D8",
    fontSize: 14,
  },
});
