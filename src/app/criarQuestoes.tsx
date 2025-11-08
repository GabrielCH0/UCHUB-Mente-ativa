import React, { useState } from 'react';
import { Gradient } from "@/styles/background";
import { StyleSheet, Text, View, TextInput, ScrollView, Platform } from "react-native";
import { colors } from '../components/theme/colors';
import {space } from '../components/theme/spacing';


import CardEnunciado from '@/components/cards/cardEnunciado';
import CardAlternativas from '@/components/cards/cardAlternativas';
import CardExplicacao from '@/components/cards/cardExplicacao';

export default function CriarQuestoes() {

  const [enunciado, setEnunciado] = useState('');
  const [alternativas, setAlternativas] = useState<string[]>(['', '', '', '', '']);

  const handleChangeAlt = (index: number, value: string) => {
    const next = [...alternativas];
    next[index] = value;
    setAlternativas(next);
  };

  const handleSalvar = () => {
    console.log({ enunciado, alternativas });
    // TODO: integrar com API/async storage
  };

  return (
    <Gradient>
      <Text>Criar questões</Text>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Título da tela */}
        <Text style={styles.bigTitle}>Questão 5</Text>

        {/* Card do enunciado */}
        <CardEnunciado title="Enunciado da questão...">
          <TextInput
            style={styles.textArea}
            placeholder="Digite o enunciado aqui..."
            placeholderTextColor="#9aa0a6"
            multiline
            value={enunciado}
            onChangeText={setEnunciado}
          />
        </CardEnunciado>

        {/* Alternativas A–E com o mesmo componente */}
        {['A', 'B', 'C', 'D', 'E'].map((letter, idx) => (
          <CardAlternativas
            key={letter}
            label={`Alternativa ${letter}`}
            value={alternativas[idx]}
            onChangeText={(v) => handleChangeAlt(idx, v)}
          />
        ))}

        {/* Botão Explicação */}
        <CardExplicacao label="Explicação" onPress={() => console.log('explicação')} style={{ marginTop: space.sm }} />

        {/* Espaçador final */}
        <View style={{ height: Platform.OS === 'ios' ? 24 : 16 }} />

      </ScrollView>
    </Gradient>
  );

}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  bigTitle: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 16
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#1f1b2e',
    fontSize: 14
  },
});