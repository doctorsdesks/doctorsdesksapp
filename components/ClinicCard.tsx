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

interface Props {
  clinic: any;
  onPress?: () => void;
}

const ClinicCard = ({ clinic, onPress }: Props) => {
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
});

export default ClinicCard;