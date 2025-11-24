import { Colors } from '@/constants/color';
import React, { useState } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';
import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";


interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export default function FloatingLabelInput({ 
    
  label, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences'
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = new Animated.Value(value ? 1 : 0);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 20,
    top: isFocused || value ? -10 : 18,  
    fontSize: isFocused || value ? 12 : 16,  
    color: isFocused || value ? Colors.primary : '#999',  
    backgroundColor: isFocused || value ? Colors.white : Colors.gray, 
    paddingHorizontal: 4,
    paddingVertical: 2,
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={labelStyle}>
        {label}
      </Animated.Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          value && styles.inputFilled,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    backgroundColor: Colors.gray,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    fontFamily: 'Poppins_400Regular',

  },
  inputFilled:{
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    fontFamily: 'Poppins_400Regular',

  }
});