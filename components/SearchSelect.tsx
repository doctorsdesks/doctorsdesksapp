import { StringObject } from '@/constants/Enums';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';

interface SearchSelectProps {
    data: StringObject;
    onChange: (value: string, id: string) => void;
}

const SearchSelect: React.FC<SearchSelectProps> = ({ data, onChange }) => {
    const [searchText, setSearchText] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        // Filter options based on search text
        const filteredOptions = data?.options?.filter((item) => item?.toLowerCase()?.includes(searchText?.toLowerCase()));
        console.info("Sdfa", data?.options, filteredOptions)
        setFilteredOptions(filteredOptions || []);
    }, [searchText, data]);

    const handleSelect = (value: string) => {
        setSearchText(value);
        setIsFocused(false);
        setIsError(false);
        onChange(value, data?.id);
    };

    const handleBlur = () => {
        // Show error if no option is selected and it's mandatory
        if (data?.isMandatory && !data?.options?.includes(searchText)) {
            setIsError(true);
        }
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
            <Text style={[styles.label, isFocused && styles.labelFocused, isError && styles.labelError]}>
                {data?.label}
                {data?.isMandatory && <Text style={styles.mandatory}> *</Text>}
            </Text>
            <TextInput
                placeholderTextColor={'#8C8C8C'}
                style={[styles.input, isFocused && styles.inputFocused, isError && styles.inputError]}
                placeholder={data?.placeholder}
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
            />
            {isError && (
                <Text style={styles.errorText}>
                    Please select a valid option.
                </Text>
            )}
            {isFocused && (
                <FlatList
                    style={{ borderWidth: 1, borderColor: "#2DB9B0", borderTopRightRadius: 0, borderTopLeftRadius: 0, borderBottomRightRadius: 8, borderBottomLeftRadius: 8, top: -2, paddingTop: 2 }}
                    data={filteredOptions}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => handleSelect(item)} style={styles.option}>
                            <Text style={styles.optionText}>{item}</Text>
                        </Pressable>
                    )}
                />
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
    },
    label: {
        fontSize: 14,
        color: '#8C8C8C',
        marginBottom: 8,
    },
    labelFocused: {
        color: '#2DB9B0',
    },
    labelError: {
        color: 'red',
    },
    mandatory: {
        color: 'red',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    inputFocused: {
        borderColor: '#2DB9B0',
    },
    inputError: {
        borderColor: 'red',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopWidth: 0,
        maxHeight: 150,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    option: {
        paddingLeft: 12,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: "#99E4DF",
    },
    optionText: {
        color: "#2DB9B0",
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "600",
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});

export default SearchSelect;
