import React, {ReactNode, useState} from 'react';
import {
  Text,
  TextInputProps,
  View,
  ViewProps,
  TextInput,
  StyleProp,
  ViewStyle,
} from 'react-native';
import styles from './styles';
import THEME from '../../assets/themes/THEME';

interface InputRootProps extends ViewProps {
  children:
    | React.ReactElement<InputLabelProps | InputProps | InputErrorMessageProps>
    | React.ReactElement<
        InputLabelProps | InputProps | InputErrorMessageProps
      >[];
  isError?: boolean;
}

function InputRoot({children, isError, style, ...props}: InputRootProps) {
  return (
    <View {...props} style={style}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {isError});
        }
        return child;
      })}
    </View>
  );
}

interface InputLabelProps {
  children: ReactNode;
  required?: boolean;
  style?: object;
  isError?: boolean;
}

function InputLabel({
  children,
  style,
  required = false,
  isError,
}: InputLabelProps) {
  return (
    <Text style={[styles.label, isError && {color: THEME.COLORS.red}, style]}>
      {children}{' '}
      {required && <Text style={[styles.label, styles.required]}>*</Text>}
    </Text>
  );
}

interface InputProps extends TextInputProps {
  isError?: boolean;
}

function CustomInput({style, isError, ...props}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      {...props}
      placeholderTextColor={isError ? THEME.COLORS.red : THEME.COLORS.inputLabelGray}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[
        styles.input,
        isFocused && {borderColor: '#D4D4D4'},
        isError && {borderColor: THEME.COLORS.red},
        style,
      ]}
    />
  );
}

interface InputErrorMessageProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  isError?: boolean;
}

function InputErrorMessage({children, style, isError}: InputErrorMessageProps) {
  return (
    <View style={[{marginTop: 6}, style]}>
      {isError && <Text style={[styles.label, styles.error]}>{children}</Text>}
    </View>
  );
}

export const Input = {
  Root: InputRoot,
  Label: InputLabel,
  Input: CustomInput,
  ErrorMessage: InputErrorMessage,
};
