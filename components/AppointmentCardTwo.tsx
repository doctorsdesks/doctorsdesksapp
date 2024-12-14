import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Icon from './Icon';
import { AppointmentStatus } from '@/constants/Enums';
import CustomText from './CustomText';
import { changeTimeToAmPm } from './Utils';
import CustomButton from './CustomButton';

interface AppointmentCardTwoProps {
    lastAppointment: boolean;
    firstAppointment: boolean;
    name: string;
    number: string;
    startTime: string;
    status: string;
    handleStatusUpdate: (status: string) => void;
}

const AppointmentCardTwo: React.FC<AppointmentCardTwoProps> = ({ lastAppointment, firstAppointment, name, number, startTime, status, handleStatusUpdate }) => {
    const [parentHeight, setParentHeight] = useState(0);

    const handleLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setParentHeight(height);
    };

    const calculatedTop = parentHeight ? (parentHeight / 2) - 10 : 0;

    return (
        <View 
            style={{ 
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'relative',
                alignItems: 'center'
            }}
            onLayout={handleLayout}
        >
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    top: calculatedTop,
                    borderWidth: 1,
                    borderRadius: 20,
                    borderColor: "#2DB9B0",
                    backgroundColor: "#fff",
                    height: 20,
                    width: 20,
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3,
                }}
            >
                {status === AppointmentStatus.COMPLETED && <Icon iconType='rightTickAppointment' height='20' width='20' />}
            </View>
            <View 
                style={{
                    position: 'absolute',
                    left: 9,
                    top: firstAppointment && parentHeight ? parentHeight/2 : 0,
                    height: (firstAppointment || lastAppointment) && parentHeight ? parentHeight/2 : parentHeight,
                    width: 2,
                    backgroundColor: "#2DB9B0",
                    zIndex: 2
                }}
            />
            <View
                style={{
                    marginLeft: 36,
                }}
            >
                <CustomText text={changeTimeToAmPm(startTime)} textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#32383D" }} />
            </View>
            <View style={{ paddingVertical: 10 }} >
                <View
                    style={{
                        marginLeft: 16,
                        backgroundColor: "#EAF4F3",
                        paddingVertical: 8,
                        paddingRight: 16,
                        paddingLeft: 8,
                        borderLeftWidth: 8,
                        borderLeftColor: "#2DB9B0",
                        borderRadius: 8,
                        width: 200
                    }}
                >
                    <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#32383D" }} text={name} />
                    <CustomText textStyle={{ fontSize: 11, lineHeight: 16, fontWeight: 400, color: "#32383D", marginTop: 8 }} text={number} />
                    <Pressable
                        style={{
                            borderRadius: 4,
                            borderColor: "#2DB9B0",
                            borderWidth: 1,
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                            alignSelf: 'flex-end',
                            marginTop: 10
                        }}
                        onPress={() => handleStatusUpdate("COMPLETE")}
                    >
                        <CustomText textStyle={{ fontSize: 14, lineHeight: 16, fontWeight: 600, color: "#2DB9B0" }} text="Complete" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default AppointmentCardTwo;