import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../../../interfaces/routes/rootStackParamList';
import {useTypedNavigation} from '../../../../hooks/useTypedNavigation';
import CustomTitle from '../../../../components/TitleComponent/CustomTitle';
import {fixUrl} from '../../../../utils/fixUrl';
import CustomText from '../../../../components/textComponent/CustomText';
import {CaretLeft, UsersThree} from 'phosphor-react-native';
import Map from '../../../../components/mapsComponent/Maps';
import ParticipantsList from '../../../../components/participantsListComponent/ParticipantsList';
import THEME from '../../../../assets/themes/THEME';
import styles from './styles';

export default function ConcludedActivityViewScreen() {
  const route =
    useRoute<RouteProp<RootStackParamList, 'ConcludedActivityView'>>();
  const navigation = useTypedNavigation();

  const {activity} = route.params;

  const isPrivate = activity?.private ? 'Privada' : 'Pública';

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
        {/* Image backgroud */}
        <View style={styles.backgroundImageContainer}>
          <ImageBackground
            source={{uri: fixUrl(activity?.image)}}
            style={styles.backgroundImage}>
            <View style={styles.imageOverlay}>
              {/* Button goBack */}
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

              {/* Header */}
              <View style={styles.smallHeader}>
                <View style={styles.dateContainer}>
                  <CustomText style={styles.textHeader}>
                    Atividade Finalizada
                  </CustomText>
                </View>
                <CustomText>|</CustomText>
                <View style={styles.isPrivateContainer}>
                  <CustomText style={styles.textHeader}>{isPrivate}</CustomText>
                </View>
                <CustomText>|</CustomText>
                <View style={styles.partcipantsContainer}>
                  <UsersThree size={20} color={THEME.COLORS.emerald} />
                  <CustomText style={styles.textHeader}>
                    {activity?.participantCount}
                  </CustomText>
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

          {/* Map */}
          <View style={styles.mapContainer}>
            <CustomTitle style={styles.title}>Ponto de Encontro</CustomTitle>
            <Map editable={false} initialLocation={activity?.address} />
          </View>

          {/* Partcipants list */}
          <View style={styles.participantsContainer}>
            <CustomTitle style={styles.title}>Participantes</CustomTitle>
            <ParticipantsList
              activityId={activity.id}
              acepptOrDeniedParticipants={false}
              creatorInformations={activity.creator}
              isPrivate={activity?.private === true}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
