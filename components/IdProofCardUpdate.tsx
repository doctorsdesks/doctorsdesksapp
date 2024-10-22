import { CardProps } from '@/constants/Enums';
import React from 'react';
import { Text, View } from 'react-native';

interface IdProofCardUpdateProps {
    data: CardProps;
}

const IdProofCardUpdate: React.FC<IdProofCardUpdateProps> = ({ data }) => {

    return (
        <View>
            <Text>
                {data.label}
            </Text>
        </View>
    )
};

export default IdProofCardUpdate;