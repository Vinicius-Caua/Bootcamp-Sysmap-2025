// DialogComponent.tsx
import React from 'react';
import {Modal, View, Text} from 'react-native';
import styles from './styles';
import CustomButton from '../buttonComponent/CustomButton';

interface DialogProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <CustomButton
              variant={'dark'}
              size={'normal'}
              style={styles.buttonCancel}
              onClick={onCancel}
              text="Cancelar"
            />

            <CustomButton
              variant={'danger'}
              size={'normal'}
              style={styles.buttonConfirm}
              onClick={onConfirm}
              text="Confirmar"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
