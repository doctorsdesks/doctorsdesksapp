import MainFooter from '@/components/MainFooter';
import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';

const Tasks = () => {
    const { height } = Dimensions.get('screen');

    return (
        <View style={{ marginTop: 60, height: height, position: 'relative' }} >
            <Text style={{ marginTop: 12, fontSize: 16, fontWeight: 700 }} >
               Task
            </Text>
            <MainFooter selectedNav="task" />
        </View>
    );
};

export default Tasks;