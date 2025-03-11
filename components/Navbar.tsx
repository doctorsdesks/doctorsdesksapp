import React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import CustomText from './CustomText';

export interface NavbarProps {
    data: Array<NavbarObject>,
    onClick: (value: string) => void
}

export interface NavbarObject {
    label: string,
    isActive: boolean
}

const Navbar: React.FC<NavbarProps> = ({ data, onClick }) => {
    const { width } = Dimensions.get('window');


    return (
        <View style={{ display:'flex', flexDirection: 'row', alignItems: 'center' }}>
            {data?.map((item: NavbarObject) => {
                return (
                    <Pressable 
                        key={item?.label}
                        id={item?.label} 
                        onPress={() => onClick(item?.label)}
                        style={{ width: (width-32)/data?.length, display: 'flex', alignItems: 'center', borderBottomColor: item?.isActive ? "#2DB9B0" : "#A9A9AB", borderBottomWidth: item?.isActive ? 2 : 1, paddingVertical: 12, paddingHorizontal: 16 }} 
                    >
                        <CustomText multiLingual={true} textStyle={{ fontSize: 14, lineHeight: 20, fontWeight: item?.isActive ? 700 : 600, color: item?.isActive ? "#2DB9B0" : "#A9A9AB"}} text={item?.label} />
                    </Pressable>
                )
            })}
        </View>
    );
};

export default Navbar;