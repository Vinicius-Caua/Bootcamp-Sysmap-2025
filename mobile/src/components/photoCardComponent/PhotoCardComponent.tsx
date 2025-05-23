import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../textComponent/CustomText';
import styles from './style';
import {fixUrl} from '../../utils/fixUrl';
import THEME from '../../assets/themes/THEME';

interface PhotoCardComponentProps {
  image: ImageSourcePropType;
  title?: string;
  onPress?: () => void;
  selected?: boolean;
  size?: 'small' | 'big';
  isLoading?: boolean;
}

export default function PhotoCardComponent({
  image,
  title,
  onPress,
  selected,
  size = 'small',
  isLoading = true,
}: PhotoCardComponentProps) {
  const [loading, setLoading] = useState(false);

  const imageSource = typeof image === 'string' ? {uri: fixUrl(image)} : image;

  // Determine the size of the image based on the size prop
  const imageStyle = size === 'big' ? styles.bigImage : styles.smallImage;

  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <View style={{position: 'relative'}}>
        {loading && isLoading && (
          <View
            style={[
              styles.loadingContainer,
              imageStyle,
              selected === true ? styles.selectedImage : null,
            ]}>
            <ActivityIndicator size="small" color={THEME.COLORS.gray} />
          </View>
        )}

        <Image
          source={imageSource}
          style={[
            imageStyle,
            selected === true ? styles.selectedImage : null,
            loading ? {opacity: 0} : {opacity: 1},
          ]}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>

      {title && <CustomText style={styles.text}>{title}</CustomText>}
    </TouchableOpacity>
  );
}
