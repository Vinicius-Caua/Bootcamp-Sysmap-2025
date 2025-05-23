import {
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Activity} from '../../../../models/activities/activitiesModel';
import useAppContext from '../../../../hooks/useAppContext';
import THEME from '../../../../assets/themes/THEME';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useTypedNavigation} from '../../../../hooks/useTypedNavigation';
import CustomTitle from '../../../../components/TitleComponent/CustomTitle';
import {ImageBackground} from 'react-native';
import styles from './styles';
import {fixUrl} from '../../../../utils/fixUrl';
import CustomText from '../../../../components/textComponent/CustomText';
import {CalendarDots, CaretLeft, UsersThree} from 'phosphor-react-native';
import {formatDate} from '../../../../utils/dateFormat';
import Map from '../../../../components/mapsComponent/Maps';
import ParticipantsList from '../../../../components/participantsListComponent/ParticipantsList';
import CustomButton from '../../../../components/buttonComponent/CustomButton';

type RouteParams = {
  params: {
    activityId: string;
  };
};

export default function GeneralActivityScreenUser() {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const navigation = useTypedNavigation();
  const {activityId} = route.params;
  const {activities} = useAppContext();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatorName, setCreatorName] = useState<string>('');
  const [creatorAvatar, setCreatorAvatar] = useState<string>('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null,
  );

  // Verify userSubscriptionStatus
  useEffect(() => {
    if (activity?.userSubscriptionStatus) {
      setSubscriptionStatus(activity.userSubscriptionStatus);
    }
  }, [activity]);

  // Function to fetch activity
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
        setActivity(foundActivity);
        activities.setSelectedActivity(foundActivity);

        // Set creator info
        if (foundActivity.creator) {
          setCreatorName(foundActivity.creator.name);
          setCreatorAvatar(foundActivity.creator.avatar);
        }
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
  }, [
    activityId,
    activities,
    setActivity,
    setCreatorName,
    setCreatorAvatar,
    setLoading,
  ]);

  // Fetch activity when the component mounts or when the activityId changes
  useEffect(() => {
    const selectedActivity = activities.selectedActivity;
    if (selectedActivity && selectedActivity.id === activityId) {
      setActivity(selectedActivity);
      if (selectedActivity.creator) {
        setCreatorName(selectedActivity.creator.name);
        setCreatorAvatar(selectedActivity.creator.avatar);
      }
      setLoading(false);
    } else {
      fetchActivity();
    }
  }, [activityId, activities, fetchActivity]);

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

  const handleToParticipate = async () => {
    if (!activityId) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'ID da atividade não disponível.',
      });
      return;
    }

    try {
      setIsSubscribing(true);

      const result = await activities.subscribeToActivity(activityId);

      // Update the activity state with the new subscription status
      setSubscriptionStatus(result.subscriptionStatus);

      Toast.show({
        type: 'success',
        text1: 'Inscrição realizada',
        text2: activity?.private
          ? 'Aguardando aprovação do organizador'
          : 'Você foi inscrito com sucesso!',
      });

      setTimeout(() => {
        fetchActivity();
      }, 500);
    } catch (error: any) {
      console.error('Erro ao inscrever-se:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao inscrever-se',
        text2: error.message || 'Tente novamente mais tarde',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setIsSubscribing(true);

      await activities.unsubscribeFromActivity(activityId);

      setSubscriptionStatus('not_subscribed');

      setTimeout(() => {
        fetchActivity();
      }, 500);
    } catch (error: any) {
      console.error('Erro ao cancelar inscrição:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao cancelar inscrição',
        text2: error.message || 'Tente novamente mais tarde',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
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
            <ParticipantsList
              activityId={activityId}
              acepptOrDeniedParticipants={false}
              creatorInformations={{name: creatorName, avatar: creatorAvatar}}
              isPrivate={activity?.private === true}
            />
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footerContainer}>
          {/* Not Subscribed: Shows Participar button */}
          {(!subscriptionStatus || subscriptionStatus === 'not_subscribed') && (
            <CustomButton
              variant={'default'}
              size={'normal'}
              text="Participar"
              onClick={handleToParticipate}
              disabled={isSubscribing}
            />
          )}

          {/* Pending: Shows wating button */}
          {(subscriptionStatus === 'WAITING' ||
            subscriptionStatus === 'pending') && (
            <CustomButton
              variant={'default'}
              size={'normal'}
              text="Aguardando Aprovação"
              disabled={true}
            />
          )}

          {/* Approved: shows Sair button  */}
          {(subscriptionStatus === 'APPROVED' ||
            subscriptionStatus === 'approved') && (
            <CustomButton
              variant={'default'}
              size={'normal'}
              text="Sair"
              onClick={handleUnsubscribe}
            />
          )}

          {/* Rejected: shows button Inscrição Negada */}
          {(subscriptionStatus === 'REJECTED' ||
            subscriptionStatus === 'disapproved') && (
            <CustomButton
              variant={'danger'}
              size={'normal'}
              text="Inscrição Negada"
              disabled={true}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
