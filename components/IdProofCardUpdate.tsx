import { CardProps } from '@/constants/Enums';
import React from 'react';
import { Text, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface IdProofCardUpdateProps {
    data: CardProps;
}

const IdProofCardUpdate: React.FC<IdProofCardUpdateProps> = ({ data }) => {

    return (
        <ThemedView>
            <ThemedText>
                {data.label}
            </ThemedText>
        </ThemedView>
    )
};

export default IdProofCardUpdate;