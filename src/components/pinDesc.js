import React from 'react';
import { Dimensions, FlatList, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Colors, Typography, Spacing } from "../styles";

const { width } = Dimensions.get('window');

const PinDesc = ({ pins, openModal }) => {
    const { pin_card, item_title, item_title_text, desc, desc_text, location_text, rels, rels_title } = styles
    return (
        <FlatList
            data={pins}
            keyExtractor={(item) => item.pin_id.toString()}
            renderItem={({ item }) => (
                <View style={pin_card}>
                    <TouchableOpacity onPress={() => openModal(item)}>
                        <View style={item_title}>
                            <Text style={item_title_text}>{item.pin_name}</Text>
                        </View>
                    </TouchableOpacity>
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
                        <TouchableOpacity onPress={() => openModal(item)} style={styles.showMediaButton}>
                            <Text style={styles.showMediaButtonText}>Show Media</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    pin_card: {
        ...Colors.backgroundColors.green,
        ...Spacing.center,
        ...Spacing.mdMargin.top,
        borderRadius: 30,
        marginBottom: 5,
    },
    item_title: {
        ...Colors.backgroundColors.light_green,
        width: width * 0.8,
        marginTop: 5,
        borderRadius: 30,
        backgroundColor: '#45a26e',
        borderRadius: 30,
    },
    item_title_text: {
        ...Typography.lgFontBold,
        ...Spacing.lgPadding.padding,
        ...Typography.center,
        ...Colors.textColors.black,
        marginTop: 4,
    },
    desc: {
        ...Colors.backgroundColors.white,
        borderRadius: 30,
        marginBottom: 5,
        marginTop: 5,
        width: width * 0.9,
        alignItems: 'center',
    },
    desc_text: {
        ...Typography.center,
        ...Colors.textColors.black,
        ...Spacing.lgPadding.padding,
        ...Typography.mdFont,
    },
    location_text: {
        ...Typography.mdFont,
        ...Typography.center,
        ...Colors.textColors.black,
        ...Spacing.xsmMargin.vertical,
    },
    rels: {
        ...Spacing.xsmMargin.top,
        alignItems: 'center',
    },
    rels_title: {
        ...Typography.mdFontBold,
        ...Colors.textColors.black,
    },
    showMediaButton: {
        ...Spacing.xsmMargin.top,
        ...Spacing.xsmPadding.padding,
        backgroundColor: '#3498db',
        borderRadius: 5,
    },
    showMediaButtonText: {
        ...Typography.center,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default PinDesc;
