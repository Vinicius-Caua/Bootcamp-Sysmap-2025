import {useRoute} from '@react-navigation/native';
import CustomTitle from '../../components/TitleComponent/CustomTitle';
import {UserState} from '../../interfaces/user/UserDataInterface';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {useTypedNavigation} from '../../hooks/useTypedNavigation';
import {CaretLeft} from 'phosphor-react-native';
import ImagePicker from '../../components/imagePickerComponent/ImagePicker';
import CustomButton from '../../components/buttonComponent/CustomButton';
import {useEffect, useState} from 'react';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import useAppContext from '../../hooks/useAppContext';
import {Input} from '../../components/inputComponent/CustomInput';
import ActivityTypes from '../../components/acitivityTypesComponent/ActivityTypes';
import CustomText from '../../components/textComponent/CustomText';
import SetPreferencesScreen from '../../components/setPreferencesComponent/SetPreferences';
import CustomDialog from '../../components/dialogComponent/CustomDialog';

export default function UserEditProfileScreen() {
  const route = useRoute();
  const navigation = useTypedNavigation();
  const userData = route.params as UserState['userData'];
  const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [warningDialogVisible, setWarningDialogVisible] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomeCompletoError, setnomeCompletoError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const {
    user: {
      updateUserAvatar,
      getUserPreferences,
      updateUserData,
      deactivateUserAccount,
    },
  } = useAppContext();

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setEmail(userData.email);
    }
  }, [userData]);

  // Load user preferences
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (getUserPreferences) {
        try {
          const preferences = await getUserPreferences();

          // Check if preferences are not empty or null
          if (Array.isArray(preferences) && preferences.length > 0) {
            // Map preferences to their IDs
            const preferencesIds = preferences.map(pref => pref.typeId);
            setSelectedTypeIds(preferencesIds);
          }
        } catch (error) {
          console.error('Erro ao carregar preferências do usuário:', error);
        }
      }
    };

    loadUserPreferences();
  }, [getUserPreferences]);

  const handleOpenPreferencesModal = () => {
    setShowPreferencesModal(true);
  };

  const handleOpenWargingModal = () => {
    setWarningDialogVisible(true);
  };

  const handleConfirmDeactivate = () => {
    try {
      deactivateUserAccount?.();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível desativar sua conta. Tente novamente.',
      });
    }
    setWarningDialogVisible(false);
  };

  const handleSave = async () => {
    // Reset validation flag
    let isValid = true;

    if (!name || name.trim() === '') {
      setnomeCompletoError(true);
      isValid = false;
    } else {
      setnomeCompletoError(false);
    }

    if (!email || !email.includes('@')) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (password && password.length < 6) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    if (!isValid) {
      Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'Informe os campos obrigatórios corretamente!',
      });
      return;
    }

    try {
      const updatedData: {
        name?: string;
        email?: string;
        password?: string;
      } = {};

      // Include only the fields that have changed
      if (name !== userData.name) {
        updatedData.name = name;
      }
      if (email !== userData.email) {
        updatedData.email = email;
      }
      if (password) {
        updatedData.password = password;
      }

      // Verify if are any fields to update
      if (Object.keys(updatedData).length > 0) {
        await updateUserData?.(updatedData);
      }

      // Atualizar avatar se uma nova imagem foi selecionada
      if (newAvatarUri) {
        await updateUserAvatar?.(newAvatarUri);
      }

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Perfil atualizado com sucesso!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível atualizar seu perfil. Tente novamente.',
      });
    }
  };
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        bounces={true}
        overScrollMode="always">
        <View style={styles.containerInsideHeader}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.buttons}
            onPress={handleBack}
            hitSlop={styles.backButtonHitContainer}>
            <CaretLeft size={30} weight="bold" />
          </TouchableOpacity>

          {/* Title */}
          <CustomTitle style={styles.title}>Atualizar Perfil</CustomTitle>
        </View>
        <View style={styles.containerImagePicker}>
          <ImagePicker
            initialImage={userData.avatar}
            typePicker="user"
            onImageChange={uri => {
              setNewAvatarUri(uri);
            }}
            cameraIconColor={'white'}
          />
        </View>

        <View style={styles.form}>
          <Input.Root isError={nomeCompletoError}>
            <Input.Label required>Nome Completo</Input.Label>
            <Input.Input
              placeholder="Ex.: Joao Pessoa"
              value={name}
              onChangeText={text => {
                setName(text);
                setnomeCompletoError(false);
              }}
            />
            <Input.ErrorMessage>
              Preencha o campo com seu nome completo!
            </Input.ErrorMessage>
          </Input.Root>
          <Input.Root>
            <Input.Label required>CPF</Input.Label>
            <Input.Input
              placeholder="Ex.: 111.111.1111-12"
              keyboardType="numeric"
              value={userData.cpf}
              editable={false}
            />
          </Input.Root>
          <Input.Root isError={emailError}>
            <Input.Label required>E-mail</Input.Label>
            <Input.Input
              placeholder="Ex.: nome@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setEmailError(false);
              }}
            />
            <Input.ErrorMessage>
              Preencha o campo com seu e-mail!
            </Input.ErrorMessage>
          </Input.Root>
          <Input.Root isError={passwordError}>
            <Input.Label required>Senha</Input.Label>
            <Input.Input
              placeholder="******"
              autoCapitalize="none"
              autoComplete="off"
              secureTextEntry
              value={password}
              onChangeText={text => {
                setPassword(text);
                setPasswordError(false);
              }}
            />
            <Input.ErrorMessage>
              Preencha o campo com sua senha!
            </Input.ErrorMessage>
          </Input.Root>
        </View>

        {/* Acitivityes Types */}
        <View style={styles.containerActivityTypes}>
          <ActivityTypes
            title={'Preferências'}
            selectedTypeId={selectedTypeIds}
            style={styles.activityTypes}
            onPressEditMode={handleOpenPreferencesModal}
            editMode
          />
        </View>

        <View style={styles.footer}>
          <CustomButton
            variant={'default'}
            size={'normal'}
            text="Salvar"
            onClick={handleSave}
          />
          <TouchableOpacity onPress={handleOpenWargingModal}>
            <CustomText style={styles.deactivateButton}>
              Desativar Conta
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Dialog warning to deactvate account */}
      <CustomDialog
        visible={warningDialogVisible}
        title="Desativar Conta"
        message="Tem certeza que deseja desativar sua conta? Você não poderá mais acessá-la."
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setWarningDialogVisible(false)}
      />

      {/* Modal set preferences */}
      <SetPreferencesScreen
        visible={showPreferencesModal}
        type={'userProfileEdit'}
        onClose={() => setShowPreferencesModal(false)}
      />
    </>
  );
}
