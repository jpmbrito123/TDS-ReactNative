import React, { useContext, useState, useCallback } from 'react';
import {
    Image,
    Dimensions,
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../utils/authtoken';
import { Typography, Colors, Spacing } from '../styles';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    const {
        safeArea,
        pageHeader,
        container,
        title,
        input,
        loginButton,
        loginText
    } = styles;

    const { isLoggedIn, login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await login(username, password);
        } catch (err) {
            Alert.alert("Login failed. Try again");
        }
    };

    const loginAttention = useCallback(function () {

        const handleBackPress = () => {
            navigation.navigate('Home'); // Navigate to the desired screen
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackPress
        );

        if (isLoggedIn) navigation.navigate('ProfilePage');
        return () => backHandler.remove();

    }, [isLoggedIn]);
    useFocusEffect(loginAttention);

    return (
        <SafeAreaView style={safeArea}>
            <View style={pageHeader}>
                <Text style={title}>BraGuia</Text>
            </View>

            <View style={container}>
                <TextInput
                    style={input}
                    selectionColor={'lightskyblue'}
                    textAlign='center'
                    autoComplete='username'
                    maxLength={40}
                    multiline={false}
                    placeholderTextColor={'#6E3B6E'}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={input}
                    selectionColor={'lightskyblue'}
                    textAlign='center'
                    autoComplete='password'
                    maxLength={40}
                    multiline={false}
                    placeholderTextColor={'#6E3B6E'}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    style={loginButton}
                    activeOpacity={0.9}
                >
                    <Text style={loginText}>Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    safeArea: {
        ...Spacing.flex1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    pageHeader: {
        ...Spacing.lgMargin.bottom,
        alignItems: 'center',
    },
    title: {
        ...Colors.textColors.green,
        ...Typography.center,
        fontWeight: 'bold',
        fontSize: 50,
        textShadowColor: '#03363D',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
        elevation: 30,
    },
    container: {
        ...Spacing.flex1,
        ...Spacing.lgPadding.horizontal,
        alignItems: 'center',
    },
    input: {
        ...Colors.backgroundColors.white,
        ...Spacing.xsmMargin.bottom,
        ...Spacing.xsmPadding.horizontal,
        borderRadius: 30,
        height: height * 0.05,
        borderColor: 'gray',
        borderWidth: 1,
        width: '80%',
        color: '#6E3B6E',
    },
    loginButton: {
        ...Spacing.lgMargin.top,
        ...Spacing.center,
        ...Colors.backgroundColors.green,
        width: width * 0.7,
        height: height * 0.05,
        borderRadius: 5,
    },
    loginText: {
        ...Typography.lgFontBold,
        ...Colors.textColors.white,
    },
});