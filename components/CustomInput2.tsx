import { useAppContext } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Pressable } from 'react-native';
import { finalText } from './Utils';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface CustomInput2Props {
  data: {
    id: string;
    type: string;
    inputType: string;
    value: string;
    label: string;
    isMandatory?: boolean;
    errorMessage?: string;
    placeholder?: string;
    isDisabled?: boolean;
    isError?: boolean;
  };
  onChange: (value: string, id: string) => void;
  handleFocus?: () => void;
  handleBlur?: (value: string) => void;
}

const CustomInput2: React.FC<CustomInput2Props> = ({ data, onChange, handleFocus, handleBlur }) => {
  const { translations, selectedLanguage } = useAppContext();
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const { label, value, isMandatory, errorMessage, placeholder, inputType, id, isDisabled } = data;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      const error = data?.isError || false;
      setIsError(error);
    }
  },[data])

  const colorScheme = useColorScheme() || 'light';

  const handleBlurLocal = () => {
    handleBlur && handleBlur(data?.value);
    setIsFocused(false);
    validateInput();
  };

  const handleFocusLocal = () => {
    setIsFocused(true);
    handleFocus && handleFocus();
  };

  const validateInput = () => {
    if (isMandatory && !value) {
      setIsError(true);
      return;
    }

    if (inputType === 'EMAIL' && value !== "" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      setIsError(true);
      return;
    }

    if(id === "pincode" && value?.length < 6){
      setIsError(true);
      return;
    }

    if ((inputType === 'NUMBER' || inputType === 'AMOUNT') && /\D/.test(value)) {
      setIsError(true);
      return;
    }

    if (inputType === "PASSWORD" && value?.length < 8) {
      setIsError(true);
      return;
    }

    setIsError(false);
  };

  const onLocalChange = (value: string) => {
    setIsError(false);
    if(data?.id === "pincode") {
      if (value?.length <= 6){
        onChange(value, data.id);
      }
    } else {
      onChange(value, data.id);
    }
  }

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onChange(formatDate(selectedDate), id);
    }
  };

  return (
    <ThemedView>
        <ThemedText style={[styles.label, isFocused && styles.labelFocused, isError && styles.labelError]}>
          {finalText(label, translations, selectedLanguage)} {isMandatory && !isDisabled && <Text style={styles.mandatory}>*</Text>}
        </ThemedText>
        {data?.isDisabled ? 
          <View
            style={[styles.input, { backgroundColor: Colors[colorScheme].cardBackgroud }]}
          >
            <ThemedText>
              {value}
            </ThemedText>
          </View>
        : inputType === 'DATE' ? (
          <>
            <Pressable onPress={() => setShowDatePicker(true)} style={[styles.input, isFocused && styles.inputFocused, isError && styles.inputError]}>
              <Text style={{ color: value ? Colors[colorScheme].text : "#8C8C8C"}} >{value || placeholder}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker value={value ? new Date(value.split('-').reverse().join('-')) : new Date()} mode="date" display="default" onChange={handleDateChange} />
            )}
          </>
        ) : 
          <View style={{ position: 'relative' }} >
            <TextInput
              placeholderTextColor={'#8C8C8C'}
              style={[styles.input, isFocused && styles.inputFocused, isError && styles.inputError, { paddingLeft: data?.inputType === "AMOUNT" ? 48 : 8, color: Colors[colorScheme].text }]}
              value={value}
              onChangeText={onLocalChange}
              onBlur={handleBlurLocal}
              onFocus={handleFocusLocal}
              placeholder={placeholder}
              secureTextEntry={inputType === "PASSWORD" && !showPassword}
              autoCapitalize={inputType === "PASSWORD" || inputType === "EMAIL" ? "none" : "sentences"}
              keyboardType={
                inputType === 'NUMBER' || inputType === 'PHONE' || inputType === 'AMOUNT'
                  ? 'numeric'
                  : 'default'
              }
            />
            {data?.inputType === "AMOUNT" && 
              <View style={{ height: "100%", backgroundColor: "#2DB9B0", zIndex: 2, width: 40, position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 6, borderTopLeftRadius: 6  }} >
                <Image source={require('../assets/images/rupee.png')} resizeMode='contain' height={24} width={24} />
              </View>
            }
            {data?.inputType === "PASSWORD" && 
              <Pressable onPress={() => setShowPassword(!showPassword)} style={{ height: "100%", backgroundColor: "#2DB9B0", zIndex: 2, width: 40, position: 'absolute', right:  0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomRightRadius: 4, borderTopRightRadius: 4  }} >
                {showPassword ? <Ionicons name='eye' size={24} /> : <Ionicons name='eye-off-outline' size={24} />}
              </Pressable>
            }
          </View>
        }
      {isError && errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#8C8C8C',
    marginBottom: 6
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

export default CustomInput2;
