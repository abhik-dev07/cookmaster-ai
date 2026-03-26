import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/shared/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const Button = ({ label, onPress, icon = "", loading = false }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 35,
        marginTop: 20,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Ionicons name={icon} size={20} color="white" />
      )}
      <Text
        style={{
          textAlign: "center",
          color: Colors.white,
          fontSize: 17,
          fontFamily: "outfit",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
