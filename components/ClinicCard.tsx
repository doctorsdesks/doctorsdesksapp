import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedView } from "./ThemedView";

interface Props {
  clinic: any;
  onPress?: () => void;
  source: string;
}

const ClinicCard = ({ clinic, onPress, source }: Props) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const isHospitalClinic = !!clinic?.hospitalId;

  return (
    <Pressable
      disabled={isHospitalClinic}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isHospitalClinic
            ? colors.cardBackgroud
            : colors.cardBg,
          borderColor: isHospitalClinic
            ? colors.borderColor
            : colors.borderColorSelected,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isHospitalClinic
                ? colors.pendingBg
                : colors.backgroundSelected,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: isHospitalClinic
                  ? colors.pendingText
                  : colors.textSelected,
              },
            ]}
          >
            {isHospitalClinic ? "Hospital Clinic" : "Personal Clinic"}
          </Text>
        </View>

        <Ionicons
          name={isHospitalClinic ? "lock-closed" : "create-outline"}
          size={20}
          color={
            isHospitalClinic ? colors.iconDisabled : colors.borderColorSelected
          }
        />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
        {clinic?.clinicAddress?.clinicName}
      </Text>
      {
        source === "clinicAddress" || source === "blockSlots" &&
        <ThemedView style={[styles.feeContainer, {
          backgroundColor: isHospitalClinic
            ? colors.cardBackgroud
            : colors.cardBg,
          borderColor: isHospitalClinic
            ? colors.borderColor
            : colors.borderColorSelected,
        },]} >
          <Text
            style={[
              styles.address,
              {
                color: colors.subText,
              },
            ]}
          >
            {clinic?.clinicAddress?.address?.addressLine}
          </Text>
          <Text
            style={[
              styles.city,
              {
                color: colors.subText,
              },
            ]}
          >
            {clinic?.clinicAddress?.address?.city},{" "}
            {clinic?.clinicAddress?.address?.state} -{" "}
            {clinic?.clinicAddress?.address?.pincode}
          </Text>
        </ThemedView>
      }
      {
        source === "clinicFee" && 
        <ThemedView style={[styles.feeContainer, {
          backgroundColor: isHospitalClinic
            ? colors.cardBackgroud
            : colors.cardBg,
          borderColor: isHospitalClinic
            ? colors.borderColor
            : colors.borderColorSelected,
        },]}>
          <View style={styles.feeRow}>
              <Text style={[styles.feeLabel, { color: colors.subText }]}>
              Appointment Fee
              </Text>
              <Text style={[styles.feeValue, { color: colors.text }]}>
              ₹{clinic?.appointmentFee ?? 0}
              </Text>
          </View>

          <View style={styles.feeRow}>
              <Text style={[styles.feeLabel, { color: colors.subText }]}>
              Emergency Fee
              </Text>
              <Text style={[styles.feeValue, { color: colors.text }]}>
              ₹{clinic?.emergencyFee ?? 0}
              </Text>
          </View>
        </ThemedView>
      }
      {source === "clinicTiming" && (
        <ThemedView
          style={[
            styles.timingContainer,
            {
              backgroundColor: isHospitalClinic
                ? colors.cardBackgroud
                : colors.cardBg,
            },
          ]}
        >
          <View style={styles.slotRow}>
            <Text style={[styles.slotLabel, { color: colors.subText }]}>
              Slot Duration
            </Text>
            <Text style={[styles.slotValue, { color: colors.text }]}>
              {clinic?.slotDuration} mins
            </Text>
          </View>

          <View style={styles.divider} />

          {clinic?.clinicTimings?.map(
            (
              timing: {
                day: string;
                timings: { startTime: string; endTime: string }[];
              },
              index: number
            ) => (
              <View key={index} style={styles.dayRow}>
                <Text style={[styles.dayText, { color: colors.text }]}>
                  {timing.day.charAt(0) + timing.day.slice(1).toLowerCase()}
                </Text>

                <View style={styles.timeColumn}>
                  {timing.timings.map(
                    (
                      slot: { startTime: string; endTime: string },
                      slotIndex: number
                    ) => (
                      <Text
                        key={slotIndex}
                        style={[styles.timeText, { color: colors.subText }]}
                      >
                        {slot.startTime} - {slot.endTime}
                      </Text>
                    )
                  )}
                </View>
              </View>
            )
          )}
        </ThemedView>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
  },
  city: {
    marginTop: 4,
    fontSize: 13,
  },
  feeContainer: {
    marginTop: 4,
    gap: 8,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  feeValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  timingContainer: {
    marginTop: 8,
    gap: 10,
  },
  slotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  slotValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 2,
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dayText: {
    width: 90,
    fontSize: 14,
    fontWeight: "600",
  },
  timeColumn: {
    flex: 1,
    alignItems: "flex-end",
    gap: 2,
  },
  timeText: {
    fontSize: 13,
  },
});

export default ClinicCard;