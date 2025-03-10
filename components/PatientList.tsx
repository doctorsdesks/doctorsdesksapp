import React from "react";
import { View, ScrollView, Text, StyleSheet, Pressable } from "react-native";
import CustomText from "./CustomText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const PatientList = (props: any) => {
    const scrollViewRef = React.useRef(null);
  return (
    <View style={styles.list}>
        <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            style={styles.scrollView}>
            {props?.patientList?.map((patient: any, i: number) => (
                <Pressable onPress={() => router.replace("/patientProfile")} style={[styles.card, { borderBottomWidth: i === props?.patientList?.length - 1 ? 0 : 1 }]} key={patient?.phone}>
                    <View style={styles.cardSection}>
                        <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} text={patient?.name}/>
                        <View style={{ display: "flex", flexDirection: "row" }}  >
                            <Ionicons name='phone-portrait-sharp' size={14} />
                            <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000", marginLeft: 4 }} text={patient?.phone}/>
                        </View>
                    </View>
                    <View style={styles.cardSection}>
                        <View style={{ display: "flex", flexDirection: "row" }} >
                            <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} text="Age"/>
                            <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} text={` :  ${patient?.age}`}/>
                            <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000", marginLeft: 4 }} text="years"/>
                        </View>
                        <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#000" }} text={patient?.uhiid}/>
                    </View>
                </Pressable>
            ))}
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    list: {
        position: 'absolute',
        top: 102,
        left: 0,
        right: 0,
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
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
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
