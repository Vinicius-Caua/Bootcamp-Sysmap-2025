import {RouteProp, useRoute} from '@react-navigation/native';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import useAppContext from '../../hooks/useAppContext';
import styles from './styles';
import {CaretDown, CaretLeft} from 'phosphor-react-native';
import CustomTitle from '../../components/TitleComponent/CustomTitle';
import {useTypedNavigation} from '../../hooks/useTypedNavigation';
import ActivityTypes from '../../components/acitivityTypesComponent/ActivityTypes';
import ActivitiesGrid from '../../components/activitiesGridComponent/ActivitiesGrid';
import {useEffect, useState} from 'react';

type ActivitiesByTypeParams = {
  typeId: string;
  typeName: string;
};

export default function ActivitiesTypeScreen() {
  const navigation = useTypedNavigation();
  const route =
    useRoute<RouteProp<{params: ActivitiesByTypeParams}, 'params'>>();

  // Use state to keep track of current typeId and typeName
  const [currentTypeId, setCurrentTypeId] = useState(route.params.typeId);
  const [currentTypeName, setCurrentTypeName] = useState(route.params.typeName);
  // Key to force ActivitiesGrid to reload
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUserActivities, setShowUserActivities] = useState(true);

  const {
    activities: {getActivitiesPaginated, getUserActivitiesByType},
  } = useAppContext();

  const toggleUserActivities = () => {
    setShowUserActivities(prev => !prev);
  };
  // Update state when route params change
  useEffect(() => {
    setCurrentTypeId(route.params.typeId);
    setCurrentTypeName(route.params.typeName);
  }, [route.params]);

  const handleActivityTypePress = (typeId: string, typeName: string) => {
    // Update local state instead of navigating
    setCurrentTypeId(typeId);
    setCurrentTypeName(typeName);
    // Increment key to force ActivitiesGrid to reload
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          {/* Button return */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={styles.backButtonHitContainer}>
            <CaretLeft size={30} weight="bold" />
          </TouchableOpacity>

          {/* Title */}
          <CustomTitle style={styles.title}>{currentTypeName}</CustomTitle>

          {/* Blank space */}
          <View style={styles.spacer} />
        </View>

        <View style={styles.activityTypesContainer}>
          <ActivityTypes
            title={'Categorias'}
            onTypePress={handleActivityTypePress}
            selectedTypeId={[currentTypeId]}
            style={styles.activityTypes}
          />
        </View>

        <View style={styles.activitiesGridsContainer}>
          {/* User Creator activities by typeId */}
          <ActivitiesGrid
            key={`user-activities-${currentTypeId}-${refreshKey}`}
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
            fetchFunction={getUserActivitiesByType}
            fetchParams={[currentTypeId]}
            collapsible={true}
            collapsed={!showUserActivities}
          />

          {/* Activities */}
          <ActivitiesGrid
            key={`activities-${currentTypeId}-${refreshKey}`}
            title={'Atividades da comunidade'}
            fetchFunction={getActivitiesPaginated}
            fetchParams={[currentTypeId]}
          />
        </View>
      </ScrollView>
    </>
  );
}
