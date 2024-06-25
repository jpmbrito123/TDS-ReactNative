import React, { createContext, useContext, useState } from "react";

import { useDbContext } from "../database/dbContext";
import { fetchPins } from "../database/queries/pin";

const GeofenceContext = createContext();

export const useGeofenceContext = () => {
  return useContext(GeofenceContext);
}

export const GeofenceProvider = ({ children }) => {
    const db = useDbContext();

    const [geofences, setGeofences] = useState([]);
    
    const createGeofenceObjects = async () => {
        try {
            const data = await fetchPins(db);

            setGeofences(data.map(pin => ({
                id: pin.pin_id,
                name: pin.pin_name,
                latitude: pin.pin_latitude,
                longitude: pin.pin_longitude,
                radius: 100
            })));
            console.log(`[GeofenceManager] Created ${geofences.length} geofences`);
            } catch (error) {
            console.error('[GeofenceManager] Error creating geofences:', error);
            throw error;
        }
    }

    const haversineDistance = (coords1, coords2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371; // Earth radius in km
        const dLat = toRad(coords2.latitude - coords1.latitude);
        const dLon = toRad(coords2.longitude - coords1.longitude);
        const lat1 = toRad(coords1.latitude);
        const lat2 = toRad(coords2.latitude);
    
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance * 1000; // Convert to meters
    }

    const updateGeofenceRadius = (newRadius) => {
        setGeofences(geofences.map(geofence => ({ ...geofence, radius: newRadius })));
    }
    
    const isInsideGeofence = (location) => {
        const insideGeofences = [];
        
        for (let geofence of geofences) {
            const distance = haversineDistance({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }, {
                latitude: geofence.latitude,
                longitude: geofence.longitude,
            });
    
            if (distance <= geofence.radius) {
                // console.log(`[GeofenceManager] - User is within geofence: ${geofence.id}`);
                insideGeofences.push(geofence);
            }
        }
    
        return insideGeofences;
    };

    const getDistancesToGeofences = (location) => {
        return geofences.map(geofence => {
            const distance = haversineDistance({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }, {
                latitude: geofence.latitude,
                longitude: geofence.longitude,
            });
            
            return { id: geofence.id, name: geofence.name, distance: distance };
        });
    };
    
    return (
        <GeofenceContext.Provider value={{ geofences, createGeofenceObjects, isInsideGeofence, getDistancesToGeofences, updateGeofenceRadius }}>
            {children}
        </GeofenceContext.Provider>
    );
}

export default GeofenceContext;