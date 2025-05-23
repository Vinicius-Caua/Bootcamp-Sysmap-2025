import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import CustomText from '../textComponent/CustomText';
import CustomTitle from '../TitleComponent/CustomTitle';
import {
  Activity,
  PaginatedActivities,
} from '../../models/activities/activitiesModel';
import ActivityCard from '../activityCardComponent/ActivityCard';
import THEME from '../../assets/themes/THEME';

type FetchActivitiesFunction = (
  page: number,
  pageSize: number,
  ...args: any[]
) => Promise<PaginatedActivities>;

interface ActivitiesGridProps {
  title: string;
  button?: React.ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
  activities?: Activity[];
  fetchFunction?: FetchActivitiesFunction;
  fetchParams?: any[];
  onPress?: () => void;
  onLoadMore?: () => void;
  onActivityPress?: (activityId: string) => void;
}

export default function ActivitiesGrid({
  title,
  button,
  activities: initialActivities,
  collapsible = false,
  collapsed = false,
  fetchFunction,
  fetchParams = [],
  onPress,
  onActivityPress,
  onLoadMore: handleExternalLoadMore,
}: ActivitiesGridProps) {
  const [activities, setActivities] = useState<Activity[]>(
    initialActivities || [],
  );
  const [loading, setLoading] = useState(!initialActivities && !!fetchFunction);
  const [_page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const isLoadingMoreRef = useRef(false);

  const fetchActivities = useCallback(
    async (currentPage: number) => {
      if (!fetchFunction) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetchFunction(
          currentPage,
          pageSize,
          ...fetchParams,
        );

        // Verify if there are activities to load
        if (response.activities.length === 0) {
          setHasMore(false);
          return;
        }

        // Update activities state based on the current page
        // If it's the first page, replace the activities state
        if (currentPage === 1) {
          setActivities(response.activities);
        } else {
          // Use functional update to get the latest activities state
          setActivities(prevActivities => {
            return [...prevActivities, ...response.activities];
          });
        }

        setHasMore(response.next !== null);
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
      } finally {
        setLoading(false);
        isLoadingMoreRef.current = false;
      }
    },
    [fetchFunction, fetchParams, pageSize], // Now we can safely omit activities
  );

  // Load activities when the component mounts or when fetchFunction changes
  useEffect(() => {
    if (!initialActivities && fetchFunction) {
      fetchActivities(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler to load more activities
  const handleLoadMore = () => {
    if (hasMore && !loading && !isLoadingMoreRef.current) {
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchActivities(nextPage);
        return nextPage;
      });

      if (handleExternalLoadMore) {
        handleExternalLoadMore();
      }
    }
  };

  // Handler activity press
  const handleActivityPress = (activityId: string) => {
    if (onActivityPress) {
      onActivityPress(activityId);
    } else {
      // navigation.navigate('ActivityDetails', {activityId});
    }
  };

  // Calculate the width of the window and set the card spacing and slide gap
  const windowWidth = Dimensions.get('window').width;
  const CARD_SPACING = 20;
  const SLIDE_GAP = 30;
  const SLIDE_WIDTH = windowWidth - CARD_SPACING * 2;

  // Preper pairs of activities for rendering
  const prepareActivityPairs = useCallback(() => {
    const pairs = [];
    for (let i = 0; i < activities.length; i += 2) {
      pairs.push({
        firstActivity: activities[i],
        secondActivity: i + 1 < activities.length ? activities[i + 1] : null,
        id: `${i}-${activities[i].id}`,
      });
    }
    return pairs;
  }, [activities]);

  // Render pair of activities
  const renderSlide = ({
    item,
  }: {
    item: {
      firstActivity: Activity;
      secondActivity: Activity | null;
      id: string;
    };
  }) => {
    return (
      <View style={styles.activityColumn}>
        {/* 1° Activity */}
        <ActivityCard
          style={styles.activityItem}
          activity={item.firstActivity}
          onPress={() => handleActivityPress(item.firstActivity.id)}
        />

        {/* 2° Activity */}
        {item.secondActivity ? (
          <ActivityCard
            style={styles.activityItem}
            activity={item.secondActivity}
            onPress={() =>
              item.secondActivity && handleActivityPress(item.secondActivity.id)
            }
          />
        ) : (
          // Blank space for the second activity if it doesn't exist
          <View style={styles.activityItem} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Buttons Header */}
      <View style={styles.containerTitle}>
        {title && <CustomTitle style={styles.title}>{title}</CustomTitle>}
        {button && (
          <TouchableOpacity onPress={onPress}>
            {typeof button === 'string' ? (
              <CustomText style={styles.buttonText}>{button}</CustomText>
            ) : (
              button
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Activity Slider Shower */}
      {(!collapsible || !collapsed) && (
        <>
          {loading && activities.length === 0 ? (
            <ActivityIndicator size="large" color={THEME.COLORS.emerald} />
          ) : (
            <FlatList
              horizontal={true}
              data={prepareActivityPairs()}
              extraData={activities}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gridContainer}
              keyExtractor={(item, index) =>
                `activity-pair-${index}-${item.id}`
              }
              renderItem={renderSlide}
              snapToInterval={SLIDE_WIDTH + SLIDE_GAP}
              snapToAlignment="start"
              decelerationRate="fast"
              pagingEnabled={false}
              nestedScrollEnabled={true}
              disableIntervalMomentum={true}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.9}
              windowSize={5}
              initialNumToRender={3}
              maxToRenderPerBatch={5}
              removeClippedSubviews
              ListEmptyComponent={
                <CustomText style={styles.emptyText}>
                  Nenhuma atividade encontrada
                </CustomText>
              }
              ListFooterComponent={
                loading && activities.length > 0 ? (
                  <ActivityIndicator
                    color={THEME.COLORS.emerald}
                    style={styles.loadMoreIndicator}
                  />
                ) : null
              }
            />
          )}
        </>
      )}
    </View>
  );
}
