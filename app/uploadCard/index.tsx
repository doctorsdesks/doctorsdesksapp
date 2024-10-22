import { CardProps } from '@/constants/Enums';
import { useAppContext } from '@/context/AppContext';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import IdProofUploadCard from './IdProofUploadCard';

const UploadCard = () => {
    const { idProofData } = useAppContext();
    const { docId } = useLocalSearchParams();

    const [currentData, setCurrentData] = useState<CardProps>();

    useEffect(() => {
        if(docId && idProofData) {
            const docToUpload = idProofData.find((item) => item?.id === docId);
            setCurrentData(docToUpload);
            console.info("currentData", docToUpload);
        }
    }, [docId, idProofData])

    const handleChange = (value: string) => {
        currentData && setCurrentData({ ...currentData, value: value })
    }

    return (
        <View style={{ marginTop: 32, marginHorizontal: 16 }}>
            <Text style={{ fontWeight: 600, fontSize: 16, color: "#32383D", lineHeight: 20 }}>
                Please take photos of both the front and back of your registration card
            </Text>
            <View style={{ marginTop: 24 }} >
                {currentData && <IdProofUploadCard data={currentData} onChange={handleChange} />}
            </View>
        </View>
    )
};

export default UploadCard;