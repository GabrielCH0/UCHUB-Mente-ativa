// cardEnunciadoSearch.tsx
import React, { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

type CardEnunciadoSearchProps = {
    title?: string; // continua opcional, se quiser usar em outro lugar
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
};

export default function CardEnunciadoSearch({
    title,
    value = "",
    onChangeText,
    placeholder = "Buscar...",
}: CardEnunciadoSearchProps) {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<TextInput | null>(null);

    const startEdit = () => {
        setEditing(true);
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const stopEdit = () => setEditing(false);

    return (
        <View style={styles.card}>
            {/* Se um dia quiser usar título dentro do card em outra tela, ainda funciona */}
            {title && <Text style={styles.title}>{title}</Text>}

            {!editing ? (
                <Pressable style={styles.displayArea} onPress={startEdit}>
                    <Text
                        style={[
                            styles.displayText,
                            !value.trim() && styles.placeholderText,
                        ]}
                        numberOfLines={1}
                    >
                        {value.trim() || placeholder}
                    </Text>
                </Pressable>
            ) : (
                <TextInput
                    ref={inputRef}
                    style={styles.inputArea}
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={stopEdit}
                    placeholder={placeholder}
                    numberOfLines={1}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minHeight: 32,
        width: "45%",
        minWidth: 120,
    },
    title: {
        fontSize: 11,
        fontWeight: "600",
        marginBottom: 2,
        color: "#3a2a67",
    },
    displayArea: {
        minHeight: 24,
        justifyContent: "center",
    },
    displayText: {
        fontSize: 13,
        color: "#1f1b2e",
    },
    placeholderText: {
        color: "#777",
    },
    inputArea: {
        minHeight: 24,
        fontSize: 13,
        color: "#1f1b2e",
    },
});