import {
  ActivityIndicator,
  FlatList,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomButton from '../buttonComponent/CustomButton';
import styles from './styles';
import CustomTitle from '../TitleComponent/CustomTitle';
import PhotoCardComponent from '../photoCardComponent/PhotoCardComponent';
import useAppContext from '../../hooks/useAppContext';
import {useEffect, useState} from 'react';
import {ActivityType} from '../../models/activities/activitiesModel';
import {fixUrl} from '../../utils/fixUrl';
import THEME from '../../assets/themes/THEME';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {CaretLeft} from 'phosphor-react-native';
import useUserContext from '../../hooks/useUserContext';

interface SetPreferencesProps {
  visible: boolean;
  type: 'userProfileEdit' | 'home';
  onClose?: () => void;
}

export default function SetPreferencesScreen({
  visible,
  onClose,
  type,
}: SetPreferencesProps) {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    activities: {getActivityTypes},
    user: {setUserPreferences, getUserPreferences},
  } = useAppContext();

  const {refreshUserData} = useUserContext();

  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        setLoading(true);
        const types = await getActivityTypes();
        setActivityTypes(types);
      } catch (error) {
        console.error('Erro ao buscar tipos de atividades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityTypes();
  }, [getActivityTypes]);

  // Load user preferences when the modal is visible
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (visible && getUserPreferences) {
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
  }, [visible, getUserPreferences]);

  // Function to handle the selection of activity types
  const handleSelectActivityType = (typeId: string) => {
    setSelectedTypeIds(prev => {
      // If the ID is already in the array, remove it
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      }
      // Otherwise, add it to the array
      return [...prev, typeId];
    });
  };

  // Function to handle saving the selected preferences
  const handleSavePreference = async () => {
    try {
      if (setUserPreferences) {
        setUserPreferences(selectedTypeIds);
      }
      refreshUserData();
      Toast.show({
        type: 'success',
        text1: 'Preferências salvas com sucesso!',
      });
      if (onClose) {
        onClose();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar preferências',
      });
    }
  };

  const handlePularButton = () => {
    setSelectedTypeIds([]);
    if (onClose) {
      onClose();
    }
  };

  // Function to render each activity type item
  const renderTypeItem = ({item}: {item: ActivityType}) => (
    <View style={styles.gridItem}>
      <PhotoCardComponent
        image={{uri: fixUrl(item.image)}}
        title={item.name}
        // Verify if the item is selected
        selected={selectedTypeIds.includes(item.id)}
        onPress={() => handleSelectActivityType(item.id)}
        size="big"
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}>
      <View style={styles.container}>
        {type === 'userProfileEdit' && (
          <View style={styles.containerInsideHeader}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.buttons}
              onPress={onClose}
              hitSlop={styles.backButtonHitContainer}>
              <CaretLeft size={30} weight="bold" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.headerContainer}>
          <CustomTitle style={styles.title}>
            Selecione seu tipo favorito
          </CustomTitle>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={THEME.COLORS.emerald} />
        ) : (
          <FlatList
            data={activityTypes}
            renderItem={renderTypeItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
          />
        )}

        <View style={styles.buttonContainer}>
          <CustomButton
            variant={'default'}
            size={'normal'}
            onClick={handleSavePreference}
            text="Salvar"
            disabled={selectedTypeIds.length === 0}
          />
          {type === 'home' && (
            <CustomButton
              variant={'ghost'}
              size={'normal'}
              onClick={handlePularButton}
              text="Pular"
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
