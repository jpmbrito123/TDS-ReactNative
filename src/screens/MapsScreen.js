import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, Dimensions, StyleSheet, View, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import { fetchPins } from '../database/queries/pin';
import { useDbContext } from '../database/dbContext';
import { useLocationContext } from '../utils/locationProvider';
import { requestLocationPermission } from '../utils/permissions';

import { Spacing, Typography, Colors } from '../styles';

const { width, height } = Dimensions.get('window');

function MapsScreen() {
    const { container, map } = styles;

    const db = useDbContext();
    const navigation = useNavigation();
    const { setIsLocationEnabled, location } = useLocationContext();

    const [loading, setLoading] = useState(true);

    const [pinData, setPinData] = useState([]);
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
    });
    let setRegionOnce = true;
    const [markerCoordinate, setMarkerCoordinate] = useState({
        latitude: 0,
        longitude: 0,
    });

    const fetchPinData = async () => {
        try {
            const pins = await fetchPins(db);
            const filteredPins = pins.map(pin => ({
                id: pin.pin_id,
                name: pin.pin_name,
                latitude: pin.pin_latitude,
                longitude: pin.pin_longitude
            }));
            setPinData(filteredPins);
        } catch (error) {
            console.log('[MapsScreen] Error fetching pins:', error);
        }
    }

    const getCurrentLocation = async () => {
        const hasLocationPermissions = await requestLocationPermission();

        if (hasLocationPermissions) {
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`[MapsScreen] getCurrentLocation: ${latitude}, ${longitude}`);

                    setRegion({
                        ...region,
                        latitude,
                        longitude,
                    });

                    setMarkerCoordinate({
                        latitude,
                        longitude,
                    });

                    setLoading(false);
                },
                (error) => {
                    console.error(`[MapsScreen] getCurrentLocation Error code: ${error.code}, Message: ${error.message}`);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    }

    const callback = useCallback(function () {
        fetchPinData();

        getCurrentLocation();
        setIsLocationEnabled(true);

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
            return true;
        });

        return () => backHandler.remove();
    }, [db]);
    useFocusEffect(callback);

    useEffect(() => {
        if (location) {
            const { latitude, longitude } = location.coords;
            setMarkerCoordinate({
                latitude,
                longitude,
            });
        }
    }, [location]);

    return (loading) ? (
        <View style={[Spacing.flex1, Spacing.center]}>
            <Text style={Typography.center}>Loading...</Text>
        </View>
    ) : (
        <View style={container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={map}
                region={region}
            >
                <Marker
                    coordinate={markerCoordinate}
                    title="You are here"
                    description="Your current location"
                    image={require('../assets/marker.png')}
                />

                {pinData.map((pin) => (
                    <Marker
                        key={pin.id}
                        coordinate={{
                            latitude: pin.latitude,
                            longitude: pin.longitude
                        }}
                        title={pin.name}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...Spacing.center,
        ...StyleSheet.absoluteFillObject,
        width: width,
        height: height,
        justifyContent: 'flex-end',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapsScreen;