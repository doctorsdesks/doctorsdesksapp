import { useAppContext } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { finalText } from './Utils';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface CustomInputBoxesProps {
    data: { 
        id: string;
        type: string;
        inputType: string;
        value: Array<string>,
        label: string;
        isMandatory: boolean;
        errorMessage: string;
        placeholder: string;
    };
    onChange: (value: string, id: string, type: string ) => void;
}

const CustomInputBoxes: React.FC<CustomInputBoxesProps> = ({ data, onChange }) => {
  const { translations, selectedLanguage } = useAppContext();
  const [languages, setLanguages] = useState<Array<any>>([]);
  useEffect(() => {
    if (translations) {
        const currentLanguages = Object.keys(translations);
        setLanguages(currentLanguages)
    }
},[translations])

    return (
        <ThemedView style={{ marginBottom: 16}} >
            <ThemedText style={styles.label}>
                {finalText(data?.label, translations, selectedLanguage)} {data?.isMandatory && <ThemedText style={styles.mandatory}>*</ThemedText>}
            </ThemedText>
            <View 
                style={{ 
                    display: 'flex',
                    flex: 1,
                    flexWrap: 'wrap',
                    rowGap: 12,
                    flexDirection: 'row'
                }}
            >
                {languages?.map((language: string) => {
                    return (
                        <Pressable 
                            key={language}
                            style={{ 
                                borderWidth: 1, 
                                borderRadius: 20, 
                                borderColor: "#2DB9B0", 
                                paddingHorizontal: 12, 
                                paddingVertical: 6, 
                                marginRight: 8,
                                backgroundColor: data?.value?.find((item) => item === language) ? "#2DB9B0" : "#fff"
                            }} 
                            onPress={() => {
                              data?.value?.find((item) => item === language) ?
                                  onChange(language, data?.id, "REMOVE")
                              :
                                onChange(language, data?.id, "ADD")
                            }}
                        >
                            <ThemedText style={{ color: data?.value?.find((item) => item === language) ? "#fff" : "#2DB9B0"}} >{language}</ThemedText>
                        </Pressable>
                    )
                })}
            </View>
            <ThemedText style={{ marginTop: 8, fontWeight: 400, fontSize: 12, color: "#757575"}} >
                {data?.placeholder}
            </ThemedText>
        </ThemedView>
    )
};

const styles = StyleSheet.create({
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
      borderRadius: 4,
      padding: 10,
      fontSize: 16,
      paddingTop: 14,
    },
    inputFocused: {
      borderColor: '#2DB9B0',
    },
    inputError: {
      borderColor: 'red',
    },
    error: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
    },
  });

export default CustomInputBoxes;