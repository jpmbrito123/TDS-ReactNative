import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../styles";

const { width } = Dimensions.get('window');

const EdgeCard = ({ edge }) => {
    const { container, title, row, spaceBetween} = styles
    return (
        <View style={container}>
            <Text style={title}>{edge.start_pin_name} -&gt; {edge.end_pin_name}</Text>
            <View style={[row, spaceBetween]}>
            <View style={Spacing.flex1}>
                <Text style={Typography.center}>{edge.edge_transport}: {edge.edge_duration} min</Text>
            </View>
            <View style={Spacing.flex1}>
                <Text style={Typography.center}>{edge.edge_desc}</Text>
            </View>
		</View>
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        ...Colors.backgroundColors.green,
        ...Spacing.lgMargin.horizontal,
        ...Spacing.xsmPadding.padding,
        borderRadius: 5,
        width: width - 40,
    },
    row: {
        ...Spacing.xsmMargin.bottom,
        ...Spacing.flexRow,
        alignItems: 'center',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    title: {
        ...Typography.lgFontBold,
        ...Spacing.lgMargin.bottom,
        margin: 5,
    },
});

export default EdgeCard;