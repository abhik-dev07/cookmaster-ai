import { UserContext } from "@/context/UserContext";
import {
  hideToast,
  showErrorToast,
  showPendingToast,
  showSuccessToast,
} from "@/utils/toast";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FONT_FAMILY } from "../../../constants/fonts";

type ProfileActionsSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

type RootStackParamList = {
  index: undefined;
  loader: undefined;
  "(auth)": undefined;
  "(tabs)": undefined;
  categoryRecipe: undefined;
  recipeDetails: undefined;
};

async function clearLocalSession() {
  await Promise.all([
    SecureStore.deleteItemAsync("user_session"),
    SecureStore.deleteItemAsync("user_context"),
  ]);
}

export default function ProfileActionsSheet({
  isOpen,
  onClose,
}: ProfileActionsSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { setUser } = useContext(UserContext);
  const [loadingAction, setLoadingAction] = useState<
    "signOut" | "delete" | null
  >(null);

  const snapPoints = useMemo(() => ["35%"], []);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.present();
      return;
    }

    sheetRef.current?.dismiss();
  }, [isOpen]);

  const triggerHaptic = (type: "selection" | "medium" | "warning") => {
    if (Platform.OS === "web") {
      return;
    }

    if (type === "selection") {
      void Haptics.selectionAsync();
      return;
    }

    if (type === "warning") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.4}
      />
    ),
    [],
  );

  const navigateToOnboarding = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: "(auth)" }],
    });
  }, [navigation]);

  const handleSignOut = async () => {
    if (loadingAction) {
      return;
    }

    triggerHaptic("medium");
    setLoadingAction("signOut");
    showPendingToast("Signing out", "Please wait...");

    try {
      await signOut();
      await clearLocalSession();
      setUser(null);
      hideToast();
      showSuccessToast("Signed out", "You have been signed out.");
      onClose();
      navigateToOnboarding();
    } catch (error) {
      console.error("[profile-actions] signOut failed", error);
      hideToast();
      showErrorToast(
        "Sign out failed",
        "Could not sign you out. Please try again.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const performDeleteAccount = async () => {
    if (loadingAction) {
      return;
    }

    triggerHaptic("warning");
    setLoadingAction("delete");
    showPendingToast("Deleting account", "Removing your account...");

    try {
      if (!user) {
        throw new Error("No active Clerk user found.");
      }

      await user.delete();
      await clearLocalSession();
      setUser(null);
      hideToast();
      showSuccessToast("Account deleted", "Your account has been deleted.");
      onClose();
      navigateToOnboarding();
    } catch (error) {
      console.error("[profile-actions] delete account failed", error);
      hideToast();
      showErrorToast(
        "Delete failed",
        "Could not delete your account. You may need to re-authenticate.",
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteAccount = () => {
    triggerHaptic("medium");

    Alert.alert(
      "Delete account",
      "This action is permanent and cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            triggerHaptic("selection");
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            triggerHaptic("warning");
            void performDeleteAccount();
          },
        },
      ],
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onDismiss={onClose}
      handleIndicatorStyle={styles.sheetHandle}
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView style={styles.sheetContent}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Account Actions</Text>
          <Pressable
            onPress={() => {
              triggerHaptic("selection");
              onClose();
            }}
            style={styles.sheetCloseButton}
          >
            <Ionicons name="close" size={20} color="#1A1B23" />
          </Pressable>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          style={[styles.actionButton, styles.signOutButton]}
          onPress={() => {
            void handleSignOut();
          }}
          disabled={loadingAction !== null}
        >
          <Ionicons name="log-out-outline" size={20} color="#1B1D28" />
          <Text style={styles.actionText}>
            {loadingAction === "signOut" ? "Signing out..." : "Sign out"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.88}
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteAccount}
          disabled={loadingAction !== null}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.deleteText}>
            {loadingAction === "delete"
              ? "Deleting account..."
              : "Delete account"}
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetHandle: {
    backgroundColor: "#C7CBDA",
    width: 42,
  },
  sheetBackground: {
    backgroundColor: "#EEE7FF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetContent: {
    paddingHorizontal: 18,
    paddingBottom: 34,
    gap: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sheetTitle: {
    color: "#171923",
    fontSize: 22,
    fontFamily: FONT_FAMILY.bold,
  },
  sheetCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    borderRadius: 18,
    height: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  signOutButton: {
    backgroundColor: "#FFFFFF",
  },
  deleteButton: {
    backgroundColor: "#D25252",
  },
  actionText: {
    color: "#1B1D28",
    fontSize: 16,
    fontFamily: FONT_FAMILY.semibold,
  },
  deleteText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: FONT_FAMILY.semibold,
  },
});
