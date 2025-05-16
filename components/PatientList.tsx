import React from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import CustomText from "./CustomText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { finalText } from "./Utils";
import { useAppContext } from "@/context/AppContext";

const PatientList = (props: any) => {
    const scrollViewRef = React.useRef(null);
    const { translations, selectedLanguage } = useAppContext();
  return (
    <ThemedView style={styles.list}>
        <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={styles.scrollView}>
            {props?.patientList?.map((patient: any, i: number) => (
                <Pressable onPress={() => router.replace(`/patientProfile/${patient?.phone}`)} style={[styles.card, { borderBottomWidth: i === props?.patientList?.length - 1 ? 0 : 1 }]} key={patient?.phone}>
                    <View style={styles.cardSection}>
                        <ThemedText style={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} >{finalText(patient?.name, translations, selectedLanguage)} </ThemedText>
                        <View style={{ display: "flex", flexDirection: "row" }}  >
                            <Ionicons name='call' size={14} />
                            <ThemedText style={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000", marginLeft: 4 }} >{finalText(patient?.phone, translations, selectedLanguage)} </ThemedText>
                        </View>
                    </View>
                    <View style={styles.cardSection}>
                        <View style={{ display: "flex", flexDirection: "row" }} >
                            <ThemedText style={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} >{finalText("Age", translations, selectedLanguage)} </ThemedText>
                            <ThemedText style={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} >{` :  ${patient?.age}`} </ThemedText>
                            <ThemedText style={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000", marginLeft: 4 }} >{finalText("years", translations, selectedLanguage)} </ThemedText>
                        </View>
                        <ThemedText style={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} >{patient?.uhiid}</ThemedText>
                    </View>
                </Pressable>
            ))}
        </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
    list: {
        position: 'absolute',
        top: 76,
        left: 16,
        right: 16,
        height: 290,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: 34,
        borderBottomRightRadius: 34,
        borderColor: '#2DB9B0',
        zIndex: 20,
        overflow: 'hidden'
    },
    scrollView: {
        flex: 1,
        height: '100%'
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    card: {
        flexDirection: "column",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderColor: "#a9a9ab",
    },
    cardSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8
    },
});

export default PatientList;
