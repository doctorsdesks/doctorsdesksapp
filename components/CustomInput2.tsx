import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';

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
  };
  onChange: (value: string, id: string) => void;
  handleFocus?: () => void;
  handleBlur?: (value: string) => void;
}

const CustomInput2: React.FC<CustomInput2Props> = ({ data, onChange, handleFocus, handleBlur }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const { label, value, isMandatory, errorMessage, placeholder, inputType, id } = data;

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

  return (
    <View>
        <Text style={[styles.label, isFocused && styles.labelFocused, isError && styles.labelError]}>
          {label} {isMandatory && <Text style={styles.mandatory}>*</Text>}
        </Text>
        {data?.isDisabled ? 
          <View
            style={[styles.input, styles.disabled]}
          >
            <Text>
              {value}
            </Text>
          </View>
        :
          <View style={{ position: 'relative' }} >
            <TextInput
              placeholderTextColor={'#8C8C8C'}
              style={[styles.input, isFocused && styles.inputFocused, isError && styles.inputError, { paddingLeft: data?.inputType === "AMOUNT" ? 44 : 0 }]}
              value={value}
              onChangeText={onLocalChange}
              onBlur={handleBlurLocal}
              onFocus={handleFocusLocal}
              placeholder={placeholder}
              keyboardType={
                inputType === 'NUMBER' || inputType === 'PHONE' || inputType === 'AMOUNT'
                  ? 'numeric'
                  : 'default'
              }
            />
            {data?.inputType === "AMOUNT" && 
              <View style={{ height: "100%", backgroundColor: "#A9A9AB", zIndex: 2, width: 40, position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 6, borderTopLeftRadius: 6  }} >
                <Image source={require('../assets/images/rupee.png')} resizeMode='contain' height={24} width={24} />
              </View>
            }
          </View>
        }
      {isError && errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    backgroundColor: '#FCFCFC',
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
  disabled: {
    backgroundColor: "#CFD8DC"
  }
});

export default CustomInput2;