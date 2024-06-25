import React, { createContext, useState, useEffect, useContext } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { useGeofenceContext } from './geofenceProvider';
import { requestLocationPermission } from './permissions';
import { displayClickableNotification, displayPermanentNotification, removeNotification } from './notification';
import { useDbContext } from '../database/dbContext';
import { insertHistoryPin } from '../database/queries/history_pin';
import { AuthContext } from './authtoken';

const LocationContext = createContext();

export const useLocationContext = () => {
	return useContext(LocationContext);
}

export const LocationProvider = ({ children }) => {
	const [isLocationEnabled, setIsLocationEnabled] = useState(false);
	const [location, setLocation] = useState(null);
	const [watchId, setWatchId] = useState(null);

	const { createGeofenceObjects, isInsideGeofence, getDistancesToGeofences } = useGeofenceContext();

	const db = useDbContext();
	const { username } = useContext(AuthContext);

	const startListeningToLocationUpdates = async () => {
		if (watchId) return; // Ensure we only start listening once

		const hasLocationPermissions = await requestLocationPermission();

		if (hasLocationPermissions) {
			console.log('[LocationService] Starting to listen to location updates');

			await createGeofenceObjects();

			await displayPermanentNotification(
				'1',
				'Location channel',
				'1',
				'Location service',
				'Running',
			);

			const id = Geolocation.watchPosition(
				(position) => {
					setLocation(position);
					console.log(`[LocationService] Position: ${position.coords.latitude}, ${position.coords.longitude}`);

					const geofences = isInsideGeofence(position);
					if (geofences.length > 0) {
						console.log(`[LocationService] - User is inside geofences: ${geofences.map(geofence => `${geofence.id} (${geofence.name})`).join(', ')}`);

						for (const geofence of geofences) {
							displayClickableNotification(
								'2',
								'Geofence channel',
								geofence.id.toString(),
								`Entered geofence`,
								`You're close to ${geofence.name}!`,
							);
							insertHistoryPin(db, username, geofence.id);
						}
					}

					/*
					for (const geofence of getDistancesToGeofences(position, geofence)) {
						console.log(`[LocationService] - Distance to ${geofence.name}: ${geofence.distance}`);
					}
					*/
				},
				(error) => {
					console.log(error);
				},
				{
					enableHighAccuracy: true,
					distanceFilter: 0,
					interval: 10000,
					fastestInterval: 5000,
				}
			);
			setWatchId(id);
		}
	}

	const stopListeningToLocationUpdates = async () => {
		if (watchId !== null) {
			Geolocation.clearWatch(watchId);
			setWatchId(null);
			await removeNotification('1');
			console.log('[LocationService] Stopped listening to location updates');
		}
	}

	useEffect(() => {
		if (isLocationEnabled) {
			startListeningToLocationUpdates();
		} else {
			stopListeningToLocationUpdates();
		}

		return () => stopListeningToLocationUpdates();
	}, [isLocationEnabled]);

	return (
		<LocationContext.Provider value={{ isLocationEnabled, setIsLocationEnabled, location }}>
			{children}
		</LocationContext.Provider>
	);
};

export default LocationContext;
