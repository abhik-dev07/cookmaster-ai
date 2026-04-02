import { FONT_FAMILY } from "@/constants/fonts";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function InputCard() {
  const [prompt, setPrompt] = useState("");
  const isIOS = Platform.OS === "ios";
  return (
    <View>
      <Text style={styles.pageTitle}>AI Recipe</Text>

      <LinearGradient
        colors={["#D1C3FC", "#E3D08C", "#F2D847"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.promptCard}
      >
        <View style={styles.promptHeaderRow}>
          <TouchableOpacity activeOpacity={0.85} style={styles.closeButton}>
            <FontAwesome6
              name="wand-magic-sparkles"
              size={18}
              color="#2D2D2D"
            />
          </TouchableOpacity>
          <Text style={styles.promptText}>
            Crafting a recipe from your kitchen treasures
          </Text>
        </View>

        <View style={styles.inputBlurWrap}>
          <BlurView
            intensity={isIOS ? 20 : 20}
            tint="light"
            experimentalBlurMethod={isIOS ? undefined : "dimezisBlurView"}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.inputOverlay} />
          <TextInput
            style={styles.textInput}
            placeholder="What do you want to cook today?"
            placeholderTextColor="#8B7D53"
            multiline
            textAlignVertical="top"
            value={prompt}
            onChangeText={setPrompt}
          />
        </View>

        {/* <View style={styles.chipsRow}>
            {INGREDIENTS.map((item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.85}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{item}</Text>
                {item !== "Add ingredient" ? (
                  <Ionicons name="close" size={12} color="#6F6A5E" />
                ) : (
                  <Ionicons name="add" size={12} color="#6F6A5E" />
                )}
              </TouchableOpacity>
            ))}
          </View> */}

        <View style={styles.generateButtonView}>
          <TouchableOpacity activeOpacity={0.9} style={styles.generateButton}>
            <FontAwesome6
              name="wand-magic-sparkles"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.generateButtonText}>Generate Recipe</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} style={styles.generateButton}>
            <Ionicons name="scan" size={18} color="#FFFFFF" />
            <Text style={styles.generateButtonText}>Scan Ingredients</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: "#1D1D1D",
    fontFamily: FONT_FAMILY.semibold,
    fontSize: 30,
    letterSpacing: 0.2,
    marginTop: 50,
    marginBottom: 30,
  },
  promptCard: {
    borderRadius: 40,
    padding: 12,
    gap: 12,
  },
  promptHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingTop: 4,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginLeft: 7,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    minHeight: 120,
    width: "100%",
    backgroundColor: "transparent",
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 30,
    color: "#2F2D3A",
    fontFamily: FONT_FAMILY.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  inputBlurWrap: {
    minHeight: 120,
    width: "96%",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    marginLeft: 7,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  inputOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(240,228,175,0.78)",
  },
  promptText: {
    flex: 1,
    color: "#2F2D3A",
    fontFamily: FONT_FAMILY.medium,
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 3,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginLeft: 7,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8DDBA",
    backgroundColor: "#F6ECCD",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  chipText: {
    color: "#7C7362",
    fontFamily: FONT_FAMILY.medium,
    fontSize: 12,
  },
  generateButtonView: {
    paddingBottom: 3,
    gap: 10,
  },
  generateButton: {
    backgroundColor: "#090909",
    borderRadius: 999,
    minHeight: 60,
    marginLeft: 7,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flexDirection: "row",
    width: "96%",
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontFamily: FONT_FAMILY.semibold,
    fontSize: 18,
    letterSpacing: 0.2,
  },
});
