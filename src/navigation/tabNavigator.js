import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Spacing, Colors, Typography } from "../styles";

import HomeScreen from "../screens/HomeScreen";
import TrailsScreen from "../screens/TrailsScreen";
import TrailInfoScreen from "../screens/TrailInfoScreen";
import MapsScreen from "../screens/MapsScreen";
import PinsScreen from "../screens/PinsScreen"; 
import ProfileScreen from "../screens/ProfileScreen";
import ProfileInfoPage from "../screens/ProfilePage";
import SettingsScreen from "../screens/SettingsScreen";
import { AuthContext } from '../utils/authtoken';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { user_type } = useContext(AuthContext);

    const { tab } = styles
    return (
        <Tab.Navigator
            initialRouteName="Home"
            detachInactiveScreens={true}
            screenOptions={{
                headerShown: false,
                tabBarActiveBackgroundColor: 'darkgreen',
                tabBarInactiveBackgroundColor: 'green',
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'black',
                tabBarShowLabel: false,
                tabBarStyle: tab,
            }}
        >

            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ ...getTabScreenOptions('Home', require('../assets/home_icon.png'), 'Home') }}
            />

            <Tab.Screen
                name="Trails"
                component={TrailsScreen}
                options={{ ...getTabScreenOptions('Trails', require('../assets/trails_icon.png'), 'Trails') }}
            />
            <Tab.Screen name="TrailInfo" component={TrailInfoScreen} options={{ tabBarItemStyle: { ...Spacing.hide } }} />

            <Tab.Screen
                name="Pins"
                component={PinsScreen}
                options={{ ...getTabScreenOptions('Pins', require('../assets/pin_icon.png'), 'Pins') }}
            />
            {user_type === 'Premium' && (
                <Tab.Screen 
                    name="Maps" 
                    component={MapsScreen} 
                    options={{ ...getTabScreenOptions('Maps', require('../assets/maps_icon.png'), 'Maps') }} 
                />
            )}
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ ...getTabScreenOptions('Profile', require('../assets/profile_icon.png'), 'Profile') }} 
            />
            <Tab.Screen name="ProfilePage"
                component={ProfileInfoPage}
                options={{
                    tabBarItemStyle: {
                        ...Spacing.hide,
                    },
                }}
            />

            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ ...getTabScreenOptions('Settings', require('../assets/settings_icon.png'), 'Settings') }}
            />
        </Tab.Navigator>
    );
};

const getTabScreenOptions = (title, source, text) => ({
    title: title,
    tabBarIcon: ({ focused }) => (
        <View style={styles.tabIcon}>
            <Image
                source={source}
                resizeMode='contain'
                style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? 'white' : 'black',
                }}
            />
            <Text style={{ color: focused ? Colors.textColors.white : Colors.textColors.black }}>{text}</Text>
        </View>
    )
});

const styles = StyleSheet.create({
    tab: {
        ...Colors.backgroundColors.green,
        height: 75,
        borderTopWidth: 0,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
        bottom: 0,
    },
    tabIcon: {
        ...Spacing.center,
        alignSelf: 'center',
    }
})

export default TabNavigator;
