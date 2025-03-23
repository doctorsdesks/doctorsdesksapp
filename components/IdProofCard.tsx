import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardProps } from '@/constants/Enums';

interface IdProofCardProps {
    data: CardProps;
}

const IdProofCard: React.FC<IdProofCardProps> = ({ data }) => {


    return (
        <View 
            style={{ 
                marginTop: 12, 
                borderColor: "#D9D9D9", 
                borderWidth: 1, 
                borderRadius: 8, 
                width: "100%", 
                padding: 16,  
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row'
            }} 
        >
            <View style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }} >
                {data?.docIcon && data?.docIcon !== "" && <Image source={data?.docIcon} resizeMode='contain' height={32} width={32} />}
                <Text style={{ marginLeft: 12, color: "#32383D", fontSize: 14, fontWeight: 600 }} >
                    {data?.label}
                </Text>
            </View>
            {data?.isUploaded ? 
                <AntDesign name="checkcircle" size={32} color="#2DB9B0" />
            :
                <Ionicons name="arrow-forward" size={32} />
            }
        </View>
    )
}

export default IdProofCard;