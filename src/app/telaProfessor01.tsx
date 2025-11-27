import { Ionicons } from "@expo/vector-icons";
import CardAlternativas from "@/components/cards/cardAlternativas";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

 const { width, height } = Dimensions.get("window");

 export default function TelaProfessor01({ navigation }: any) {
  const materias = [
    "Filosofia",
    "Matemática",
    "História",
    "Computação",
    "Português",
    "Artes",
  ];
  return (
    <LinearGradient colors={["#111b84", "#3c0e71"]} style={styles.container}>
      {/* Ícones topo */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconCircle}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("telaProfessor01")}
          style={styles.iconCircle}
        >
          <Ionicons name="home" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.titulo}>Selecione a Disciplina</Text>

      {/* Lista de conteúdos */}
      <ScrollView
        style={styles.lista}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaContent}
      >
        {materias.map((materia, index) => (   // ⬅️ AGORA USA O VETOR CERTO
          <TouchableOpacity
            key={index}
            style={{ width: "100%" }}
            onPress={() =>
              navigation.navigate("telaProfessor02", {
                materia
              })
            }
          >
            <View style={styles.wrapperAlternativa}>
              <CardAlternativas
                label={`${materia}`}
                showInput={false}
                showMarkCorrect={false}
                containerStyle={styles.cardLista}
                labelStyle={styles.cardTexto}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: height * 0.04,
    paddingHorizontal: width * 0.08,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  titulo: {
    color: "#fff",
    fontWeight: "700",
    fontSize: width * 0.06,
    textAlign: "center",
    marginBottom: height * 0.03,
  },
  lista: {
    width: "100%",
    flex: 1,
  },
  listaContent: {
    paddingBottom: 20,
  },
  wrapperAlternativa: {
    marginVertical: 8,
  },
  cardLista: {
    paddingVertical: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  cardTexto: {
    fontSize: 21,
    fontWeight: "700",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.20)",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.20)",
    justifyContent: "center",
    alignItems: "center",
  },
});
