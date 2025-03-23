import { Keyboard, StyleSheet, TextInput, useColorScheme, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { finalText, getSecureKey } from "./Utils";

interface SearchBarProps {
    searchPatients: (value: string) => void;
    listOpened: boolean;
    showPatientList: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchPatients, listOpened, showPatientList }) => {
    const colorSchema = useColorScheme();
    const [searchValue, setSearchValue] = useState<string>("");
    const { translations, selectedLanguage } = useAppContext();
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardOpen(true);
            setIsFocused(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardOpen(false);
            setIsFocused(false);
        });

          return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
          };
    },[])

    const handleChange = (value: string) => {
        setSearchValue(value);
        searchPatients(value);
    };

    return (
        <View style={{ width: "100%", overflow: "hidden", borderTopStartRadius: listOpened ? 38 : 80, borderTopEndRadius: listOpened ? 36 : 80, borderBottomEndRadius: listOpened ? 0 : 80, borderBottomStartRadius: listOpened ? 0 : 80, borderWidth: 1, borderColor: showPatientList || isFocused ? "#2DB9B0" : "#F6F5FA", backgroundColor: colorSchema === "dark" ? "#303135" : "#F6F5FA", paddingHorizontal: 20, paddingVertical: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }} >
            <View style={{ width: 28 }} >
                <Ionicons name='search-sharp' size={20} />
            </View>
            <TextInput
                placeholderTextColor={'#8C8C8C'}
                style={{ borderWidth: 1, borderRadius: 4, padding: 10, fontSize: 16, width: "90%", borderColor: colorSchema === 'dark' ? "#303135" : "#F6F5FA"}}
                value={searchValue}
                onChangeText={handleChange}
                onFocus={() => setIsFocused(true)}
                placeholder={finalText("Search by patient name or number", translations, selectedLanguage)}
                keyboardType={'default'}
            />
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
        borderColor: '#303135',
        width: "90%",
    },
});
