import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {ParticipantsActivity} from '../../models/activities/activitiesModel';
import useAppContext from '../../hooks/useAppContext';
import {fixUrl} from '../../utils/fixUrl';
import CustomText from '../textComponent/CustomText';
import THEME from '../../assets/themes/THEME';
import CustomTitle from '../TitleComponent/CustomTitle';
import {Heart, X} from 'phosphor-react-native';

interface ParticipantsListProps {
  activityId: string;
  acepptOrDeniedParticipants?: boolean;
  isPrivate: boolean;
  creatorInformations?: {
    name: string;
    avatar: string;
  };
}

export default function ParticipantsList({
  activityId,
  acepptOrDeniedParticipants = false,
  creatorInformations,
  isPrivate = false,
}: ParticipantsListProps) {
  const [participants, setParticipants] = useState<ParticipantsActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {activities} = useAppContext();
  const [processingParticipantId, setProcessingParticipantId] = useState<
    string | null
  >(null);
  const screenWidth = Dimensions.get('window').width;
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        let participantsData = await activities.getActivityParticipants(
          activityId,
        );

        // Handle creator display - only show when viewing as participant (acepptOrDeniedParticipants=false)
        if (!acepptOrDeniedParticipants && creatorInformations) {
          // Create creator participant object with special flag
          const creatorParticipant: ParticipantsActivity = {
            id: 'creator',
            userId: 'creator',
            name: creatorInformations.name || 'Organizador',
            avatar: creatorInformations.avatar || '',
            subscriptionStatus: 'APPROVED',
            confirmedAt: new Date(),
            acepptOrDeniedParticipants: true,
          };

          // Add creator at beginning
          participantsData = [
            creatorParticipant,
            ...participantsData.filter(p => p.userId !== 'creator'),
          ];
        }

        setParticipants(participantsData);
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [activities, activityId, acepptOrDeniedParticipants, creatorInformations]);

  const handleApproveParticipant = async (participantId: string) => {
    try {
      setProcessingParticipantId(participantId);

      await activities.acceptOrRejectParticipant(
        activityId,
        participantId,
        true, // true = approved
      );

      // Updated participants list after approval
      const updatedParticipants = await activities.getActivityParticipants(
        activityId,
      );
      setParticipants(updatedParticipants);
    } finally {
      setProcessingParticipantId(null);
    }
  };

  const handleRejectParticipant = async (participantId: string) => {
    try {
      setProcessingParticipantId(participantId);

      await activities.acceptOrRejectParticipant(
        activityId,
        participantId,
        false, // false = rejected
      );

      // Updated participants list after rejection
      const updatedParticipants = await activities.getActivityParticipants(
        activityId,
      );
      setParticipants(updatedParticipants);
    } finally {
      setProcessingParticipantId(null);
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Aprovado';
      case 'WAITING':
        return 'Pendente';
      case 'REJECTED':
        return 'Reprovado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return THEME.COLORS.emerald;
      case 'WAITING':
        return THEME.COLORS.yellow;
      case 'REJECTED':
        return THEME.COLORS.red;
      default:
        return THEME.COLORS.gray;
    }
  };

  // Create pages of 4 participants
  const getPages = () => {
    const pages = [];
    for (let i = 0; i < participants.length; i += itemsPerPage) {
      pages.push(participants.slice(i, i + itemsPerPage));
    }
    return pages;
  };

  // Render a single page of participants (4 participants in a vertical list)
  const renderPage = ({item}: {item: ParticipantsActivity[]}) => (
    <View style={styles.participantsPage}>
      {item.map((participant: ParticipantsActivity) =>
        renderParticipant(participant),
      )}
    </View>
  );

  // Render individual participant
  const renderParticipant = (item: ParticipantsActivity) => (
    <View key={item.id} style={styles.participantRow}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={{uri: fixUrl(item.avatar)}} style={styles.avatar} />
      </View>

      {/* Name and status */}
      <View style={styles.participantInfo}>
        <CustomTitle numberOfLines={1} style={styles.participantName}>
          {item.name}
        </CustomTitle>

        {/* Show "Organizador" for acepptOrDeniedParticipants, otherwise show status */}
        {item.acepptOrDeniedParticipants ? (
          <CustomText style={styles.creatorText}>Organizador</CustomText>
        ) : (
          <CustomTitle
            style={[
              styles.statusText,
              {color: getStatusColor(item.subscriptionStatus)},
            ]}>
            {getStatusText(item.subscriptionStatus)}
          </CustomTitle>
        )}
      </View>

      {/* Action buttons - only show for creator when acepptOrDeniedParticipants=true */}
      {acepptOrDeniedParticipants && !item.acepptOrDeniedParticipants && isPrivate && (
        <View style={styles.actionsContainer}>
          {(item.subscriptionStatus === 'WAITING' ||
            item.subscriptionStatus === 'REJECTED') && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.approveButton,
                processingParticipantId === item.id
                  ? styles.disabledButton
                  : {},
              ]}
              onPress={() => handleApproveParticipant(item.id)}>
              <Heart size={20} color={THEME.COLORS.white} weight="bold" />
            </TouchableOpacity>
          )}

          {(item.subscriptionStatus === 'WAITING' ||
            item.subscriptionStatus === 'APPROVED') && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.rejectButton,
                processingParticipantId === item.id
                  ? styles.disabledButton
                  : {},
              ]}
              onPress={() => handleRejectParticipant(item.id)}>
              <X size={20} color={THEME.COLORS.white} weight="bold" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.participantsListContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={THEME.COLORS.emerald} />
      </View>
    );
  }

  return (
    <View style={styles.participantsListContainer}>
      {participants.length > 0 ? (
        <FlatList
          horizontal
          pagingEnabled
          data={getPages()}
          renderItem={renderPage}
          keyExtractor={(_: ParticipantsActivity[], index: number) =>
            `page-${index}`
          }
          showsHorizontalScrollIndicator={false}
          style={styles.flatList}
          snapToInterval={screenWidth - 32}
          decelerationRate="fast"
        />
      ) : (
        <CustomText style={styles.emptyText}>
          Nenhum participante encontrado
        </CustomText>
      )}
    </View>
  );
}
