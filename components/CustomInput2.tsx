import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface CustomInput2Props {
  data: {
    id: string;
    type: string;
    inputType: string;
    value: string;
    label: string;
    isMandatory: boolean;
    errorMessage?: string;
    placeholder: string;
  };
  onChange: (value: string, id: string) => void;
}

const CustomInput2: React.FC<CustomInput2Props> = ({ data, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const { label, value, isMandatory, errorMessage, placeholder, inputType } = data;

  const handleBlur = () => {
    setIsFocused(false);
    validateInput();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const validateInput = () => {
    if (isMandatory && !value) {
      setIsError(true);
      return;
    }

    if (inputType === 'EMAIL' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
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
    onChange(value, data.id);
  }

  return (
    <View style={styles.container}>
        <Text style={[styles.label, isFocused && styles.labelFocused, isError && styles.labelError]}>
          {label} {isMandatory && <Text style={styles.mandatory}>*</Text>}
        </Text>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused, isError && styles.inputError]}
          value={value}
          onChangeText={onLocalChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          keyboardType={
            inputType === 'NUMBER' || inputType === 'PHONE' || inputType === 'AMOUNT'
              ? 'numeric'
              : 'default'
          }
        />
      {isError && errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
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
});

export default CustomInput2;