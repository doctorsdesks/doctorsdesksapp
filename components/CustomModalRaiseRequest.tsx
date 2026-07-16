import React, { useState } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import CustomButton from "@/components/CustomButton";
import CustomInput2 from "@/components/CustomInput2";
import CustomPopUp from "@/components/CustomPopUp";
import Icon from "@/components/Icons";
import SearchSelect from "@/components/SearchSelect";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { DoctorRequest, DoctorRolesType } from "@/constants/Enums";
import { useColorScheme } from "@/hooks/useColorScheme";

interface CustomModalRaiseRequestProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: DoctorRequest) => void;
}

const CustomModalRaiseRequest = ({
    visible,
    onClose,
    onSubmit,
}: CustomModalRaiseRequestProps) => {
    const { width, height } = Dimensions.get("window");

    const colorScheme = useColorScheme() || "light";
    const theme = Colors[colorScheme];

    const [doctorRequest, setDoctorRequest] = useState<DoctorRequest>({
        doctorCode: "",
        role: "",
    });

    const doctorCodeField = {
        id: "doctorCode",
        type: "STRING",
        inputType: "TEXT",
        value: doctorRequest.doctorCode,
        label: "Doctor Code",
        isMandatory: true,
        errorMessage: "Please enter doctor code",
        placeholder: "Enter doctor code",
    };

    const roleField = {
        id: "role",
        type: "STRING",
        inputType: "SEARCHSELECT",
        value: doctorRequest.role,
        label: "Role",
        isMandatory: true,
        errorMessage: "Please select doctor role",
        placeholder: "Select doctor role",
        options: Object.keys(DoctorRolesType),
    };

    const handleChange = (value: string, id: string) => {
        setDoctorRequest((previous) => ({
            ...previous,
            [id]: value,
        }));
    };

    const handleSubmit = () => {
        onSubmit(doctorRequest);
    };

    return (
        <CustomPopUp visible={visible} onClose={onClose} paddingTop={60}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View
                    style={[
                        styles.container,
                        {
                            height: height * 0.65,
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <ThemedText
                                style={[
                                    styles.title,
                                    {
                                        color: theme.text,
                                    },
                                ]}
                            >
                                Add Doctor
                            </ThemedText>

                            <ThemedText
                                style={{
                                    marginTop: 6,
                                    fontSize: 12,
                                    lineHeight: 16,
                                    color: "#7A8797",
                                }}
                            >
                                Raise a request to associate a doctor with your
                                hospital.
                            </ThemedText>
                        </View>

                        <Pressable
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Icon
                                type="cross"
                                fill={theme.crossIcon}
                            />
                        </Pressable>
                    </View>

                    {/* Divider */}

                    <View
                        style={{
                            height: 1,
                            backgroundColor: "#E8ECEF",
                            marginTop: 18,
                        }}
                    />

                    {/* Form */}

                    <ScrollView
                        style={styles.body}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.field}>
                            <CustomInput2
                                data={doctorCodeField}
                                onChange={handleChange}
                            />
                        </View>

                        <View style={styles.field}>
                            <SearchSelect
                                data={roleField}
                                onChange={handleChange}
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <CustomButton
                            title="Raise Request"
                            width="FULL"
                            onPress={handleSubmit}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </CustomPopUp>
    );
};

export default CustomModalRaiseRequest;

const styles = StyleSheet.create({
    container: {
        borderRadius: 28,
        paddingTop: 32,
        paddingBottom: 22,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    title: {
        fontSize: 24,
        lineHeight: 28,
        fontWeight: "700",
    },

    closeButton: {
        height: 20,
        width: 20,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    body: {
        flex: 1,
        marginTop: 22,
    },

    field: {
        marginBottom: 22,
    },

    footer: {
        borderTopWidth: 1,
        borderTopColor: "#ECEFF2",
        paddingTop: 18,
    },
});