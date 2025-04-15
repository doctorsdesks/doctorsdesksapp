import { Keyboard, StyleSheet, TextInput, useColorScheme, View } from "react-native";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { finalText } from "./Utils";
import { ThemedView } from "./ThemedView";
import { Path, Svg } from "react-native-svg";

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
        <ThemedView style={{ width: "100%", overflow: "hidden", borderTopStartRadius: listOpened ? 38 : 80, borderTopEndRadius: listOpened ? 36 : 80, borderBottomEndRadius: listOpened ? 0 : 80, borderBottomStartRadius: listOpened ? 0 : 80, borderWidth: 1, borderColor: showPatientList || isFocused ? "#2DB9B0" : "#C3E7FB", backgroundColor: colorSchema === "dark" ? "#303135" : "#F6F5FA", paddingHorizontal: 20, paddingVertical: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }} >
            <View style={{ width: 28 }} >
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
                <Path d="M16.6918 17.325C17.0751 17.7084 17.6668 17.1167 17.2835 16.7417L14.1585 13.6084C15.2549 12.3956 15.8609 10.8183 15.8585 9.18338C15.8585 5.52505 12.8835 2.55005 9.22513 2.55005C5.5668 2.55005 2.5918 5.52505 2.5918 9.18338C2.5918 12.8417 5.5668 15.8167 9.22513 15.8167C10.8751 15.8167 12.4001 15.2084 13.5668 14.2L16.6918 17.325ZM3.4243 9.18338C3.4243 5.98338 6.03263 3.38338 9.2243 3.38338C12.4243 3.38338 15.0243 5.98338 15.0243 9.18338C15.0243 12.3834 12.4243 14.9834 9.2243 14.9834C6.03263 14.9834 3.4243 12.3834 3.4243 9.18338Z" fill="#707D9D"/>
            </Svg>
            </View>
            <TextInput
                placeholderTextColor={'#8C8C8C'}
                style={{ borderWidth: 1, borderRadius: 4, fontSize: 14, lineHeight: 20, width: "90%", borderColor: colorSchema === 'dark' ? "#303135" : "#F6F5FA"}}
                value={searchValue}
                onChangeText={handleChange}
                onFocus={() => setIsFocused(true)}
                placeholder={finalText("Search by patient name or number", translations, selectedLanguage)}
                keyboardType={'default'}
            />
        </ThemedView>
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
