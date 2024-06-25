import React, { useState, useCallback } from 'react';
import { BackHandler, Dimensions, ImageBackground, StyleSheet, ScrollView, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { getAppInfo } from '../database/queries/apps';
import ContactButton from './ContactButton';
import api from '../api/api';
import { useDbContext } from '../database/dbContext';
import { fetchContacts } from '../database/queries/contacts';
import { useFocusEffect } from '@react-navigation/native';
import { fetchSocials } from '../database/queries/socials';
import { fetchPartners } from '../database/queries/partners';
import { Spacing, Typography, Colors } from '../styles';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ }) => {
    const db = useDbContext();
    const [app_title, set_app_title] = useState('');
    const [app_desc_text, set_app_desc_text] = useState('');
    const [contacts, setContacts] = useState([]);
    const [socials, setSocials] = useState([]);
    const [partners, setPartners] = useState([]);
    const {
        container,
        contactButtonContainer,
        title,
        titleContainer,
        description,
        backgroundImage,
    } = styles;

    async function fetchDB() {
        try {
            const app_info = await getAppInfo(db);
            const contacts = await fetchContacts(db);
            const socials = await fetchSocials(db);
            const partners = await fetchPartners(db);

            if (app_info) {
                setContacts(contacts);
                setSocials(socials);
                setPartners(partners);

                const title = app_info.app_desc,
                    desc_text = app_info.app_landing_page_text.match(/(.*)\./g); // cut the download substring
                set_app_title(title);
                set_app_desc_text(desc_text);
            } else {
                // get app info from backend
                await api.getAppInfo(db);
                set_app_title("BraGuia");
            }
        } catch (e) {
            console.log(`[braguiaHome]: an error has occurred retrieving app data, ${e.message}`);
        }
    }

    async function checkAndShowAlert() {
        try {
            const hasSeenAlert = await AsyncStorage.getItem('hasSeenAlert');
            if (hasSeenAlert === null) {
                // Show alert
                Alert.alert(
                    "Atenção",
                    "Google Maps é necessário para o funcionamento completo da aplicação.",
                    [
                        {
                            text: "OK",
                            onPress: () => AsyncStorage.setItem('hasSeenAlert', 'true')
                        }
                    ]
                );
            }
        } catch (error) {
            console.log(`[checkAndShowAlert]: an error occurred, ${error.message}`);
        }
    }

    const fetchAppData = useCallback(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to go back?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "YES",
                    onPress: () => BackHandler.exitApp()
                },
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        };


        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        fetchDB();
        checkAndShowAlert();

        return () => backHandler.remove();
    }, [db]);

    useFocusEffect(fetchAppData);
    return (
        <ImageBackground source={require('../assets/braguia_mainpage.jpg')} style={backgroundImage}>
            <ScrollView contentContainerStyle={container}>
                <View style={contactButtonContainer}>
                    <ContactButton contacts={contacts} socials={socials} partners={partners} />
                </View>
                <View style={titleContainer}>
                    <Text style={title}>{app_title}</Text>
                </View>
                <View style={titleContainer}>
                    <Text style={description}>{app_desc_text}</Text>
                </View>

            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        ...Typography.center,
        ...Spacing.lgPadding.padding,
        flexGrow: 1
    },
    contactButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    title: {
        ...Colors.textColors.white,
        ...Typography.lgFontBold,
        ...Typography.center,
        elevation: 20,
        marginTop: '25%',
        alignSelf: 'center',
        fontSize: 50,
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
        width: width - 50,
    },
    titleContainer: {
        ...Spacing.lgMargin.vertical
    },
    description: {
        ...Typography.center,
        ...Spacing.xsmMargin.bottom,
        ...Typography.mdFont,
        ...Colors.textColors.white,
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
        width: width - 50,
    },
    backgroundImage: {
        ...Spacing.flex1,
        ...Spacing.center,
        width: '100%',
        height: '100%',
    },
});

export default HomeScreen;
