import React, { useState, useCallback, useContext } from 'react';
import { BackHandler, SafeAreaView, Text, StyleSheet, View, Modal, TouchableOpacity, FlatList } from "react-native";

import { fetchPins } from "../database/queries/pin";
import { getPinRels } from "../database/queries/pin_rel";
import { fetchPinMedias } from '../database/queries/medias';
import MediaProvider from '../components/MediaProvider';
import { useFocusEffect } from '@react-navigation/native';
import { useDbContext } from '../database/dbContext';
import { AuthContext } from '../utils/authtoken';
import { getMedias } from '../api/api';


import { Spacing, Typography, Colors } from '../styles';

const PinsScreen = ({ navigation }) => {
    const {
        loadingText,
        container,
        pin_card,
        item_title,
        item_title_text,
        desc_text,
        location_text,
        rels,
        rels_title,
        modalContainer,
        modalContent,
        modalTitle,
        noMediaText,
        showMediaButton,
        showMediaButtonText,
        desc,
        closeButton,
        closeButtonText
    } = styles;
    const db = useDbContext();
    const { isLoggedIn, user_type } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [medias, setMedias] = useState([]);  
    const [pins, setPins] = useState([]);
    const [selectedPin, setSelectedPin] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const fetchedPins = await fetchPins(db);
            const pinsWithDetails = await Promise.all(fetchedPins.map(async (pin) => {
                const rels = await getPinRels(db, pin.pin_id);
                let medias = await fetchPinMedias(db, pin.pin_id);

                if (medias && medias.length > 0) {
                    setMedias(medias);
                } else {
                    await getMedias(db); 
                    medias = await fetchPinMedias(db, pin.pin_id);
                    setMedias(medias);
                }
                setLoading(false);
              
                return { ...pin, rels, medias };
            }));

            setPins(pinsWithDetails);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        }
    };

    const fetchPinsData = useCallback(() => {
        const handleBackPress = () => {
            navigation.navigate('Home');
            return true;
        };


        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackPress
        );


        fetchData();
        return () => backHandler.remove();
    }, [db]);

    useFocusEffect(fetchPinsData);

    const openModal = (pin) => {
        console.log('Opening modal for pin:', pin);
        setSelectedPin(pin);
    };

    const closeModal = () => {
        setSelectedPin(null);
    };

    return (loading) ? (
        <SafeAreaView style={Spacing.center}>
            <Text style={loadingText}>Loading</Text>
        </SafeAreaView>
    ) : (
        <SafeAreaView style={container}>
            <FlatList
                data={pins}
                keyExtractor={(item) => item.pin_id.toString()}
                renderItem={({ item }) => (
                    <View style={pin_card}>
                        <View style={item_title}>
                            <Text style={item_title_text}>{item.pin_name}</Text>
                        </View>
                        <View style={desc}>
                            <Text style={desc_text}>{item.pin_desc}</Text>
                            <Text style={location_text}>Latitude: {item.pin_latitude}, Longitude: {item.pin_longitude}</Text>
                            {item.rels.length > 0 && (
                                <View style={rels}>
                                    {item.rels.map((rel, index) => (
                                        <Text key={index} style={rels_title}>
                                            {rel.rel_pin_attrib}: {rel.rel_pin_value}
                                        </Text>
                                    ))}
                                </View>
                            )}
                            {isLoggedIn && user_type === 'Premium' && (
                                <TouchableOpacity onPress={() => openModal(item)} style={showMediaButton}>
                                    <Text style={showMediaButtonText}>Show Media</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            />

            {selectedPin && (
                <Modal
                    visible={true}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={closeModal}
                >
                    <View style={modalContainer}>
                        <View style={modalContent}>
                            <TouchableOpacity onPress={closeModal} style={closeButton}>
                                <Text style={closeButtonText}>Close</Text>
                            </TouchableOpacity>
                            <Text style={modalTitle}>{selectedPin.pin_name}</Text>
                            {selectedPin.medias && selectedPin.medias.length > 0 ? (
                                <FlatList
                                    data={selectedPin.medias}
                                    keyExtractor={(item) => item.media_id.toString()}
                                    horizontal={true}
                                    renderItem={({ item, index }) => (
                                        <MediaProvider media={item} index={index} isLoggedIn={isLoggedIn} user_type={user_type} />
                                    )}
                                    style={{ marginTop: 20, height: 400 }}
                                />
                            ) : (
                                <Text style={noMediaText}>No media available for this pin.</Text>
                            )}
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loadingText: {
        ...Typography.center,
        ...Colors.textColors.black,
    },
    container: {
        ...Spacing.flex1,
        ...Spacing.xsmPadding.horizontal,
        backgroundColor: '#fff',
        marginBottom: 0
    },
    pin_card: {
        ...Spacing.center,
        ...Spacing.mdMargin.top,
        ...Colors.backgroundColors.green,
        borderRadius: 30,
        marginBottom: 5,
    },
    item_title: {
        width: '80%',
        marginTop: 5,
        borderRadius: 30,
        backgroundColor: '#45a26e',
    },
    item_title_text: {
        ...Typography.center,
        ...Typography.lgFontBold,
        ...Colors.textColors.black,
        ...Spacing.lgMargin.padding,
        marginTop: 4,
    },
    desc: {
        ...Colors.backgroundColors.white,
        ...Spacing.xsmPadding.vertical,
        borderRadius: 30,
        marginBottom: 5,
        marginTop: 5,
        width: '100%',
        alignItems: 'center',
    },
    desc_text: {
        ...Typography.center,
        ...Typography.mdFont,
        ...Colors.textColors.black,
        ...Spacing.lgPadding.horizontal,
    },
    location_text: {
        ...Typography.center,
        ...Colors.textColors.black,
        ...Typography.mdFont,
        ...Spacing.xsmMargin.top
    },
    rels: {
        ...Spacing.xsmMargin.top,
        alignItems: 'center',
    },
    rels_title: {
        ...Typography.mdFontBold,
        ...Colors.textColors.black
    },
    showMediaButton: {
        ...Spacing.xsmMargin.top,
        ...Spacing.xsmPadding.vertical,
        ...Spacing.lgPadding.horizontal,
        backgroundColor: '#45a26e',
        borderRadius: 30,
    },
    showMediaButtonText: {
        ...Typography.mdFontBold,
        ...Colors.textColors.white,
    },
    modalContainer: {
        ...Spacing.flex1,
        ...Spacing.center,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        ...Colors.backgroundColors.white,
        ...Spacing.lgPadding.padding,
        width: '80%',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        ...Colors.textColors.red,
        ...Typography.mdFontBold,
    },
    modalTitle: {
        ...Typography.lgFontBold,
        ...Spacing.mdMargin.bottom,
    },
    noMediaText: {
        ...Colors.textColors.gray,
        ...Typography.mdFont,
    },
});

export default PinsScreen;