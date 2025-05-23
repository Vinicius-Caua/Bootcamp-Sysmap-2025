import {Text, TextProps} from 'react-native';
import styles from './styles';

interface CustomTitleProps extends TextProps {
  style?: object;
}

export default function CustomTitle({
  children,
  style,
  ...props
}: CustomTitleProps) {
  return (
    <Text {...props} style={[styles.text, style]}>
      {children}
    </Text>
  );
}
