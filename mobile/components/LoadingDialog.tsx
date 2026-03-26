import { useEffect, useState } from "react";
import { Image, Modal, Text, View } from "react-native";
import Colors from "@/shared/Colors";

export default function LoadingDialog({ loading = false, title = "" }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <Modal transparent visible={loading} statusBarTranslucent>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#00000070",
        }}
      >
        <View
          style={{
            padding: 20,
            borderRadius: 15,
            backgroundColor: Colors.primary,
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/pan.gif")}
            style={{
              width: 100,
              height: 100,
              marginBottom: 16,
            }}
          />
          <Text
            style={{
              color: Colors.white,
              fontSize: 18,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            {title}
            {dots}
            <Text style={{ opacity: 0 }}>{".".repeat(3 - dots.length)}</Text>
          </Text>
        </View>
      </View>
    </Modal>
  );
}
