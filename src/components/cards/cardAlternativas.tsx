import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;

  // 👉 novos props
  isCorrect?: boolean;
  onPressMarkCorrect?: () => void;
};

export default function CardAlternativas({
  label,
  value,
  onChangeText,
  isCorrect = false,
  onPressMarkCorrect,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>

        {/* 👉 botão de marcar como correta */}
        <TouchableOpacity
          style={styles.correctButton}
          onPress={onPressMarkCorrect}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isCorrect ? "checkmark-circle" : "checkmark-circle-outline"}
            size={20}
            color={isCorrect ? "#00FF99" : "#FFFFFF"}
          />
          <Text style={styles.correctText}>
            {isCorrect ? "Correta" : "Marcar como correta"}
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Digite a alternativa..."
        placeholderTextColor="rgba(255,255,255,0.6)"
        value={value}
        onChangeText={onChangeText}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5A22B5",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  correctButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  correctText: {
    color: "#fff",
    fontSize: 11,
  },
  input: {
    color: "#fff",
    fontSize: 14,
    minHeight: 40,
  },
});