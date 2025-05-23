import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {CaretLeft} from 'phosphor-react-native';
import styles from './styles';
import CustomTitle from '../TitleComponent/CustomTitle';
import ImagePicker from '../imagePickerComponent/ImagePicker';
import {Input} from '../inputComponent/CustomInput';
import DatePicker from '../datePickerComponent/DatePicker';
import CustomButton from '../buttonComponent/CustomButton';
import CustomText from '../textComponent/CustomText';
import ActivityTypes from '../acitivityTypesComponent/ActivityTypes';
import Map from '../mapsComponent/Maps';
import useAppContext from '../../hooks/useAppContext';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

interface ActivityCreateModalProps {
  visible: boolean;
  onClose: () => void;
  onActivityCreated?: () => void;
}

export default function ActivityCreateModal({
  visible,
  onClose,
  onActivityCreated,
}: ActivityCreateModalProps) {
  const [titulo, setTitulo] = useState('');
  const [tituloError, setTituloError] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [descricaoError, setDescricaoError] = useState(false);
  const [data, setData] = useState<Date | null>(null);
  const [dataError, setDataError] = useState(false);
  const [activityType, setActivityType] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [imageUri, setImageUri] = useState('');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [activityTypeError, setActivityTypeError] = useState(false);
  const [imageUriError, setImageUriError] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const {
    activities: {createActivity},
  } = useAppContext();

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setData(null);
    setActivityType('');
    setIsPrivate(true);
    setImageUri('');
    setLocation(null);
    setTituloError(false);
    setDescricaoError(false);
    setDataError(false);
    setActivityTypeError(false);
    setImageUriError(false);
    setLocationError(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle to select the activity type
  const handleTypeSelect = (typeId: string) => {
    setActivityType(typeId);
  };

  // Handles set visibility
  const handleVisibilityPrivateTrue = () => {
    setIsPrivate(true);
  };
  const handleVisibilityPrivateFalse = () => {
    setIsPrivate(false);
  };

  const handleRegisterActivity = async () => {
    // Reset all error states
    setTituloError(false);
    setDescricaoError(false);
    setDataError(false);
    setActivityTypeError(false);
    setImageUriError(false);
    setLocationError(false);

    let isValid = true;

    // Validate all required fields
    if (!titulo) {
      setTituloError(true);
      isValid = false;
    }

    if (!descricao) {
      setDescricaoError(true);
      isValid = false;
    }

    if (!data) {
      setDataError(true);
      isValid = false;
    }

    if (!activityType) {
      setActivityTypeError(true);
      isValid = false;
    }

    if (!imageUri) {
      setImageUriError(true);
      isValid = false;
    }

    if (!location) {
      setLocationError(true);
      isValid = false;
    }

    // If any validation failed, show a single toast and return
    if (!isValid) {
      Toast.show({
        type: 'error',
        text1: 'Complete todos os campos',
        text2: 'Todos os campos são obrigatórios para criar a atividade',
      });
      return;
    }

    // All validations passed, proceed with API call
    try {
      // Convert location to string format for API
      const addressString = JSON.stringify(location);

      // Format date to ISO string
      const formattedDate = data?.toISOString() || '';

      // Call the API to create the activity
      await createActivity(
        titulo,
        descricao,
        activityType,
        addressString,
        imageUri,
        formattedDate,
        isPrivate,
      );

      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Atividade criada com sucesso!',
      });

      // Reset form and close modal
      resetForm();
      onClose();

      onActivityCreated?.();
    } catch (error) {
      // Handle errors
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar atividade',
        text2: 'Tente novamente mais tarde',
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={handleClose}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            {/* Card Component */}
            <TouchableOpacity onPress={handleClose}>
              <CaretLeft size={30} weight="bold" />
            </TouchableOpacity>
            <View>
              <CustomTitle>Cadastrar atividade</CustomTitle>
            </View>
          </View>
          <View style={styles.bodyContainer}>
            {/* Image Picker Container */}
            <View style={styles.imageContainer}>
              <CustomText
                style={[
                  styles.label,
                  styles.imageLabel,
                  imageUriError && styles.errorLabel,
                ]}>
                Imagem<CustomText style={styles.errorLabel}> *</CustomText>
              </CustomText>

              <View style={[imageUriError && styles.errorBorder]}>
                <ImagePicker
                  typePicker="activity"
                  onImageChange={uri => {
                    setImageUri(uri);
                    setImageUriError(false);
                  }}
                />
              </View>

              {imageUriError && (
                <CustomText style={styles.errorMessage}>
                  Selecione uma imagem para a atividade
                </CustomText>
              )}
            </View>
            {/* Form Component */}
            <View style={styles.formContainer}>
              <View style={styles.form}>
                <Input.Root isError={tituloError}>
                  <Input.Label required>Título</Input.Label>
                  <Input.Input
                    value={titulo}
                    onChangeText={text => {
                      setTitulo(text);
                      setTituloError(false);
                    }}
                  />
                  <Input.ErrorMessage>
                    Preencha o campo com o título da atividade!
                  </Input.ErrorMessage>
                </Input.Root>
                <Input.Root isError={descricaoError}>
                  <Input.Label required>Descrição</Input.Label>
                  <Input.Input
                    value={descricao}
                    onChangeText={text => {
                      setDescricao(text);
                      setDescricaoError(false);
                    }}
                  />
                  <Input.ErrorMessage>
                    Preencha o campo com a descrição do evento!
                  </Input.ErrorMessage>
                </Input.Root>
                <Input.Root isError={dataError}>
                  <Input.Label required>Data do Evento</Input.Label>
                  <DatePicker
                    onChange={selectedDate => {
                      setData(selectedDate);
                      setDataError(false);
                    }}
                    label={''}
                  />
                  <Input.ErrorMessage>
                    Preencha o campo com a data do evento!
                  </Input.ErrorMessage>
                </Input.Root>
              </View>
            </View>
            {/* Maps */}
            <View style={styles.mapsContainer}>
              <CustomText
                style={[styles.label, locationError && styles.errorLabel]}>
                Ponto de Encontro
                <CustomText style={styles.errorLabel}> *</CustomText>
              </CustomText>

              <View
                style={[
                  styles.mapContainer,
                  locationError && styles.errorBorder,
                ]}>
                <Map
                  editable={true}
                  onLocationChange={(lat, lng) => {
                    setLocation({latitude: lat, longitude: lng});
                    setLocationError(false);
                  }}
                />
              </View>

              {locationError && (
                <CustomText style={styles.errorMessage}>
                  Selecione um local no mapa para o ponto de encontro
                </CustomText>
              )}
            </View>
            {/* Visibility */}
            <View style={styles.visibilityContainer}>
              <CustomText style={styles.label}>Visibilidade</CustomText>
              <View style={styles.visibilityButtonContainer}>
                <CustomButton
                  text="Privado"
                  size="normal"
                  variant={isPrivate ? 'dark' : 'secundary'}
                  onClick={handleVisibilityPrivateTrue}
                  style={styles.visibilityButton}
                />
                <CustomButton
                  text="Público"
                  size="normal"
                  variant={isPrivate ? 'secundary' : 'dark'}
                  onClick={handleVisibilityPrivateFalse}
                  style={styles.visibilityButton}
                />
              </View>
            </View>
            {/* Activity Types */}
            <View style={styles.activityTypesContainer}>
              <ActivityTypes
                title={'Categorias'}
                selectedTypeId={activityType ? [activityType] : []}
                onTypePress={typeId => {
                  handleTypeSelect(typeId);
                  setActivityTypeError(false);
                }}
              />

              {activityTypeError && (
                <CustomText style={styles.errorMessage}>
                  Selecione uma categoria para a atividade
                </CustomText>
              )}
            </View>
          </View>
          <View style={styles.footerContainer}>
            <CustomButton
              text="Salvar"
              size="normal"
              variant="default"
              onClick={handleRegisterActivity}
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}
