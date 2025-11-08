import React, { PropsWithChildren } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
// import { colors } from '../../Theme/colors';
// import { radius, space } from '../../Theme/spacing';

type CardProps = PropsWithChildren & {
    title?: string;
    style?: ViewStyle;
};

/** Card branco com sombra suave; opcionalmente renderiza um título. */
export default function CardEnunciado({ title, style, children }: CardProps) {
    return (
        <View style={[styles.card, style]}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        // borderRadius: radius.md + 6,
        // padding: space.lg,
        // marginBottom: space.lg,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
    },
    title: {
        color: '#3a2a67', fontWeight: '700',
        //  marginBottom: space.sm
    },
});