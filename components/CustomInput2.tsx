import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Path, Svg } from 'react-native-svg';
import Icon from './Icons';

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
    initials?: string;
  };
  onChange: (value: string, id: string) => void;
  handleFocus?: () => void;
  handleBlur?: (value: string) => void;
  rightIcon?: string;
}

const CustomInput2: React.FC<CustomInput2Props> = ({ data, onChange, handleFocus, handleBlur, rightIcon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const { label, value, isMandatory, errorMessage, placeholder, inputType, id, isDisabled, initials } = data;
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
          {label} {isMandatory && !isDisabled && <Text style={styles.mandatory}>*</Text>}
        </ThemedText>
        {data?.isDisabled ? 
          <View
            style={[styles.input, { backgroundColor: Colors[colorScheme].cardBackgroud, display: 'flex', flexDirection: 'row', paddingVertical: data?.inputType === "AMOUNT" ? 0 : 10, paddingLeft: 0, paddingRight: 10, alignItems: 'center' }]}
          >
            {data?.inputType === "AMOUNT" && 
              <View style={{ height: 42, backgroundColor: "#2DB9B0", width: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 4, borderTopLeftRadius: 4  }} >
                <Icon type='rupee' />
              </View>
            }
            <ThemedText style={{ paddingLeft: 10 }} >
              {value}
            </ThemedText>
          </View>
        : inputType === 'DATE' ? (
          <>
            <Pressable onPress={() => setShowDatePicker(true)} style={[styles.input, isFocused && styles.inputFocused, isError && styles.inputError, { position: 'relative' }]}>
              <ThemedText style={{ color: value ? Colors[colorScheme].text : "#8C8C8C"}} >{value || placeholder}</ThemedText>
              {data?.inputType === "DATE" &&
                <View style={{ height: "100%", zIndex: 2, position: 'absolute', right:  6, top: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'  }} >
                  <Svg width="18" height="19" viewBox="0 0 18 19" fill="none" >
                    <Path d="M13.5 1.83594V3.33594M4.5 1.83594V3.33594" stroke="#A9A9AB" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    <Path d="M1.875 9.51837C1.875 6.25039 1.875 4.6164 2.81409 3.60117C3.75318 2.58594 5.26462 2.58594 8.2875 2.58594H9.7125C12.7354 2.58594 14.2468 2.58594 15.1859 3.60117C16.125 4.6164 16.125 6.25039 16.125 9.51837V9.90351C16.125 13.1715 16.125 14.8055 15.1859 15.8207C14.2468 16.8359 12.7354 16.8359 9.7125 16.8359H8.2875C5.26462 16.8359 3.75318 16.8359 2.81409 15.8207C1.875 14.8055 1.875 13.1715 1.875 9.90351V9.51837Z" stroke="#A9A9AB" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    <Path d="M2.25 6.33594H15.75" stroke="#A9A9AB" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  </Svg>
                </View>
              }
            </Pressable>
            {showDatePicker && (
              <DateTimePicker value={value ? new Date(value.split('-').reverse().join('-')) : new Date()} mode="date" display="default" onChange={handleDateChange} />
            )}
          </>
        ) : 
          <View style={{ position: 'relative' }} >
            <TextInput
              placeholderTextColor={'#8C8C8C'}
              style={[styles.input, isFocused && styles.inputFocused, isError && styles.inputError, { paddingLeft: (data?.inputType === "AMOUNT" || (data?.initials && data?.initials !== "")) ? 48 : 8, color: Colors[colorScheme].text }]}
              value={value}
              maxLength={inputType === 'NUMBER' && data?.id === "number" ? 10 : undefined}
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
            {data?.initials && data?.initials !== "" &&
              <View style={{ height: "100%", backgroundColor: "#2DB9B0", zIndex: 2, width: 40, position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 6, borderTopLeftRadius: 6  }} >
                <ThemedText style={{ fontSize: 16, lineHeight: 16 }} >{data?.initials}</ThemedText>
              </View>
            }
            {data?.inputType === "AMOUNT" && 
              <View style={{ height: "100%", backgroundColor: "#2DB9B0", zIndex: 2, width: 40, position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 6, borderTopLeftRadius: 6  }} >
                <Icon type='rupee' />
              </View>
            }
            {data?.inputType === "PASSWORD" && 
              <Pressable onPress={() => setShowPassword(!showPassword)} style={{ height: "100%", backgroundColor: "#2DB9B0", zIndex: 2, width: 40, position: 'absolute', right:  0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomRightRadius: 4, borderTopRightRadius: 4  }} >
                {showPassword ? <Ionicons name='eye' size={24} /> : <Ionicons name='eye-off-outline' size={24} />}
              </Pressable>
            }
            {rightIcon && rightIcon !== "" &&
              <ThemedView style={{ height: "100%", borderWidth: 1, borderLeftWidth: 0, borderColor: isFocused ? "#2DB9B0" : '#ccc', zIndex: 2, width: 40, position: 'absolute', right:  0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomRightRadius: 4, borderTopRightRadius: 4  }} >
                <Icon type={rightIcon} />
              </ThemedView>
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
