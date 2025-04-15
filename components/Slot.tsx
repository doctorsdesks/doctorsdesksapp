import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Icon from "./Icons";

interface SlotProps {
    slot: Slot;
    onSelectSlot: (selectedSlot: any) => void;
    isSelected: boolean;
}

interface Slot {
    startTime: string,
    endTime: string,
    slotStatus: string,
}

const Slot: React.FC<SlotProps> = ({ slot, onSelectSlot, isSelected }) => {
    const colorSchema = useColorScheme() || "light";

    const getSlotTime = () => {
        const startTime = slot?.startTime;
        const [hour, minute] = startTime?.split(":");
        let finalHour: any = parseInt(hour);
        let period = "AM";
        if (finalHour >= 12 ) {
            period = "PM"
            if (finalHour !== 12) {
                finalHour = finalHour - 12;
            }
        }
        if (finalHour.toString()?.length < 2) {
            finalHour = "0" + finalHour;
        }
        const finalTime = finalHour + ":" + minute + " "  + period;
        return finalTime;
    }

    const getBgColor = () => {
        if (slot?.slotStatus === "LOCKED") {
            return Colors[colorSchema].slotLockedBg;
        } else if (slot?.slotStatus === "BOOKED") {
            return Colors[colorSchema].slotBookedBg;
        } else if (isSelected) {
            return Colors[colorSchema].slotBackgroundSelected;
        } else {
            return Colors[colorSchema].background;
        }
    }

    const getTextColor = () => {
        if (slot?.slotStatus === "LOCKED") {
            return Colors[colorSchema].slotLockedText;
        } else if (slot?.slotStatus === "BOOKED") {
            return Colors[colorSchema].slotBookedText;
        } else if (isSelected) {
            return "#fff";
        } else {
            return "#000";
        }
    }

    const getBorderColor = () => {
        if (slot?.slotStatus === "LOCKED") {
            return Colors[colorSchema].slotLockedBg;
        } else if (slot?.slotStatus === "BOOKED") {
            return Colors[colorSchema].slotBookedBg;
        } else if (isSelected) {
            return Colors[colorSchema].slotBackgroundSelected;
        } else {
            return Colors[colorSchema].borderColor;
        }
    }

    const getIcon = () => {
        if (slot?.slotStatus === "LOCKED" || isSelected) {
            return <Icon type="lock" fill={getTextColor()} />
        } else if (slot?.slotStatus === "BOOKED") {
            return <Ionicons name='checkmark-circle-sharp' size={12} style={{ color: getTextColor() }} />
        } else {
            return <Ionicons name='lock-open-outline' size={12} style={{ color: getTextColor() }} />
        }
    }

    return (
        <ThemedView style={styles.container} >
            <Pressable
                style={[styles.slot, { 
                    borderColor: getBorderColor(), 
                    backgroundColor: getBgColor(),
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }]}
                onPress={() => slot?.slotStatus === "OPEN" && onSelectSlot(slot)}
            >
                {getIcon()}
                <ThemedText style={{ fontSize: 12, lineHeight: 12, marginLeft: 8, fontWeight: 600, color: getTextColor() }} >{getSlotTime()}</ThemedText>
            </Pressable>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 102,
    },
    slot: {
        paddingVertical: 14,
        borderWidth: 1,
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default Slot;