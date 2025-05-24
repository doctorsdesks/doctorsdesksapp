import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';

interface CustomOTPProps {
  length?: number;
  onOTPComplete?: (otp: string) => void;
  boxStyle?: object;
  inputProps?: TextInputProps;
  isError?: boolean;
}

const CustomOTP: React.FC<CustomOTPProps> = ({
  length = 6,
  onOTPComplete,
  boxStyle = {},
  inputProps = {},
  isError = false,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);

  const colorScheme = useColorScheme() ?? 'light';

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    const completed = newOtp.join('');
    if (completed.length === length && !newOtp.includes('')) {
      onOTPComplete?.(completed);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <ThemedView>
      <ThemedText
        style={[
          styles.label,
          focusedIndex !== null && styles.labelFocused,
          isError && styles.labelError,
        ]}
      >
        OTP
      </ThemedText>

      <View style={styles.container}>
        {Array.from({ length }, (_, i) => (
          <TextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            value={otp[i]}
            onChangeText={(text) => handleChange(text.slice(-1), i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(null)}
            style={[
              styles.input,
              boxStyle,
              focusedIndex === i && styles.inputFocused,
              isError && styles.inputError,
              { color: Colors[colorScheme].text }
            ]}
            {...inputProps}
          />
        ))}
      </View>
      {isError && <ThemedText style={styles.error}>{"You entered incorrect OTP!"}</ThemedText>}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#8C8C8C',
    textAlign: 'left',
  },
  labelFocused: {
    color: '#2DB9B0',
  },
  labelError: {
    color: 'red',
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
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

export default CustomOTP;
