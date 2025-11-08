import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { colors } from '../theme/colors';
import { radius, space } from '../theme/spacing';

type AlternativeItemProps = {
  label: string;                // "Alternativa A", etc.
  value: string;                // texto da alternativa
  onChangeText: (v: string) => void;
};

/**
 * Componente da alternativa: "pílula" roxa + input associado.
 * Idêntico para A–E, assim a tela só faz map().
 */
export default function CardAlternativas({ label, value, onChangeText }: AlternativeItemProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.pill}>
        <Text style={styles.pillText}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={`Texto da ${label.toLowerCase()}`}
        placeholderTextColor="#c9c3e2"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: space.md },
  pill: {
    height: 44, borderRadius: radius.pill,
    backgroundColor: colors.pill,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  pillText: { color: colors.pillText, fontWeight: '700' },
  input: {
    marginTop: space.sm, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.pillInputBorder,
    color: '#f0eaff', backgroundColor: colors.pillInputBg,
  },
});