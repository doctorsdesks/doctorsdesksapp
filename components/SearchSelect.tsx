import { StringObject } from '@/constants/Enums';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { Colors } from '@/constants/Colors';
import { ThemedText } from './ThemedText';
import { finalText } from './Utils';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import CustomModal from './CustomModal';

interface SearchSelectProps {
    data: StringObject;
    onChange: (value: string, id: string) => void;
}

const SearchSelect: React.FC<SearchSelectProps> = ({ data, onChange }) => {
    const { translations, selectedLanguage } = useAppContext();
    const [searchText, setSearchText] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    useEffect(() => {
        // Filter options based on search text
        const filteredOptions = data?.options?.filter((item) => item?.toLowerCase()?.includes(searchText?.toLowerCase()));
        setFilteredOptions(filteredOptions || []);
    }, [searchText, data]);

    const handleSelect = (value: string) => {
        setSearchText(value);
        setIsFocused(false);
        setIsError(false);
        onChange(value, data?.id);
    };

    const handleClear = () => {
        setSearchText('');
        onChange('', data?.id);
    };

    useEffect(() => {
        if(isError){
            setIsFocused(false);
        }
    },[isError])

    useEffect(() => {
        if(isFocused){
            setIsError(false);
        }
    },[isFocused])

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={[styles.label, isFocused && styles.labelFocused, isError && styles.labelError]}>
                {finalText(data?.label, translations, selectedLanguage)} {data?.isMandatory && !data?.isDisabled && <Text style={styles.labelError}>*</Text>}
            </ThemedText>
            <Pressable onPress={() => setIsFocused(true)}>
                <TextInput
                    placeholderTextColor={'#8C8C8C'}
                    style={[
                        styles.input,
                        { 
                            backgroundColor: colors.background,
                            borderColor: colors.borderColor,
                            color: colors.text
                        },
                        isFocused && { borderColor: colors.borderColorSelected },
                        isError && { borderColor: colors.errorBorder }
                    ]}
                    placeholder={data?.placeholder}
                    value={searchText}
                    editable={false}
                />
            </Pressable>
            {isError && (
                <Text style={[
                    styles.errorText,
                    { color: colors.errorBorder }
                ]}>
                    Please select a valid option.
                </Text>
            )}
            <CustomModal visible={isFocused} onClose={() => setIsFocused(false)}>
                <View style={[
                    styles.modalHeader,
                    { borderBottomColor: colors.borderColor }
                ]}>
                    <View style={styles.modalHeaderTitle}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            {data?.label}
                        </Text>
                        <Pressable 
                            onPress={() => setIsFocused(false)}
                            style={styles.closeButton}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.icon }]}>✕</Text>
                        </Pressable>
                    </View>
                    <View style={styles.modalHeaderContent}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholderTextColor={'#8C8C8C'}
                                style={[
                                    styles.modalInput,
                                    {
                                        backgroundColor: colors.background,
                                        borderColor: colors.borderColorSelected,
                                        color: colors.text
                                    }
                                ]}
                                placeholder={data?.placeholder}
                                value={searchText}
                                onChangeText={setSearchText}
                                autoFocus
                            />
                            {searchText ? (
                                <Pressable 
                                    onPress={handleClear}
                                    style={styles.clearButton}
                                >
                                    <Text style={[styles.closeButtonText, { color: colors.icon }]}>✕</Text>
                                </Pressable>
                            ) : null}
                        </View>
                    </View>
                </View>
                <FlatList
                    data={filteredOptions}
                    keyExtractor={(item) => item}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <Pressable 
                            onPress={() => handleSelect(item)} 
                            style={({ pressed }) => [
                                styles.option,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.borderColor
                                },
                                pressed && { backgroundColor: colors.backgroundSelected }
                            ]}
                        >
                            <Text style={[
                                styles.optionText,
                                { color: colors.borderColorSelected }
                            ]}>{item}</Text>
                        </Pressable>
                    )}
                    style={styles.list}
                />
            </CustomModal>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
        position: 'relative',
    },
    labelFocused: {
        color: '#2DB9B0',
    },
    labelError: {
        color: 'red',
    },
    modalHeader: {
        padding: 16,
        borderBottomWidth: 1,
    },
    modalHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modalHeaderTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    modalInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        paddingRight: 40,
    },
    clearButton: {
        position: 'absolute',
        right: 8,
        padding: 8,
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: '500',
    },
    list: {
        maxHeight: '100%',
    },
    label: {
        color: '#8C8C8C',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    option: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    optionText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "600",
    },
    errorText: {
        fontSize: 12,
        marginTop: 5,
    },
});

export default SearchSelect;
