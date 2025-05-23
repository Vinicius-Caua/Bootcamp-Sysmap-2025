import { Text, TouchableOpacity } from 'react-native';
import styles from './styles';

interface TextLinkProps {
  onPress: () => void;
  simpleText: string;
  boldText?: string;
}

export default function TextLink({
  boldText,
  onPress,
  simpleText,
}: TextLinkProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>
        {simpleText}
        {boldText && (
          <Text style={[styles.text, styles.boldText]}>{boldText}</Text>
        )}
      </Text>
    </TouchableOpacity>
  );
}
