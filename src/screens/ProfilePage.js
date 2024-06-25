import React, { useContext, useState, useCallback } from 'react';
import { Dimensions, BackHandler, View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList, ImageBackground } from 'react-native';

import { AuthContext } from '../utils/authtoken';

import ProfileScreen from './ProfileScreen';
import api from '../api/api';
import { useFocusEffect } from '@react-navigation/native';
import { useDbContext } from '../database/dbContext';
import { fetchUser } from '../database/queries/user';
import { fetchHistoryTrailByUsername } from '../database/queries/history_trail';
import { fetchHistoryPinByUsername } from '../database/queries/history_pin'
import HistoryRow from '../components/HistoryRow';
import HistoryHeader from '../components/HistoryHeader';
import { Spacing, Typography, Colors } from '../styles';

const { width, height } = Dimensions.get('window');

const ProfileInfoPage = ({ navigation }) => {

    const [loading, setLoading] = useState(true);
    const [historyTrailData, setHistoryTrailData] = useState([]);
    const [historyPinData, setHistoryPinData] = useState([]);
    const [activeList, setActiveList] = useState('trails');

    const showTrails = () => {
        setActiveList('trails');
    }
    const showPins = () => {
        setActiveList('pins');
    }

    const { storeUserType, logout, isLoggedIn, username, sessionid, csrftoken, } = useContext(AuthContext);

    const [user, setUser] = useState(null);
    const db = useDbContext();

    async function fetchDB() {
        if (username && isLoggedIn) {
            try {
                await api.fetchUserDetails(db, username, [sessionid, csrftoken]);
            } catch (e) {
                console.log(`[profilePage]: an error has occurred retrieving profile data, ${e.message}`);
            }
            try {
                const user_ = await fetchUser(db, username);
                if (user_) setUser(user_);
                //console.log(user_);
                await storeUserType(user_.user_type);
                setLoading(false);
            } catch (e) {
                console.log(`[profilePage]: an error has occurred retrieving profile data [2], ${e.message}`);
            }
        }
    }

    const fetchHistoryTrailByUsernameData = async () => {
        try {
            const history_trail = await fetchHistoryTrailByUsername(db, username)
            if (history_trail && history_trail.length > 0) {
                console.log(history_trail);
                setHistoryTrailData(history_trail);
            }
        } catch (error) {
            console.error('[ProfilePage]: Error fetching HistoryTrail data:', error);
        }
    }

    const fetchHistoryPinByUsernameData = async () => {
        try {
            const history_pin = await fetchHistoryPinByUsername(db, username);
            if (history_pin && history_pin.length > 0) {
                console.log(history_pin);
                setHistoryPinData(history_pin);
            }
        } catch (error) {
            console.error('[ProfilePage]: Error fetching HistoryPin data:', error);
        }
    }

    const fetchAppData = useCallback(function () {

        const handleBackPress = () => {
            navigation.navigate('Home'); // Navigate to the desired screen
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackPress
        );

        fetchDB();
        fetchHistoryTrailByUsernameData();
        return () => backHandler.remove();

    }, [db, isLoggedIn]);
    useFocusEffect(fetchAppData);

    return (loading) ? (
        <SafeAreaView style={styles.loading}>
            <Text style={Typography.center}>Loading...</Text>
        </SafeAreaView>
    ) : (!isLoggedIn ? (<ProfileScreen />) : (
        <ImageBackground source={require('../images/road.jpg')} style={Spacing.flex1}>
            <SafeAreaView style={Spacing.flex1}>
                <View style={styles.profile_header}>
                    <View style={Spacing.flex1}>
                        <View style={styles.circle}>
                            <Image source={require('../assets/profile_icon.png')} style={styles.image} />
                        </View>
                    </View>
                    <View style={Spacing.flex2}>
                        <View style={Spacing.column1}>
                            <Text style={styles.name} adjustsFontSizeToFit={true} numberOfLines={1}>{user ? user.username : ''}</Text>
                            <View style={Spacing.flexRow}>
                                <Text style={Typography.smFont}>Date Joined</Text>
                                <Text style={[Spacing.smMargin.horizontal, Typography.smFontBold]}>{user ? user.date_joined.match(/(.*?)T/)[1] : ''}</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.85}
                                style={styles.logoutButton}
                                onPress={() => { logout(); setUser(null); }}
                            >
                                <Text style={Colors.textColors.white}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={Spacing.flex5}>
                    <View style={styles.table}>
                        <View style={Spacing.center}>
                            <Text style={Typography.xlgFontBold}>History</Text>
                            <View style={styles.groupButton}>
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={styles.tableButton}
                                    onPress={() => { console.log('You pressed trails'); showTrails() }}
                                >
                                    <Text style={Colors.textColors.white}>Trails</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={styles.tableButton}
                                    onPress={() => { console.log('You pressed Pins'); showPins() }}
                                >
                                    <Text style={Colors.textColors.white}>Pins</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {activeList === 'trails' && (
                            <FlatList
                                data={historyTrailData}
                                renderItem={({ item, index }) =>
                                    <HistoryRow
                                        index={index}
                                        trailName={item.trail_name}
                                        date={item.date}
                                        startedDate={item.started_date ? item.started_date : '-'}
                                        finishedDate={item.finished_date ? item.finished_date : '-'}
                                    />}
                                ListEmptyComponent={<Text>NO ACTIVITY HERE</Text>}
                                ListHeaderComponent={<HistoryHeader headers={['Trail Name', 'Searched', 'Started', 'Ended']} />}
                            />
                        )}
                        {activeList === 'pins' && (
                            <FlatList
                                data={historyPinData}
                                renderItem={({ item }) =>
                                    <HistoryRow
                                        trailName={item.pin_name}
                                        date={item.date}
                                    />}
                                ListEmptyComponent={<Text>NO ACTIVITY HERE</Text>}
                                ListHeaderComponent={<HistoryHeader headers={['Pin Name', 'Seen']} />}
                            />
                        )}


                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    ));
};

const styles = StyleSheet.create({
    loading: {
        ...Spacing.flex1,
        ...Spacing.center
    },
    groupButton: {
        ...Spacing.flexRow,
        justifyContent: 'space-around',
        width: '100%'
    },
    table: {
        ...Spacing.smMargin.margin,
        maxHeight: '90%'
    },
    profile_header: {
        ...Spacing.flexRow,
        ...Colors.backgroundColors.grey,
        ...Spacing.lgPadding.padding,
        height: 140,
    },
    name: {
        ...Typography.xlgFontBold,
        ...Colors.textColors.azure,
        ...Spacing.xsmMargin.bottom,
        textShadowColor: '#03363D',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
        elevation: 30,
    },
    logoutButton: {
        ...Colors.backgroundColors.red,
        ...Spacing.mdMargin.top,
        alignItems: 'center',
        borderRadius: 10,
        width: width * 0.5,
    },
    tableButton: {
        ...Colors.backgroundColors.purple,
        alignItems: 'center',
        padding: 5,
        margin: 5,
        borderRadius: 10,
        width: '40%',
    },
    image: {
        width: '90%',
        height: '90%'
    },
    circle: {
        ...Spacing.center,
        width: 100, // Adjust the size as needed
        height: 100, // Adjust the size as needed
        borderRadius: 50, // Half of the width/height to make it a circle
        backgroundColor: 'gold', //'silver'
        overflow: 'hidden', // Ensure the image is clipped to the circle
    }
});

export default ProfileInfoPage;

