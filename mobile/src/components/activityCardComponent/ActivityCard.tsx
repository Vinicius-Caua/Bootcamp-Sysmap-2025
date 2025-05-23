import React, {useEffect, useState} from 'react';
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  Image,
} from 'react-native';
import styles from './styles';
import CustomText from '../textComponent/CustomText';
import {CalendarDots, LockSimple, UsersThree} from 'phosphor-react-native';
import THEME from '../../assets/themes/THEME';
import {formatDate} from '../../utils/dateFormat';
import {Activity} from '../../models/activities/activitiesModel';
import {fixUrl} from '../../utils/fixUrl';
import {useTypedNavigation} from '../../hooks/useTypedNavigation';
import useAppContext from '../../hooks/useAppContext';
import {checkActivityTiming} from '../../utils/checkActivityTime';

interface ActivityCardProps {
  activity: Activity;
  style?: StyleProp<ViewStyle>;
}

export default function ActivityCard({activity, style}: ActivityCardProps) {
  const navigation = useTypedNavigation();
  const {auth, activities} = useAppContext();
  const [activityTiming, setActivityTiming] = useState(() =>
    checkActivityTiming(activity.scheduledDate),
  );

  // Re-evaluate timing every 60 seconds
  useEffect(() => {

    const intervalId = setInterval(() => {
      const newTiming = checkActivityTiming(activity.scheduledDate);
      setActivityTiming(newTiming);
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [activity.scheduledDate, activity.title, activityTiming]);

  // Function to handle card press
  const handleActivityPress = async () => {
    activities.setSelectedActivity(activity);

    // Verify if the activity is completed
    if (activity.completedAt) {
      navigation.navigate('ConcludedActivityView', {
        activityId: activity.id,
        activity: activity,
      });
      return;
    }

    const isCreator = activity.creator?.id === auth.user?.id;
    const timing = checkActivityTiming(activity.scheduledDate);

    // Check if the timing is relevant for check-in
    const isCheckInRelevant = timing.isStartingSoon || timing.hasStarted;

    // For creator, navigation is straightforward
    if (isCreator) {
      if (timing.isPastOrToday) {
        navigation.navigate('ConfirmationCodeView', {
          activityId: activity.id,
          statusScheduledData: timing.hasStarted ? 'STARTED' : 'STARTING_SOON',
        });
      } else {
        navigation.navigate('GeneralActivityScreenCreator', {
          activityId: activity.id,
        });
      }
      return;
    }

    // For participants, first check if check-in is relevant
    if (!isCheckInRelevant) {
      navigation.navigate('GeneralActivityScreenUser', {
        activityId: activity.id,
      });
      return;
    }

    // Now handle the participant check-in flow
    try {
      // Fetch participation status outside of nested conditionals
      const participants = await activities.getActivityParticipants(
        activity.id,
      );
      const currentUserId = auth.user?.id;
      const userParticipation = participants.find(
        p => p.userId === currentUserId,
      );

      // Navigate based on participation status
      if (
        userParticipation &&
        userParticipation.subscriptionStatus === 'APPROVED'
      ) {
        navigation.navigate('CheckIngActivityUser', {
          activityId: activity.id,
        });
      } else {
        // For rejected or pending participants, navigate to normal view
        navigation.navigate('GeneralActivityScreenUser', {
          activityId: activity.id,
        });
      }
    } catch (error) {
      // In case of error, navigate to the regular view
      console.error('Error checking participation status:', error);
      navigation.navigate('GeneralActivityScreenUser', {
        activityId: activity.id,
      });
    }
  };

  return (
    <View style={style}>
      <TouchableOpacity onPress={handleActivityPress} activeOpacity={0.7}>
        <View style={styles.imagemCard}>
          {/* Lock icon if activity is private */}
          {activity.private && (
            <View style={styles.lockContainer}>
              <LockSimple size={16} color={THEME.COLORS.white} weight="fill" />
            </View>
          )}

          {/* Activity image */}
          <Image
            source={{uri: fixUrl(activity.image)}}
            style={styles.activityImage}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>

      {/* Activity Title */}
      <CustomText
        style={styles.activityTitle}
        numberOfLines={1}
        ellipsizeMode="tail">
        {activity.title}
      </CustomText>

      {/* Subinformations */}
      <View style={styles.containerSubInformations}>
        {/* Date */}
        <View style={styles.dateContainer}>
          <CalendarDots size={20} color={THEME.COLORS.emerald} />
          <CustomText style={styles.subInformations}>
            {activity.scheduledDate
              ? formatDate(activity.scheduledDate)
              : 'Sem data'}
          </CustomText>
        </View>

        {/* Pipe */}
        <CustomText style={styles.subInformations}>|</CustomText>

        {/* Participants */}
        <View style={styles.partcipantsContainer}>
          <UsersThree size={20} color={THEME.COLORS.emerald} />
          <CustomText style={styles.subInformations}>
            {activity.participantCount}
          </CustomText>
        </View>
      </View>
    </View>
  );
}
