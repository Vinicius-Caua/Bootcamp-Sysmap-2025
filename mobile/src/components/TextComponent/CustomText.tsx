import {TextProps} from 'react-native';
import {Text} from 'react-native-gesture-handler';

interface CustomTextProps extends TextProps {
  style?: object;
}

export default function CustomText({
  children,
  style,
  ...props
}: CustomTextProps) {
  return (
    <Text {...props} style={style}>
      {children}
    </Text>
  );
}
