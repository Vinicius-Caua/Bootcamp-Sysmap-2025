// src/components/imageComponent/ImageWithLoading.tsx
import React, { useState } from 'react';
import {
    Image,
    ActivityIndicator,
    View, ImageProps
} from 'react-native';
import { fixUrl } from '../../utils/fixUrl';
import styles from './styles';
import THEME from '../../assets/themes/THEME';

interface ImageWithLoadingProps extends ImageProps {
  imageUrl?: string;
  defaultImage?: any;
  showLoading?: boolean;
}

export default function ImageWithLoading({
  imageUrl,
  defaultImage,
  style,
  showLoading = true,
  ...props
}: ImageWithLoadingProps) {
  const [loading, setLoading] = useState(false);

  // Define the default image if not provided
  const source = imageUrl ? {uri: fixUrl(imageUrl)} : defaultImage;

  return (
    <View style={[styles.container, style]}>
      {loading && showLoading && (
        <View style={[styles.loadingContainer, style]}>
          <ActivityIndicator size="large" color={THEME.COLORS.gray} />
        </View>
      )}

      <Image
        {...props}
        source={source}
        style={[styles.image, style, loading ? {opacity: 0} : {opacity: 1}]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
}
