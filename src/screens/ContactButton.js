import React, { useState } from 'react';
import { Pressable, Linking, FlatList, Modal, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Spacing, Colors, Typography } from '../styles';

const ContactButton = ({ contacts, socials, partners }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState('contacts');
    const {
        container,
        itemContainer,
        itemTitle,
        icon,
        iconButton,
        centeredView,
        modalView,
        tabContainer,
        tabButton,
        tabText,
        textStyle,
        button,
        buttonClose,
        buttonOpen
    } = styles;

    const renderItem = ({ item, type }) => {
        if (type === 'contacts') {
            return (
                <View style={itemContainer}>
                    <Text style={itemTitle}>{item.contact_name}</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact_phone}`)} style={iconButton}>
                        <Image style={icon} source={require('../images/phone.png')} />
                    </TouchableOpacity>
                </View>
            );
        } else if (type === 'socials') {
            return (
                <View style={itemContainer}>
                    <Text style={itemTitle}>{item.social_name}</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(item.social_url)} style={iconButton}>
                        <Image style={icon} source={require('../images/link.png')} />
                    </TouchableOpacity>
                </View>
            );
        } else if (type === 'partners') {
            return (
                <View style={itemContainer}>
                    <Text style={itemTitle}>{item.partner_name}</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(item.partner_url)} style={iconButton}>
                        <Image style={icon} source={require('../images/link.png')} />
                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (
        <View style={container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={centeredView}>
                    <View style={modalView}>
                        <View style={tabContainer}>
                            <TouchableOpacity onPress={() => setSelectedTab('contacts')} style={tabButton}>
                                <Text style={tabText}>Contacts</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedTab('socials')} style={tabButton}>
                                <Text style={tabText}>Socials</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedTab('partners')} style={tabButton}>
                                <Text style={tabText}>Partners</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={selectedTab === 'contacts' ? contacts : selectedTab === 'socials' ? socials : partners}
                            keyExtractor={item => item.contact_phone || item.social_url || item.partner_url}
                            renderItem={({ item }) => renderItem({ item, type: selectedTab })}
                        />
                        <Pressable style={[button, buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={textStyle}>Hide</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Pressable style={[button, buttonOpen]} onPress={() => setModalVisible(true)}>
                <Image style={icon} source={require('../images/contacts.png')} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        ...Spacing.xsmMargin.right,
        ...Spacing.xsmMargin.top,
        zIndex: 100,
    },
    centeredView: {
        ...Spacing.flex1,
        ...Spacing.center
    },
    modalView: {
        ...Spacing.xsmMargin.margin,
        bottom: 30,
        height: 360,
        backgroundColor: '#32CD32', // Verde
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: 'white',
        shadowOffset
            : {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1.0,
        shadowRadius: 10,
        elevation: 10,
    },
    tabContainer: {
        ...Spacing.flexRow,
        justifyContent: 'space-around',
        width: '100%',
        ...Spacing.lgMargin.bottom,
    },
    tabButton: {
        ...Spacing.xsmPadding.padding,
        ...Colors.backgroundColors.purple,
        borderRadius: 10,

    },
    tabText: {
        color: 'white',
        fontWeight: 'bold',
    },
    itemContainer: {
        ...Spacing.xsmMargin.top,
        ...Spacing.smPadding.padding,
        ...Colors.backgroundColors.white,
        borderColor: '#228B22', // Verde escuro
        borderRadius: 40,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        borderRightWidth: 4,
        borderLeftWidth: 4,
        alignItems: 'center',
    },
    itemTitle: {
        ...Typography.lgFontBold,
        color: '#006400', // Verde escuro
    },
    iconButton: {
        ...Spacing.xsmMargin.top,
    },
    icon: {
        width: 30,
        height: 30,
        tintColor: '#008000', // Verde escuro
    },
    button: {
        ...Spacing.smPadding.padding,
        borderRadius: 20,
        elevation: 2,
        width: 100,
    },
    buttonOpen: {
        backgroundColor: '#32CD32', // Verde
    },
    buttonClose: {
        top: 20,
        ...Colors.backgroundColors.purple, // Verde
    },
    textStyle: {
        ...Colors.textColors.white,
        ...Typography.center,
        fontWeight: 'bold',
    },
});

export default ContactButton;
