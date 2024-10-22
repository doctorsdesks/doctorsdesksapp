import CustomInput2 from '@/components/CustomInput2';
import { CardProps } from '@/constants/Enums';
import React from 'react';
import { Text, View } from 'react-native';

interface IdProofUploadCardProps {
    data: CardProps;
    onChange: (value: string) => void;
}

const IdProofUploadCard: React.FC<IdProofUploadCardProps> = ({ data, onChange }) => {

    return (
        <View>
            <View
                style={{
                    borderWidth: 1,
                    borderColor: "#F1F1F1",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 20
                }}
            >
                <CustomInput2 
                    data={{
                        id: data?.id,
                        type: "STRING",
                        inputType: "TEXT",
                        value: data?.value,
                        label: data?.label,
                        isMandatory: true,
                        errorMessage: `Please enter valid ${data?.label} number.`,
                        placeholder: `${data?.label} Number`,
                    }} 
                    onChange={onChange}  
                />
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ color:"#32383D", fontSize: 14, fontWeight: 600, lineHeight: 20 }}>
                    Click & Upload Photos of Registration Card
                </Text>
            </View>
        </View>
    );
};

export default IdProofUploadCard;