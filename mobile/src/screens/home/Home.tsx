import {
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHeader from '../../components/headerComponent/CustomHeader';
import styles from './styles';
import CustomText from '../../components/textComponent/CustomText';
import PhotoCardComponent from '../../components/photoCardComponent/PhotoCardComponent';
import Toast from 'react-native-toast-message';
import useAppContext from '../../hooks/useAppContext';
import {fixUrl} from '../../utils/fixUrl';
import ActivitiesGrid from '../../components/activitiesGridComponent/ActivitiesGrid';
import ActivityTypes from '../../components/acitivityTypesComponent/ActivityTypes';
import CustomButton from '../../components/buttonComponent/CustomButton';
import {useTypedNavigation} from '../../hooks/useTypedNavigation';
import {useCallback, useEffect, useState} from 'react';
import SetPreferencesScreen from '../../components/setPreferencesComponent/SetPreferences';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import useUserContext from '../../hooks/useUserContext';
import ActivityCreateModal from '../../components/activityCreateModalComponent/ActivityCreateModal';

const defaultUserPhoto = require('../../../assets/images/defaultProfilePhoto.png');

const ellipse1 = require('../../../assets/images/Ellipse01.png');
const ellipse2 = require('../../../assets/images/Ellipse02.png');
const star = require('../../../assets/images/star.png');

export default function HomeScreen() {
  const navigation = useTypedNavigation();
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastEasterEggTrigger, setLastEasterEggTrigger] = useState(0);

  const {userData, refreshUserData} = useUserContext();

  const {
    activities: {activityTypes},
    activities: {getActivitiesPaginated},
    user: {getUserPreferences},
  } = useAppContext();

  useEffect(() => {
    getActivitiesPaginated();
  }, [getActivitiesPaginated, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Open modal preferences when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const timeoutId = setTimeout(async () => {
        const checkUserPreferences = async () => {
          try {
            // Check if getUserPreferences is a function before calling it
            const preferences = getUserPreferences
              ? await getUserPreferences()
              : null;

            // Verify if preferences are empty or null
            if (Array.isArray(preferences)) {
              if (preferences.length === 0) {
                setShowPreferencesModal(true);
              }
            } else if (!preferences || !preferences.typeId) {
              setShowPreferencesModal(true);
            }
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Erro',
              text2: 'Não foi possível verificar suas preferências.',
            });
          }
        };
        checkUserPreferences();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }, [getUserPreferences]),
  );

  useFocusEffect(
    useCallback(() => {
      refreshUserData();
    }, [refreshUserData]),
  );

  const handleClosePreferencesModal = () => {
    setShowPreferencesModal(false);
  };

  const handleActivityTypePress = (typeId: string, typeName: string) => {
    navigation.navigate('ActivitiesType', {
      typeId: typeId,
      typeName: typeName,
    });
  };

  const handleVerMaisClick = async () => {
    // Verificar se existem tipos de atividades disponíveis
    if (!activityTypes || activityTypes.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Atenção',
        text2: 'Nenhuma categoria disponível no momento.',
      });
      return;
    }

    try {
      // Verify if user preferences are set
      const userPrefs = getUserPreferences ? await getUserPreferences() : null;
      let preferredTypes: typeof activityTypes = [];

      // If user preferences exist, filter activity types based on user preferences
      if (Array.isArray(userPrefs) && userPrefs.length > 0) {
        // Extrair os IDs dos tipos preferidos
        const preferenceIds = userPrefs.map(pref => pref.typeId);

        // Filter activity types based on user preferences
        preferredTypes = activityTypes.filter(type =>
          preferenceIds.includes(type.id),
        );
      }

      // Choose a random type from the preferred types or all activity types
      const typesToChooseFrom =
        preferredTypes.length > 0 ? preferredTypes : activityTypes;
      const randomIndex = Math.floor(Math.random() * typesToChooseFrom.length);
      const selectedType = typesToChooseFrom[randomIndex];

      // Navigate to the ActivitiesType screen with the selected type
      navigation.navigate('ActivitiesType', {
        typeId: selectedType.id,
        typeName: selectedType.name,
      });
    } catch (error) {
      console.error('Erro ao verificar preferências:', error);

      // Fallback to a random activity type if an error occurs
      const randomIndex = Math.floor(Math.random() * activityTypes.length);
      const randomType = activityTypes[randomIndex];

      navigation.navigate('ActivitiesType', {
        typeId: randomType.id,
        typeName: randomType.name,
      });
    }
  };

  const handleUserProfile = () => {
    navigation.navigate('UserProfile');
  };

  const handleCreateActivity = () => {
    console.table('Dados do usuário:', userData);
    setShowCreateActivityModal(true);
  };

  const handleEasterEgg = () => {
    const now = Date.now();
    // Set cooldown period to 5 seconds
    const cooldownPeriod = 5000;

    if (now - lastEasterEggTrigger > cooldownPeriod) {
      // Show toast with personalized greeting
      Toast.show({
        type: 'success',
        text1: '🎉 Easter Egg Ativado!',
        text2: `Olá, ${userData?.name || 'Usuário'}! Que bom te ver por aqui!`,
        visibilityTime: 3000,
        topOffset: 50,
      });

      // Update last trigger time
      setLastEasterEggTrigger(now);
    }
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        bounces={true}
        overScrollMode="always"
        refreshControl={
          <RefreshControl onRefresh={handleRefresh} refreshing={false} />
        }>
        {/* Header Component */}
        <View style={styles.containerHeader}>
          <CustomHeader height={137} borderBottomtRadius={32}>
            <Image source={ellipse1} style={styles.ellipse01} />
            <Image source={ellipse2} style={styles.ellipse02} />
            <View style={styles.containerInsideHeader}>
              <View style={styles.saudationGroup}>
                <CustomText style={styles.subtitle}>
                  Olá, Seja Bem Vindo
                </CustomText>
                <TouchableOpacity onPress={handleEasterEgg}>
                  <CustomText style={styles.title}>
                    {userData?.name ? userData.name.split(' ')[0] : 'USUÁRIO'} !
                  </CustomText>
                </TouchableOpacity>
              </View>
              <View style={styles.userGroup}>
                <View style={styles.starContainer}>
                  <Image source={star} style={styles.star} />
                  <CustomText style={styles.starText}>
                    {userData.level}
                  </CustomText>
                </View>
                <PhotoCardComponent
                  image={
                    userData.avatar
                      ? {uri: fixUrl(userData.avatar)}
                      : defaultUserPhoto
                  }
                  onPress={handleUserProfile}
                />
              </View>
            </View>
          </CustomHeader>
        </View>
        {/* Body components */}
        <View style={styles.containerBody}>
          <View style={styles.recommendationsWrapper}>
            <ActivitiesGrid
              title="Suas Recomendações"
              button="Ver mais"
              fetchFunction={getActivitiesPaginated}
              onPress={handleVerMaisClick}
              key={`activities-grid-${refreshKey}`}
            />
          </View>
          <View style={styles.activitiesGridsContainer}>
            {/* Activity types */}
            <ActivityTypes
              title={'Categorias'}
              onTypePress={handleActivityTypePress}
              style={styles.activityTypes}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer components (Create Activity Button) */}
      <View style={styles.footerBar}>
        <CustomButton
          size={'circle'}
          variant={'default'}
          onClick={handleCreateActivity}
        />
      </View>

      {/* Modals */}
      <ActivityCreateModal
        visible={showCreateActivityModal}
        onClose={() => setShowCreateActivityModal(false)}
        onActivityCreated={handleRefresh}
      />
      <SetPreferencesScreen
        visible={showPreferencesModal}
        onClose={handleClosePreferencesModal}
        type="home"
      />
    </>
  );
}
