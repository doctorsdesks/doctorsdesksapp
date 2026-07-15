import React, { useEffect, useState } from "react";
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import { ThemedView } from "@/components/ThemedView";
import Loader from "@/components/Loader";
import ClinicCard from "@/components/ClinicCard";

import { useAppContext } from "@/context/AppContext";
import { getClinics } from "@/components/Utils";

const Clinics = () => {
  const { doctorDetails } = useAppContext();
  const { source } = useLocalSearchParams();

  const [loader, setLoader] = useState(true);
  const [clinics, setClinics] = useState<any[]>([]);

  useEffect(() => {
    const backAction = () => {
      router.replace("/dashboard/profile");
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if(doctorDetails && doctorDetails?._id) {
        loadClinics();
    }
  }, [doctorDetails]);

  const loadClinics = async () => {
    setLoader(true);

    const response = await getClinics(doctorDetails?._id);

    if (response.status === "SUCCESS") {
      setClinics(response.data || []);
    } else {
      Toast.show({
        type: "error",
        text1: response.error,
      });
    }

    setLoader(false);
  };

  const handleClinicPress = (clinic: any) => {
    if (clinic?.hospitalId) return;

    if (source === "clinicAddress") {
      router.push({
        pathname: "/clinicDetail",
        params: {
          clinicInfo: JSON.stringify(clinic)
        },
      });
    }
    if (source === "clinicFee") {
      router.push({
        pathname: "/clinicDetail/consultationFee",
        params: {
          clinicInfo: JSON.stringify(clinic)
        },
      });
    }
    if (source === "clinicTiming") {
      router.push({
        pathname: "/clinicDetail/manageSlotAndTiming",
        params: {
          clinicData: JSON.stringify(clinic)
        },
      });
    }
    if (source === "blockSlots") {
      router.push({
        pathname: "/clinicDetail/blockSlots",
        params: {
          clinicData: JSON.stringify(clinic)
        },
      });
    }
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {clinics?.map((clinic) => {
          return (
            <ClinicCard
              key={clinic._id}
              clinic={clinic}
              source={source as string}
              onPress={() => handleClinicPress(clinic)}
            />
          )
        })}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  scroll: {
    paddingTop: 16,
    paddingBottom: 24,
  },
});

export default Clinics;