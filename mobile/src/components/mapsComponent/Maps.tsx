import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, PermissionsAndroid, View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {LatLng, Marker} from 'react-native-maps';
import styles from './styles';
import THEME from '../../assets/themes/THEME';

interface MapProps {
  onLocationChange?: (latitude: number, longitude: number) => void;
  initialLocation?: {latitude: number; longitude: number};
  editable?: boolean;
}

export default function Map({
  onLocationChange,
  initialLocation,
  editable = true,
}: MapProps) {
  const [latitude, setLatitude] = useState<number | null>(
    initialLocation?.latitude || null,
  );
  const [longitude, setLongitude] = useState<number | null>(
    initialLocation?.longitude || null,
  );
  const [coordinate, setCoordinate] = useState<LatLng | undefined>(
    initialLocation,
  );
  const mapRef = useRef<MapView>(null);

  async function getPermission() {
    const hasPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return hasPermission === PermissionsAndroid.RESULTS.GRANTED;
  }

  function getLocation() {
    Geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setCoordinate(position.coords);
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 15000},
    );
  }

  // This effect runs when the component mounts and when the initialLocation prop changes
  useEffect(() => {
    // Check if initialLocation is provided
    if (initialLocation) {
      setLatitude(initialLocation.latitude);
      setLongitude(initialLocation.longitude);
      setCoordinate(initialLocation);

      // Animation to the initial location
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000,
        );
      }
    } else {
      getLocation();
    }
  }, [initialLocation]);

  return (
    <View style={styles.container}
    pointerEvents={editable ? 'auto' : 'box-none'}>
      {latitude && longitude ? (
        <MapView
          ref={mapRef}
          onMapReady={() => {
            getPermission();
            if (initialLocation && mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude: initialLocation.latitude,
                  longitude: initialLocation.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                },
                1000,
              );
            }
          }}
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider="google"
          showsUserLocation={true}
          zoomEnabled={true}
          minZoomLevel={17}
          loadingEnabled={true}
          onLongPress={editable ? e => {
            setCoordinate(e.nativeEvent.coordinate);
            setLatitude(e.nativeEvent.coordinate.latitude);
            setLongitude(e.nativeEvent.coordinate.longitude);
            onLocationChange &&
              onLocationChange(
                e.nativeEvent.coordinate.latitude,
                e.nativeEvent.coordinate.longitude,
              );
          } : undefined}>
          {(coordinate || (latitude && longitude)) && (
            <Marker
              draggable={editable}
              coordinate={coordinate || {latitude, longitude}}
              onDragEnd={
                editable
                  ? e => {
                      setLatitude(e.nativeEvent.coordinate.latitude);
                      setLongitude(e.nativeEvent.coordinate.longitude);
                      onLocationChange &&
                        onLocationChange(
                          e.nativeEvent.coordinate.latitude,
                          e.nativeEvent.coordinate.longitude,
                        );
                    }
                  : undefined
              }
              title="Ponto de encontro"
              description="Aqui é o ponto de encontro"
            />
          )}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color={THEME.COLORS.emerald} />
      )}
    </View>
  );
}
