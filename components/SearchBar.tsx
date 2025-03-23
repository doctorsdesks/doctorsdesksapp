import { Dimensions, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { finalText, getSecureKey } from "./Utils";

interface SearchBarProps {
    searchPatients: (value: string) => void;
    setIsFocused:(value: boolean) => void;
    listOpened: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchPatients, setIsFocused, listOpened }) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const { translations, selectedLanguage } = useAppContext();

    const handleChange = (value: string) => {
        setSearchValue(value);
        searchPatients(value);
    };

    return (
        <View style={{ width: "100%", borderRadius: listOpened ? 34 : 80, borderBottomRightRadius: listOpened ? 0 : 80, borderBottomLeftRadius: listOpened ? 0 : 80, backgroundColor: "#F6F5FA", paddingHorizontal: 20, paddingVertical: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }} >
            <View style={{ width: 28 }} >
                <Ionicons name='search-sharp' size={20} />
            </View>
            <TextInput
                placeholderTextColor={'#8C8C8C'}
                style={[styles.input]}
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
        borderColor: '#F6F5FA',
        width: "100%",
    },
});
