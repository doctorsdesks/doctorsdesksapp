import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "@/constants/Colors";

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
            return "#FFCB2D";
        } else if (slot?.slotStatus === "BOOKED") {
            return "#14534F";
        } else if (isSelected) {
            return Colors[colorSchema].slotBackgroundSelected;
        } else {
            return Colors[colorSchema].background;
        }
    }

    return (
        <ThemedView style={styles.container} >
            <Pressable
                style={[styles.slot, { 
                    borderColor: isSelected ? Colors[colorSchema].slotBorderSelected : Colors[colorSchema].borderColor, 
                    backgroundColor: getBgColor()
                }]}
                onPress={() => slot?.slotStatus === "OPEN" && onSelectSlot(slot)}
            >
                <ThemedText style={{ fontSize: 12, lineHeight: 12, fontWeight: 600 }} lightColor={isSelected ? "#fff" : "#000"} darkColor="#fff" >{getSlotTime()}</ThemedText>
            </Pressable>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 79,
    },
    slot: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 8,
    }
});

export default Slot;