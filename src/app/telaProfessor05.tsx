import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { backgroundStyles, Gradient } from "@/styles/background";
import CardEnunciado from "@/components/cards/cardEnunciado";
import CardAlternativas from "@/components/cards/cardAlternativas";

// URL do seu dataServer
const API_BASE_URL =
  "https://93e08048-d088-4dbc-bd60-18bab6374393-00-1lc06cy73r5o4.picard.replit.dev";

// Tipagem da questão vinda do servidor
type Question = {
  id: number;
  enunciado: string;
  alternativas: string[];
  indiceCorreta?: number;
  explicacao?: string;
  turma?: number;
  autorId?: number;
  dificuldade?: string;
};

/* ---------------------- FUNÇÕES DE API ---------------------- */

// Buscar questão por ID
async function getQuestionById(id: number): Promise<Question> {
  const res = await fetch(`${API_BASE_URL}/perguntas/${id}`);
  if (!res.ok) {
    throw new Error(`Questão ${id} não encontrada.`);
  }
  return res.json();
}

// Buscar questões por texto do enunciado
async function searchQuestionsByText(term: string): Promise<Question[]> {
  const res = await fetch(
    `${API_BASE_URL}/perguntas?enunciado_like=${encodeURIComponent(term)}`
  );
  if (!res.ok) {
    throw new Error("Erro ao buscar questões.");
  }
  return res.json();
}

// Atualizar questão
async function updateQuestion(q: Question): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/perguntas/${q.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(q),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar questão.");
  }
}

//Deletar questão
async function deleteQuestion(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/perguntas/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao apagar questão.");
  }
}

/* ---------------------- COMPONENTE DA TELA ---------------------- */

