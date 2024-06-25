import React, { useCallback, useState, useContext } from 'react';
import { BackHandler, Button, Dimensions, FlatList, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDbContext } from '../database/dbContext';
import { fetchTrailById } from '../database/queries/trail';
import { fetchRelTrailsByTrailId } from '../database/queries/rel_trail';
import { fetchEdgesByTrailId } from '../database/queries/edge';
import { fetchTrailMedias } from '../database/queries/medias';
import MediaProvider from '../components/MediaProvider';
import {
    insertHistoryTrail,
    fetchAllHistoryTrails,
    fetchHistoryTrailByUsernameDate,
    updateHistoryTrail_Started
} from '../database/queries/history_trail';
import moment from "moment";

import EdgeCard from '../components/edgeCard';
import { AuthContext } from '../utils/authtoken';
import { Spacing, Typography, Colors } from '../styles';
import { getMedias } from '../api/api';
const { width } = Dimensions.get('window');

function TrailInfoScreen({ route }) {
    const {
        container,
        subText,
        title,
        loading_container,
        loading_text,
        description,
        row,
        buttonContainer,
        subTextContainer,
        rel_container,
        media,
    } = styles;

    const db = useDbContext();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [trailData, setTrailData] = useState([]);
    const [relTrailData, setRelTrailData] = useState([]);
    const [edgeData, setEdgeData] = useState([]);
    const [medias, setMedias] = useState([]);
    const { isLoggedIn, user_type, username } = useContext(AuthContext);

    const { trail_id } = route.params;

    const fetchTrailData = async () => {
        try {

            const trail = await fetchTrailById(db, trail_id);
            const relTrails = await fetchRelTrailsByTrailId(db, trail_id);
            const edges = await fetchEdgesByTrailId(db, trail_id);

            setTrailData(trail);
            setRelTrailData(relTrails);
            setEdgeData(edges);
            let medias = await fetchTrailMedias(db, trail_id);
            if (medias && medias.length > 0) {
                setMedias(medias);
            } else {
                await getMedias(db);
                medias = await fetchTrailMedias(db, trail_id);
                setMedias(medias);
            }
            setLoading(false);

            if (username) {
                const history_ = await fetchHistoryTrailByUsernameDate(db, username, moment().format('YYYY-MM-DD'));
                const trailExists = history_.some(trail => trail.trail_id === trail_id);
                if (!trailExists) {
                    await insertHistoryTrail(db, username, trail_id);
                }
                /* 
                const history = await fetchAllHistoryTrails(db);
                console.log("[TRAILSCREENINFO] History", history);
                */
            }

        } catch (error) {
            setLoading(false);
            console.error('[TrailInfoScreen]: Error fetching data:', error);
        }
    };

    const openGmapsUrl = (edges) => {
        if (username) {
            updateHistoryTrail_Started(db, username,edges[0].trail_id);
        }

        let coords = [];

        edges.forEach(function (edge, index) {
            coords.push([edge.start_pin_latitude, edge.start_pin_longitude]);
            if (index === edges.length - 1) {
                coords.push([edge.end_pin_latitude, edge.end_pin_longitude]);
            }
        });

        let waypoints = coords.slice(0, -1).map(coord => coord.join(',')).join('|');
        let destination = coords[coords.length - 1].join(',');

        Linking.openURL(`https://www.google.com/maps/dir/?api=1&waypoints=${waypoints}&destination=${destination}`)
            .catch(err => console.error('[GoogleMapsUrl] Error:', err));
    };

    const fetchTrailDataCallback = useCallback(function () {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Trails' }],
            });
            return true;
        });

        fetchTrailData();

        return () => backHandler.remove();
    }, [db, trail_id]);
    useFocusEffect(fetchTrailDataCallback);

    return (loading) ? (
        <SafeAreaView style={loading_container}>
            <Text style={loading_text}>Loading</Text>
        </SafeAreaView>
    ) : (
        <SafeAreaView>
            <ScrollView>
                <View style={container}>
                    <Text style={title}>{trailData.trail_name}</Text>
                    <Text style={description}>{trailData.trail_desc}</Text>
                    <View style={row}>
                        <View style={subTextContainer}>
                            <Text style={subText}>Duration: {trailData.trail_duration} min</Text>
                        </View>
                        <View style={subTextContainer}>
                            <Text style={subText}>Difficulty: {trailData.trail_difficulty}</Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={medias}
                    keyExtractor={item => item.media_id}
                    horizontal={true}
                    renderItem={({ item, index }) => (
                        <MediaProvider media={item} index={index} isLoggedIn={isLoggedIn} user_type={user_type} />
                    )}
                    style={media}
                />
                <FlatList
                    data={relTrailData}
                    renderItem={({ item }) =>
                        <View style={rel_container}>
                            <Text>{item.rel_trail_attrib}: {item.rel_trail_value}</Text>
                        </View>
                    }
                    contentContainerStyle={Spacing.xlgMargin.bottom}
                    scrollEnabled={false}
                />
                {user_type === 'Premium' && (
                    <View style={buttonContainer}>
                        <Button title="Start trail" onPress={() => openGmapsUrl(edgeData)} color='darkgreen' />
                    </View>
                )}
                <View style={Spacing.mdMargin.bottom}>
                    <FlatList
                        data={edgeData}
                        renderItem={({ item }) =>
                            <EdgeCard edge={item} />
                        }
                        contentContainerStyle={{ gap: 15 }}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...Spacing.flex1,
        ...Spacing.lgPadding.horizontal,
        ...Spacing.xlgMargin.bottom,
        alignItems: 'center',
    },
    media: {
        ...Spacing.lgMargin.top,
        height: 400
    },
    loading_container: {
        ...Spacing.flex1,
        ...Spacing.center
    },
    loading_text: {
        ...Typography.center,
        ...Colors.textColors.black,
    },
    rel_container: {
        ...Colors.backgroundColors.green,
        ...Spacing.xsmPadding.padding,
        ...Spacing.lgMargin.horizontal,
        width: width - 40,
        borderRadius: 5,
    },
    title: {
        ...Typography.xlgFontBold,
        ...Spacing.lgMargin.margin,
    },
    description: {
        ...Typography.mdFont,
        ...Spacing.lgPadding.bottom,
    },
    row: {
        ...Spacing.flexRow,
        justifyContent: 'space-between'
    },
    info: {
        ...Spacing.flex1,
        ...Typography.smFont,
        ...Spacing.xsmMargin.right
    },
    subTextContainer: {
        ...Spacing.flex1
    },
    subText: {
        ...Typography.center,
    },
    buttonContainer: {
        ...Spacing.mdMargin.bottom,
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default TrailInfoScreen;
