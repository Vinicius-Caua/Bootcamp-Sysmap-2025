import {
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Activity } from '../../../../models/activities/activitiesModel';
import useAppContext from '../../../../hooks/useAppContext';
import THEME from '../../../../assets/themes/THEME';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useTypedNavigation } from '../../../../hooks/useTypedNavigation';
import CustomTitle from '../../../../components/TitleComponent/CustomTitle';
import { ImageBackground } from 'react-native';
import styles from './styles';
import { fixUrl } from '../../../../utils/fixUrl';
import CustomText from '../../../../components/textComponent/CustomText';
import {
  CalendarDots,
  CaretLeft,
  NotePencil,
  UsersThree,
} from 'phosphor-react-native';
import { formatDate } from '../../../../utils/dateFormat';
import Map from '../../../../components/mapsComponent/Maps';
import ParticipantsList from '../../../../components/participantsListComponent/ParticipantsList';
import ActivityEditModal from '../../../../components/activityEditModalComponent/ActivityEditModal';

type RouteParams = {
  params: {
    activityId: string;
  };
};

export default function GeneralActivityScreenCreator() {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const navigation = useTypedNavigation();
  const {activityId} = route.params;
  const {activities} = useAppContext();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<Activity | null>(null);
  const [showEditActivityModal, setShowEditActivityModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);

      // Find the activity by ID
      const allActivitiesResponse = await activities.getActivitiesPaginated();

      if (!allActivitiesResponse || !allActivitiesResponse.activities) {
        throw new Error('Não foi possível obter a lista de atividades');
      }

      // Check if the activity exists in the list
      const foundActivity = allActivitiesResponse.activities.find(
        item => item.id === activityId,
      );

      if (foundActivity) {
        setActivityData(foundActivity);
        setActivity(foundActivity);
        activities.setSelectedActivity(foundActivity);
      } else {
        console.error('Atividade não encontrada após buscar todas');
        throw new Error('Atividade não encontrada');
      }
    } catch (error) {
      console.error('Erro ao buscar atividade:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar atividade',
        text2: 'Não foi possível encontrar esta atividade',
      });
    } finally {
      setLoading(false);
    }
  }, [activityId, activities]);

  // Define a function to handle the refresh action
  const handleRefresh = useCallback(
    (wasCanceled = false) => {
      if (wasCanceled) {
        setIsCanceling(true);
        setTimeout(() => {
          navigation.goBack();
        }, 10);
      } else {
        fetchActivity();
      }
    },
    [fetchActivity, navigation],
  );

  // Handle opening the edit modal
  const handleOpenEditModal = useCallback(() => {
    if (activityData) {
      setShowEditActivityModal(true);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Erro ao editar atividade',
        text2: 'Não foi possível carregar os dados da atividade',
      });
    }
  }, [activityData]);

  useEffect(() => {
    const selectedActivity = activities.selectedActivity;
    if (selectedActivity && selectedActivity.id === activityId) {
      setActivity(selectedActivity);
      setActivityData(selectedActivity);
      setLoading(false);
    } else {
      fetchActivity();
    }
  }, [activityId, activities.selectedActivity, fetchActivity]);

  const formtData = activity?.scheduledDate
    ? formatDate(activity.scheduledDate)
    : 'Data não disponível';

  const isPrivate = activity?.private ? 'Privada' : 'Pública';

  if (loading) {
    return <ActivityIndicator size="large" color={THEME.COLORS.emerald} />;
  }
  if (!activity) {
    Toast.show({
      type: 'error',
      text1: 'Erro ao buscar atividade',
      text2: 'Atividade não encontrada.',
    });
    navigation.goBack();
  }

  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <>
      <ScrollView
        bounces={true}
        showsVerticalScrollIndicator={false}
        overScrollMode="always"
        style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.backgroundImageContainer}>
            <ImageBackground
              source={{uri: fixUrl(activity?.image)}}
              style={styles.backgroundImage}>
              {/* Content inside the background */}
              <View style={styles.imageOverlay}>
                {/* Buttons (back, edit) */}
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.touchableButtons}
                    onPress={handleBackPress}>
                    <CaretLeft
                      size={32}
                      color={THEME.COLORS.black}
                      weight="bold"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.touchableButtons}
                    onPress={handleOpenEditModal}>
                    <NotePencil size={32} color={THEME.COLORS.black} />
                  </TouchableOpacity>
                </View>
                {/* Small Header (date, isPrivate, participantsCount) */}
                <View style={styles.smallHeader}>
                  <View style={styles.dateContainer}>
                    <CalendarDots size={20} color={THEME.COLORS.emerald} />
                    <CustomText style={styles.textHeader}>{formtData}</CustomText>
                  </View>
                  <CustomText>|</CustomText>
                  <View style={styles.isPrivateContainer}>
                    <CustomText style={styles.textHeader}>{isPrivate}</CustomText>
                  </View>
                  <CustomText>|</CustomText>
                  <View style={styles.partcipantsContainer}>
                    <UsersThree size={20} color={THEME.COLORS.emerald} />
                    <CustomText style={styles.textHeader}>{activity?.participantCount}</CustomText>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.bodyContainer}>
            {/* Title and description */}
            <View style={styles.headerContainer}>
              <CustomText style={styles.title}>{activity?.title}</CustomText>
              <CustomText style={styles.description}>
                {activity?.description}
              </CustomText>
            </View>
            {/* Map Container */}
            <View style={styles.mapContainer}>
              <CustomTitle style={styles.title}>Ponto de Encontro</CustomTitle>
              <Map editable={false} initialLocation={activity?.address} />
            </View>
            {/* ParticipantsList */}
            <View style={styles.participantsContainer}>
              <CustomTitle style={styles.title}>Participantes</CustomTitle>
              {!isCanceling && (
                <ParticipantsList
                  activityId={activityId}
                  acepptOrDeniedParticipants={true}
                  isPrivate={activity?.private === true}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal edit activity */}
      <ActivityEditModal
        visible={showEditActivityModal}
        onClose={() => setShowEditActivityModal(false)}
        onActivityEdit={wasCanceled => handleRefresh(wasCanceled)}
        activity={activityData}
      />
    </>
  );
}
