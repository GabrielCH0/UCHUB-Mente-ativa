import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleProp, ViewStyle } from "react-native";

type GradientProps = {
  children?: React.ReactNode; // permite receber elementos dentro
  style?: StyleProp<ViewStyle>; // permite aplicar estilos externos
};

export function Gradient({ children, style }: GradientProps) {
  return (
    <LinearGradient
      colors={["#1e3c72", "#2a5298"]} // exemplo de gradiente
      style={[{ flex: 1 }, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}