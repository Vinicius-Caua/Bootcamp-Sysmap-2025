import {FlatList, StyleProp, TouchableOpacity, View} from 'react-native';
import useAppContext from '../../hooks/useAppContext';
import CustomTitle from '../TitleComponent/CustomTitle';
import styles from './styles';
import {useEffect, useState} from 'react';
import CustomText from '../textComponent/CustomText';
import {ActivityType} from '../../models/activities/activitiesModel';
import PhotoCardComponent from '../photoCardComponent/PhotoCardComponent';
import {fixUrl} from '../../utils/fixUrl';
import {NotePencil} from 'phosphor-react-native';

interface ActivityTypesProps {
  title: string;
  onPress?: () => void;
  onTypePress?: (typeId: string, typeName: string) => void;
  onPressEditMode?: () => void;
  editMode?: boolean;
  selectedTypeId?: string[];
  style?: StyleProp<any>;
}

export default function ActivityTypes({
  title,
  onTypePress,
  selectedTypeId,
  editMode,
  onPressEditMode,
  style,
}: ActivityTypesProps) {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    activities: {getActivityTypes},
  } = useAppContext();

  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const types = await getActivityTypes();
        setActivityTypes(types);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityTypes();
  }, [getActivityTypes]);

  const handleTypePress = (typeId: string, typeName: string) => {
    if (onTypePress) {
      onTypePress(typeId, typeName);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <CustomTitle style={[styles.title, style]}>{title}</CustomTitle>
        {editMode === true ? (
          <TouchableOpacity onPress={onPressEditMode}>
            <NotePencil size={20}/>
          </TouchableOpacity>
        ) : null}
      </View>

      <View>
        {loading ? (
          <CustomText>Carregando...</CustomText>
        ) : (
          <FlatList
            style={styles.flatList}
            data={activityTypes}
            horizontal
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            keyExtractor={activityType => activityType.id}
            renderItem={({item}) => (
              <View style={styles.typeList}>
                <PhotoCardComponent
                  image={{uri: fixUrl(item.image)}}
                  title={item.name}
                  onPress={() => handleTypePress(item.id, item.name)}
                  selected={selectedTypeId?.includes(item.id)}
                />
              </View>
            )}
            ListEmptyComponent={
              <CustomText>Nenhum tipo de atividade encontrado</CustomText>
            }
          />
        )}
      </View>
    </View>
  );
}
