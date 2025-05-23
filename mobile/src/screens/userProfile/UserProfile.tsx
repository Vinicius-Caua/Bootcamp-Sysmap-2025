import { ScrollView, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../../components/headerComponent/CustomHeader';
import { CaretDown, CaretLeft, NotePencil, SignOut } from 'phosphor-react-native';
import styles from './styles';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import CustomTitle from '../../components/TitleComponent/CustomTitle';
import useAppContext from '../../hooks/useAppContext';
import React, { useCallback, useState } from 'react';
import Carousel from '../../components/carouselComponent/CustomCarousel';
import { useFocusEffect } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import ActivitiesGrid from '../../components/activitiesGridComponent/ActivitiesGrid';
import ImageWithLoading from '../../components/imageComponent/ImageWithLoading';
import useUserContext from '../../hooks/useUserContext';

export default function UserProfileScreen() {
  const navigation = useTypedNavigation();
  const [showUserActivities, setShowUserActivities] = useState(true);

  const {
    auth: {logout},
    user: {getUserData},
    activities: {getUserCreatedActivities, getUserParticipatedActivities},
  } = useAppContext();

  const {userData} = useUserContext();

  // effect to fetch user data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          if (getUserData) {
            await getUserData();
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Não foi possível atualizar seus dados.',
          });
        }
      };

      fetchUserData();
    }, [getUserData]),
  );

  const handleEditProfile = () => {
    navigation.navigate('UserEditProfile', userData);
  };

  const toggleUserActivities = () => {
    setShowUserActivities(prev => !prev);
  };

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        bounces={true}
        overScrollMode="always">
        <CustomHeader height={276} borderBottomtRadius={40}>
          <View style={styles.containerInsideHeader}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.buttons}
              onPress={handleBack}
              hitSlop={styles.backButtonHitContainer}>
              <CaretLeft size={30} weight="bold" />
            </TouchableOpacity>

            {/* Title */}
            <CustomTitle style={styles.title}>Perfil</CustomTitle>

            <View style={styles.containerRightButtons}>
              {/* Update Profile */}
              <TouchableOpacity
                style={styles.buttons}
                onPress={handleEditProfile}
                hitSlop={styles.backButtonHitContainer}>
                <NotePencil size={30} />
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                style={styles.buttons}
                onPress={handleLogout}
                hitSlop={styles.backButtonHitContainer}>
                <SignOut size={30} />
              </TouchableOpacity>
            </View>
          </View>

          {/* User Photo */}
          <View style={styles.containerUserPhoto}>
            <ImageWithLoading
              imageUrl={userData.avatar}
              style={styles.userPhotoProfile}
            />
            <CustomTitle style={styles.userName}>{userData.name}</CustomTitle>
          </View>
        </CustomHeader>

        {/* Body components */}
        <View style={styles.profileStatusBoxContainer}>
          <Carousel user={userData} />
        </View>

        {/* Activities grids */}
        <View style={styles.activitiesGridsContainer}>
          <ActivitiesGrid
            title={'Suas Atividades'}
            button={
              <TouchableOpacity onPress={toggleUserActivities}>
                <CaretDown
                  size={31}
                  weight="bold"
                  style={{
                    transform: [
                      {rotate: showUserActivities ? '0deg' : '180deg'},
                    ],
                  }}
                />
              </TouchableOpacity>
            }
            fetchFunction={getUserCreatedActivities}
            collapsible={true}
            collapsed={!showUserActivities}
          />

          <ActivitiesGrid
            title={'Histórico de Atividades'}
            fetchFunction={getUserParticipatedActivities}
            collapsible={true}
          />
        </View>
      </ScrollView>
    </>
  );
}
