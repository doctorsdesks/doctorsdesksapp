import React from 'react';
import { Dimensions, Pressable } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { finalText } from './Utils';
import { useAppContext } from '@/context/AppContext';

export interface NavbarProps {
    data: Array<NavbarObject>,
    onClick: (value: string) => void,
    source?: string
}

export interface NavbarObject {
    label: string,
    isActive: boolean
}

const Navbar: React.FC<NavbarProps> = ({ data, onClick, source }) => {
    const { translations, selectedLanguage } = useAppContext();
    const { width } = Dimensions.get('window');

    const getValue = (item: any) => {
        if (source === "appointment") {
            const [actualLabel, count] = item?.label?.split(" ");
            return finalText(actualLabel, translations, selectedLanguage) + " " + count;
        } else {
            return finalText(item?.label, translations, selectedLanguage);
        }
    }

    return (
        <ThemedView style={{ display:'flex', flexDirection: 'row', alignItems: 'center' }}>
            {data?.map((item: NavbarObject) => {
                return (
                    <Pressable 
                        key={item?.label}
                        id={item?.label} 
                        onPress={() => onClick(item?.label)}
                        style={{ width: (width-32)/data?.length, display: 'flex', alignItems: 'center', borderBottomColor: item?.isActive ? "#2DB9B0" : "#fff", borderBottomWidth: item?.isActive ? 2 : 0, paddingVertical: 12, paddingHorizontal: 16, paddingBottom: item?.isActive ? 12 : 14 }} 
                    >
                       <ThemedText style={{ fontSize: 14, lineHeight: 20, fontWeight: item?.isActive ? 700 : 600, color: item?.isActive ? "#2DB9B0" : "#A9A9AB"}}>{getValue(item)}</ThemedText>
                    </Pressable>
                )
            })}
        </ThemedView>
    );
};

export default Navbar;