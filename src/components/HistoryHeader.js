import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Spacing, Typography, Colors } from "../styles";


const HistoryHeader = props => {
    const { headers } = props;
    const { container, cell, text } = styles;
    
    return (
        <View style={container}>
            {headers.map((header, index) => (
                <View key={index} style={[cell]}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={text}>{header}</Text>
                </View>
            ))}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        ...Spacing.flexRow,
        justifyContent: 'space-around'
    },
    cell: {
        ...Spacing.flex1,
        ...Spacing.center,
        backgroundColor: '#949494',
        borderBottomWidth: 2
    },
    text: {
        ...Typography.lgFont,
        ...Colors.textColors.white
    }
});
export default HistoryHeader;