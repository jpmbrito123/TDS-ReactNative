import { PermissionsAndroid, Platform } from 'react-native';

export const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location permission',
                message: 'BraGuia needs access to your location',
                buttonNeutral: 'Ask me later',
                buttonNegative: 'Cancel',
                buttonPositive: 'Ok',
            }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.error('[LocationService] requestLocationPermission: Location permission denied');
            return false;
        }
    }
    return true;
};