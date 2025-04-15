import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardProps } from '@/constants/Enums';
import { ThemedText } from './ThemedText';
import { Path, Svg } from 'react-native-svg';
import Icon from './Icons';

interface IdProofCardProps {
    data: CardProps;
    type?: string;
}

const IdProofCard: React.FC<IdProofCardProps> = ({ data, type }) => {

    const getIcon = () => {
        if (type === "Aadhar" || type === "Pan") {
            return (
                <Icon type='aadhaarPan' />
            )
        } else {
            return (
                <Icon type='registration' />
            );
        }
    }


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
                {getIcon()}
                <ThemedText style={{ marginLeft: 12, color: "#32383D", fontSize: 14, fontWeight: 600 }} >
                    {data?.label}
                </ThemedText>
            </View>
            {data?.isUploaded ? 
                <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
                    <Path d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10Z" fill="#2DB9B0"/>
                    <Path d="M6 10.5L8.5 13L14 7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </Svg>
            :
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
                    <Path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#A9A9AB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </Svg>
            }
        </View>
    )
}

export default IdProofCard;