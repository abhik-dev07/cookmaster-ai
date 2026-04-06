import { UserContext } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { FONT_FAMILY } from "../../../constants/fonts";

type ProfilePreferenceSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfilePreferenceSheet({
  isOpen,
  onClose,
}: ProfilePreferenceSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const { isVegMode, setIsVegMode } = useContext(UserContext);

  const snapPoints = useMemo(() => ["34%"], []);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.present();
      return;
    }

    sheetRef.current?.dismiss();
  }, [isOpen]);

  const triggerSelectionHaptic = () => {
    if (Platform.OS !== "web") {
      void Haptics.selectionAsync();
    }
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

  const handleToggleVegMode = (value: boolean) => {
    triggerSelectionHaptic();
    setIsVegMode(value);
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
          <Text style={styles.sheetTitle}>Preferences</Text>
          <Pressable
            onPress={() => {
              triggerSelectionHaptic();
              onClose();
            }}
            style={styles.sheetCloseButton}
          >
            <Ionicons name="close" size={20} color="#1A1B23" />
          </Pressable>
        </View>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceCopy}>
            <Text style={styles.preferenceName}>Veg Mode</Text>
            <Text style={styles.preferenceHint}>
              Show only vegetarian-friendly recipes
            </Text>
          </View>
          <Switch
            value={isVegMode}
            onValueChange={handleToggleVegMode}
            trackColor={{ false: "#D2D7E5", true: "#B7A2FF" }}
            thumbColor={isVegMode ? "#6D4DFF" : "#FFFFFF"}
          />
        </View>
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
  preferenceRow: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  preferenceCopy: {
    flex: 1,
    paddingRight: 8,
  },
  preferenceName: {
    color: "#1B1E2A",
    fontSize: 16,
    fontFamily: FONT_FAMILY.semibold,
  },
  preferenceHint: {
    marginTop: 3,
    color: "#5A6174",
    fontSize: 13,
    fontFamily: FONT_FAMILY.regular,
  },
});
