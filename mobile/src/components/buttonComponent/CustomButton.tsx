import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {Plus} from 'phosphor-react-native';
import styles from './styles';

interface CustomButtonProps {
  text?: string;
  variant: 'default' | 'ghost' | 'outline' | 'danger' | 'dark' | 'secundary';
  size: 'circle' | 'normal';
  disabled?: boolean;
  style?: object;
  onClick?: () => void;
}

export default function CustomButton({
  text,
  variant,
  size,
  style,
  disabled = false,
  onClick,
}: CustomButtonProps) {
  // Styles combinations for the button and text
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles],
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onClick} disabled={disabled}>
      {size === 'circle' ? (
        // if the button is a circle, display the icon
        <Plus size={25} color={'#ffffff'} weight="bold" />
      ) : (
        // if the button is not a circle, display the text
        <Text style={textStyle}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}
