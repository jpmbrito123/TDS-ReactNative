import React, {useEffect} from "react";
import { LogBox, useColorScheme } from "react-native";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";

import TabNavigator from "./src/navigation/tabNavigator.js";

import { DbContextProvider } from "./src/database/dbContext";
import { GeofenceProvider } from "./src/utils/geofenceProvider.js";
import { LocationProvider } from "./src/utils/locationProvider.js";
import { AuthProvider } from './src/utils/authtoken.js';

function App () {
    const isDarkMode = useColorScheme() === 'dark';
	  const theme = isDarkMode ? DarkTheme : DefaultTheme;
    
    useEffect(() => {
        LogBox.ignoreLogs(["EventEmitter"]);
    }, []);

    return (
        <DbContextProvider>
            <GeofenceProvider>
                <LocationProvider>
                    <AuthProvider>
                        <NavigationContainer theme={theme}>
                            <TabNavigator />
                        </NavigationContainer>
                    </AuthProvider>
                </LocationProvider>
            </GeofenceProvider>
        </DbContextProvider>
    );
  };

export default App;