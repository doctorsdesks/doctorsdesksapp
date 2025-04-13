import React from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import CustomText from "./CustomText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedView } from "./ThemedView";

const PatientList = (props: any) => {
    const scrollViewRef = React.useRef(null);
  return (
    <ThemedView style={styles.list}>
        <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            style={styles.scrollView}>
            {props?.patientList?.map((patient: any, i: number) => (
                <Pressable onPress={() => router.replace(`/patientProfile/${patient?.phone}`)} style={[styles.card, { borderBottomWidth: i === props?.patientList?.length - 1 ? 0 : 1 }]} key={patient?.phone}>
                    <View style={styles.cardSection}>
                        <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} text={patient?.name}/>
                        <View style={{ display: "flex", flexDirection: "row" }}  >
                            <Ionicons name='call' size={14} />
                            <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000", marginLeft: 4 }} text={patient?.phone}/>
                        </View>
                    </View>
                    <View style={styles.cardSection}>
                        <View style={{ display: "flex", flexDirection: "row" }} >
                            <CustomText multiLingual={true} textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} text="Age"/>
                            <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} text={` :  ${patient?.age}`}/>
                            <CustomText multiLingual={true} textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000", marginLeft: 4 }} text="years"/>
                        </View>
                        <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} text={patient?.uhiid}/>
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
        top: 116,
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
