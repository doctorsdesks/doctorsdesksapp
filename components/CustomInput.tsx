import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';

interface CustomInputProps {
  data: {
    id: string;
    type: string;
    inputType: string;
    value: string;
    label: string;
    isMandatory: boolean;
    errorMessage?: string;
  };
  onChange: (value: string, id: string) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ data, onChange }) => {
  const [isError, setIsError] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const { label, value, isMandatory, errorMessage } = data;

  const handleBlur = () => {
    if (isMandatory && !value) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const onLocalChange = (value: string) => {
    setIsError(false);
    onChange(value, data.id);
  }

  const isLabelInside = !isFocused && !value; // Determine if label should be inside the input

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        {/* Label */}
        <Text style={[styles.label, isLabelInside ? styles.labelInside : styles.labelTop, isFocused && styles.labelFocused, isError && styles.labelError]}>
          {label} {isMandatory && <Text style={styles.mandatory}>*</Text>}
        </Text>

        {/* Input */}
        <TextInput
          style={[styles.input, isFocused && { borderColor: '#2DB9B0' }, isError && { borderColor: "red"} ]}
          value={value}
          onChangeText={onLocalChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          underlineColorAndroid="transparent"
          selectionColor={Platform.OS === 'ios' ? 'green' : undefined}
          keyboardType={data.inputType === 'NUMBER' || data.inputType === 'PHONE' ? 'numeric' : 'default'}
        />
      </View>

      {/* Error Message */}
      {isError && errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  inputWrapper: {
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 10,
    backgroundColor: '#FCFCFC',
    paddingHorizontal: 5,
    fontSize: 14,
    color: '#8C8C8C',
    zIndex: -1,
  },
  labelInside: {
    top: 15, // Position the label inside the input when unfocused
  },
  labelTop: {
    top: -10, // Position the label above the input when focused
    zIndex: 1,
  },
  labelFocused: {
    color: '#2DB9B0',
    zIndex: 1,
  },
  labelError: {
    color: 'red',
  },
  mandatory: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc', // Default border color
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    paddingTop: 14, // Create extra space at the top for the label
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomInput;