export default function TelaProfessor05() {
  // BUSCA
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Question[]>([]);

  // Questão selecionada
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  // CAMPOS DE EDIÇÃO
  const [enunciado, setEnunciado] = useState("");
  const [alternativas, setAlternativas] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);

  // NOVO: índice da alternativa correta
  const [indiceCorreta, setIndiceCorreta] = useState<number | null>(null);

  // Salvamento
  const [saving, setSaving] = useState(false);

  // Estado inicial (para detectar dirty)
  const [initial, setInitial] = useState<{
    enunciado: string;
    alternativas: string[];
    indiceCorreta: number | null;
  } | null>(null);

  // Detecta se houve qualquer alteração
  const dirty = useMemo(() => {
    if (!initial) return false;

    if (initial.enunciado !== enunciado) return true;

    for (let i = 0; i < 5; i++) {
      if (initial.alternativas[i] !== alternativas[i]) return true;
    }

    if (initial.indiceCorreta !== indiceCorreta) return true;

    return false;
  }, [initial, enunciado, alternativas, indiceCorreta]);

  // Atualizar alternativa específica
  const updateAlt = (i: number, v: string) => {
    setAlternativas((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  /* ---------------------- BUSCA ---------------------- */

  const handleSearch = async () => {
    const term = searchText.trim();
    if (!term) return;

    setSearching(true);
    try {
      if (/^\d+$/.test(term)) {
        const q = await getQuestionById(Number(term));
        setResults(q ? [q] : []);
      } else {
        const list = await searchQuestionsByText(term);
        setResults(list);
      }
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao buscar.");
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  /* ---------------------- CARREGAR QUESTÃO ---------------------- */

  const handleSelectQuestion = (q: Question) => {
    setSelectedQuestion(q);

    const enun = q.enunciado ?? "";

    // garante 5 alternativas
    const alt = [...(q.alternativas ?? [])];
    while (alt.length < 5) alt.push("");
    if (alt.length > 5) alt.splice(5);

    // se não existir, usa 0 como padrão
    const idxCorreta =
      typeof q.indiceCorreta === "number" ? q.indiceCorreta : 0;

    setEnunciado(enun);
    setAlternativas(alt);
    setIndiceCorreta(idxCorreta);

    setInitial({
      enunciado: enun,
      alternativas: [...alt],
      indiceCorreta: idxCorreta,
    });

    setResults([]);
  };

  /* ---------------------- SALVAR ---------------------- */

  const handleSalvar = async () => {
    if (!selectedQuestion) {
      Alert.alert("Aviso", "Selecione uma questão primeiro.");
      return;
    }

    const alternativasTrim = alternativas.map((a) => a.trim());

    if (!enunciado.trim()) {
      Alert.alert("Atenção", "Preencha o enunciado.");
      return;
    }
    if (alternativasTrim.filter((a) => a !== "").length < 2) {
      Alert.alert(
        "Atenção",
        "Preencha pelo menos duas alternativas."
      );
      return;
    }
    if (indiceCorreta == null) {
      Alert.alert("Atenção", "Selecione a alternativa correta.");
      return;
    }

    setSaving(true);
    try {
      const payload: Question = {
        ...selectedQuestion,
        enunciado: enunciado.trim(),
        alternativas: alternativasTrim,
        indiceCorreta: indiceCorreta,
      };

      await updateQuestion(payload);

      setInitial({
        enunciado: payload.enunciado,
        alternativas: [...alternativasTrim],
        indiceCorreta: payload.indiceCorreta ?? 0,
      });

      setSelectedQuestion(payload);

      Alert.alert("Sucesso", "Questão atualizada!");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  /* -----------------------DELETAR---------------------- */

  const handleDelete = () => {
    if (!selectedQuestion) {
      Alert.alert("Aviso", "Nenhuma questão selecionada.");
      return;
    }

    Alert.alert(
      "Excluir questão",
      "Tem certeza que deseja apagar esta questão permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteQuestion(selectedQuestion.id);

              // Limpa a tela toda
              setSelectedQuestion(null);
              setEnunciado("");
              setAlternativas(["", "", "", "", ""]);
              setIndiceCorreta(null);
              setInitial(null);

              Alert.alert("Sucesso", "Questão apagada com sucesso.");
            } catch (e: any) {
              Alert.alert("Erro", e?.message ?? "Falha ao apagar a questão.");
            }
          },
        },
      ]
    );
  };

  /* ---------------------- RENDER ---------------------- */

  return (
    <View style={backgroundStyles.container}>
      <Gradient />
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* BOTÃO VOLTAR */}
          <TouchableOpacity
            style={styles.roundIcon}
            disabled={saving}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* BLOCO DA DIREITA (delete + salvar) */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.deleteChip}
              disabled={!selectedQuestion || saving}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#ff4444" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveChip, !dirty || saving ? { opacity: 0.5 } : null]}
              disabled={!dirty || saving}
              onPress={handleSalvar}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveChipText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.screenTitle}>Editar Questão</Text>

          {/* BUSCA */}
          <View style={styles.enunciadoOuter}>
            <CardEnunciado
              title="Buscar questão (ID ou início do enunciado)"
              value={searchText}
              onChangeText={setSearchText}
            />

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={searching}
            >
              {searching ? (
                <ActivityIndicator size="small" color="#333" />
              ) : (
                <Text style={styles.searchButtonText}>Buscar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* RESULTADOS DA BUSCA */}
          {results.length > 0 && (
            <View style={styles.resultsBox}>
              {results.map((q) => (
                <TouchableOpacity
                  key={q.id}
                  style={styles.resultItem}
                  onPress={() => handleSelectQuestion(q)}
                >
                  <Text style={styles.resultTitle}>
                    #{q.id} –{" "}
                    {q.enunciado.length > 60
                      ? q.enunciado.slice(0, 60) + "..."
                      : q.enunciado}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ENUNCIADO */}
          <View style={styles.enunciadoOuter}>
            <CardEnunciado
              title={
                selectedQuestion
                  ? `Enunciado da questão #${selectedQuestion.id}`
                  : "Enunciado da questão..."
              }
              value={enunciado}
              onChangeText={setEnunciado}
            />
          </View>

          {/* ALTERNATIVAS */}
          {["A", "B", "C", "D", "E"].map((letter, idx) => (
            <CardAlternativas
              key={letter}
              label={`Alternativa ${letter}`}
              value={alternativas[idx]}
              onChangeText={(v) => updateAlt(idx, v)}
              isCorrect={indiceCorreta === idx}
              onPressMarkCorrect={() => setIndiceCorreta(idx)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ---------------------- ESTILOS ---------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: "center",
  },
  roundIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  saveChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  saveChipText: {
    color: "#fff",
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  screenTitle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 16,
  },
  enunciadoOuter: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  searchButton: {
    marginTop: 8,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  searchButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 13,
  },
  resultsBox: {
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    paddingVertical: 4,
  },
  resultItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  resultTitle: {
    color: "#222",
    fontSize: 13,
  },
  deleteChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginRight: 10,
  },
});