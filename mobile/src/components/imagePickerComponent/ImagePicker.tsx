import {View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import styles from './styles';
import {fixUrl} from '../../utils/fixUrl';
import {Camera} from 'phosphor-react-native';

const defaultActivityImage = require('../../../assets/images/defaultPickerImageActivity.png');
const defaultUserImage = require('../../../assets/images/defaultProfilePhoto.png');

interface ImagePickerProps {
  initialImage?: string;
  typePicker: 'user' | 'activity';
  onImageChange?: (imageUri: string) => void;
  cameraIconColor?: string;
}

export default function ImagePicker({
  initialImage,
  typePicker,
  onImageChange,
  cameraIconColor,
}: ImagePickerProps) {
  const [selectedImage, setSelectedImage] = useState<string>(
    initialImage || '',
  );
  const [isNewImage, setIsNewImage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Update the selected image when the initialImage prop changes
  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
    }
  }, [initialImage]);

  async function pickImage() {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    const response = await launchImageLibrary(options);

    if (response.assets && response.assets[0].uri) {
      const imageUri = response.assets[0].uri;
      setSelectedImage(imageUri);
      setIsNewImage(true);

      // Call the onImageChange callback if provided
      if (onImageChange) {
        onImageChange(imageUri);
      }
    }
  }

  // Define the default image based on the typePicker prop
  const defaultImage =
    typePicker === 'user' ? defaultUserImage : defaultActivityImage;

  // Define the image style based on the typePicker prop and hover state
  const imageStyle = [
    typePicker === 'user' ? styles.imageUser : styles.imageActivity,
    isHovered ? styles.editBorder : null,
  ];

  // Define the container style based on the typePicker prop
  const containerStyle =
    typePicker === 'user'
      ? [styles.imageUserContainer]
      : [styles.imageActivityContainer];

  // Define the overlay style
  const overlayStyle = [
    styles.imageOverlay,
    typePicker === 'user' ? styles.userOverlay : styles.activityOverlay,
  ];

  // Define the image source based on the selectedImage state
  const imageSource = () => {
    if (!selectedImage) {
      return defaultImage;
    }

    if (isNewImage) {
      // If it's a new image, use the selectedImage directly
      return {uri: selectedImage};
    } else {
      // If it's not a new image, use the default image
      return {uri: fixUrl(selectedImage)};
    }
  };
  return (
    <>
      <View style={containerStyle}>
        <TouchableOpacity
          onPress={pickImage}
          onPressIn={() => setIsHovered(true)}
          onPressOut={() => setIsHovered(false)}
          activeOpacity={0.8}>
          <Image
            resizeMethod="resize"
            resizeMode="cover"
            source={imageSource()}
            style={imageStyle}
          />
          {typePicker === 'user' && (
            <View style={styles.cameraIconContainer}>
              <Camera size={50} color={cameraIconColor} />
            </View>
          )}
         {/* Overlay cinza com texto "Editar" */}
          <View style={overlayStyle} />
        </TouchableOpacity>
      </View>
    </>
  );
}
