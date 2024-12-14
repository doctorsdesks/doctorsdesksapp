import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface CustomRadioProps {
  data: {
    id: string;
    type: string;
    inputType: 'RADIO';
    value: string;
    label: string;
    isMandatory: boolean;
    errorMessage?: string;
    options: Array<'MALE' | 'FEMALE' | 'OTHER'>;
    isDisabled?: boolean;
  };
  onChange: (value: string, id: string) => void;
}

const CustomRadio: React.FC<CustomRadioProps> = ({ data, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(data.value);
  const { id, label, isMandatory, errorMessage, options } = data;

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange(value, id);
  };

  return (
    <View>
      <Text style={[styles.label]}>
        {label} {isMandatory && <Text style={styles.mandatory}>*</Text>}
      </Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <View
            key={option}
            style={styles.option}
          >
            <Pressable
                style={{
                    height: 20,
                    width: 20,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: selectedValue === option ? '#2DB9B0' : '#ccc',
                    backgroundColor: selectedValue === option ? '#2DB9B0' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                }}
                onPress={() => !data?.isDisabled && handleSelect(option)}
            />
            <Pressable onPress={() => !data?.isDisabled && handleSelect(option)}>
              <Text
                style={[
                  styles.optionText,
                  selectedValue === option && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#8C8C8C',
    marginBottom: 5,
  },
  mandatory: {
    color: 'red',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    paddingVertical: 10,
    paddingRight: 10,
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  optionText: {
    fontSize: 14,
    color: '#8C8C8C',
  },
  optionTextSelected: {
    color: '#2DB9B0',
  },
});

export default CustomRadio;