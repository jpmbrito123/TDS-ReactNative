import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from "../styles";

const { width } = Dimensions.get('window');

const TrailCard = ({ trail }) => {
    const { container, row, title, spaceBetween, subText, image } = styles;
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate('TrailInfo', { trail_id: trail.trail_id })}>
            <View style={container}>
                <View style={row}>
                    <Image source={{ uri: trail.trail_img }} style={image} />
                    <Text style={title}>{trail.trail_name}</Text>
                </View>
                <View style={[row, spaceBetween]}>
                    <View style={Spacing.flex1}>
                        <Text style={subText}>{trail.trail_duration} min</Text>
                    </View>
                    <View style={Spacing.flex1}>
                        <Text style={subText}>Difficulty: {trail.trail_difficulty}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        ...Colors.backgroundColors.green,
        ...Spacing.mdPadding.padding,
        borderRadius: 10,
        width: width - 40,
        marginVertical: 2.5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
        elevation: 3,
    },
    row: {
        ...Spacing.flexRow,
        ...Spacing.xsmMargin.bottom,
        alignItems: 'center',
    },
    image: {
        width: 75,
        height: 75,
        marginRight: 25,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
    },
    title: {
        ...Spacing.flex1,
        ...Typography.lgFontBold
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    subText: {
        ...Typography.center,
        ...Typography.mdFont,
    },
});

export default TrailCard;
