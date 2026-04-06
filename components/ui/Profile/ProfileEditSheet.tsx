import { UserContext } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import {
  hideToast,
  showErrorToast,
  showPendingToast,
  showSuccessToast,
} from "@/utils/toast";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMutation } from "convex/react";
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
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FONT_FAMILY } from "../../../constants/fonts";

type ProfileEditSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

function splitName(fullName: string) {
  const clean = fullName.trim().replace(/\s+/g, " ");
  const [firstName, ...rest] = clean.split(" ");

  return {
    firstName: firstName ?? "",
    lastName: rest.join(" "),
  };
}

export default function ProfileEditSheet({
  isOpen,
  onClose,
}: ProfileEditSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const { user: storedUser, setUser } = useContext(UserContext);
  const { user: clerkUser } = useUser();
  const updateProfileName = useMutation(api.users.updateProfileName);

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const displayName =
    storedUser?.name ??
    clerkUser?.fullName ??
    clerkUser?.firstName ??
    "CookMaster User";
  const displayEmail =
    storedUser?.email ?? clerkUser?.primaryEmailAddress?.emailAddress ?? "";

  const snapPoints = useMemo(() => ["52%"], []);

  useEffect(() => {
    if (isOpen) {
      setName(displayName);
      sheetRef.current?.present();
      return;
    }

    sheetRef.current?.dismiss();
  }, [displayName, isOpen]);

  const triggerHaptic = (type: "selection" | "medium") => {
    if (Platform.OS === "web") {
      return;
    }

    if (type === "selection") {
      void Haptics.selectionAsync();
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

  const requestClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handleSheetIndexChange = useCallback(
    (index: number) => {
      if (index === -1) {
        Keyboard.dismiss();
        onClose();
      }
    },
    [onClose],
  );

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      triggerHaptic("selection");
      showErrorToast("Name required", "Please enter your name.");
      return;
    }

    if (trimmedName === displayName.trim()) {
      triggerHaptic("selection");
      requestClose();
      return;
    }

    const clerkUserId = clerkUser?.id;
    if (!clerkUserId) {
      showErrorToast(
        "Profile update failed",
        "Could not find your account. Please sign in again.",
      );
      return;
    }

    triggerHaptic("medium");
    setIsSaving(true);
    showPendingToast("Saving profile", "Updating your details...");

    try {
      const { firstName, lastName } = splitName(trimmedName);
      await clerkUser?.update({
        firstName,
        lastName,
      } as any);

      const updatedDbUser = await updateProfileName({
        clerkUserId,
        name: trimmedName,
      });

      const nextUser = {
        id: storedUser?.id ?? updatedDbUser._id,
        email: storedUser?.email ?? updatedDbUser.email,
        name: updatedDbUser.name,
        picture: storedUser?.picture ?? updatedDbUser.picture,
        credits: storedUser?.credits ?? updatedDbUser.credits,
        pref: storedUser?.pref ?? updatedDbUser.pref,
        created_at: storedUser?.created_at ?? updatedDbUser.created_at,
        updated_at: updatedDbUser.updated_at,
      };

      setUser(nextUser);
      await SecureStore.setItemAsync("user_context", JSON.stringify(nextUser));

      hideToast();
      showSuccessToast("Profile updated", "Your name has been updated.");
      requestClose();
    } catch (error) {
      console.error("[profile-edit] save failed", error);
      hideToast();
      showErrorToast(
        "Update failed",
        "Could not update your profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableBlurKeyboardOnGesture
      enablePanDownToClose
      onChange={handleSheetIndexChange}
      handleIndicatorStyle={styles.sheetHandle}
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView style={styles.sheetContent}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Edit Profile</Text>
          <Pressable
            onPress={() => {
              triggerHaptic("selection");
              requestClose();
            }}
            style={styles.sheetCloseButton}
          >
            <Ionicons name="close" size={20} color="#1A1B23" />
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Name</Text>
          <BottomSheetTextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#9EA4B6"
            style={styles.input}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>
              {displayEmail || "No email"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={() => {
            void handleSave();
          }}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save changes"}
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
    gap: 14,
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
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: "#2A2D3A",
    fontSize: 14,
    fontFamily: FONT_FAMILY.semibold,
  },
  input: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    color: "#1D2030",
    fontSize: 16,
    fontFamily: FONT_FAMILY.regular,
  },
  readOnlyInput: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  readOnlyText: {
    color: "#5A6174",
    fontSize: 15,
    fontFamily: FONT_FAMILY.regular,
  },
  saveButton: {
    marginTop: 6,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6D4DFF",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: FONT_FAMILY.semibold,
  },
});
