import React from "react"
import { View, Text, StyleSheet } from "react-native"
import moment from "moment"
import { Spacing, Typography } from "../styles"


const HistoryRow = props => {
    const { index, trailName, date, startedDate, finishedDate } = props
    const { container, cell, light_cell, dark_cell } = styles
    const isEven = index % 2 === 0
    return (
        <View style={container}>
            <View style={[cell, isEven ? light_cell : dark_cell]}>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={Typography.smFont}>
                    {trailName}
                </Text>
            </View>
            <View style={[cell, isEven ? light_cell : dark_cell]}>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={Typography.smFont}>
                    {date}
                </Text>
            </View>
            {startedDate === '-' ? (
                <View style={[cell, isEven ? light_cell : dark_cell]}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={Typography.smFont}>
                        {startedDate}
                    </Text>
                </View>
            ) : (
                <View style={[cell, isEven ? light_cell : dark_cell]}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={Typography.smFont}>
                        {startedDate === '-' ? startedDate : moment(startedDate).format('YYYY-MM-DD')}
                    </Text>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={Typography.smFont}>
                        {startedDate === '-' ? startedDate : moment(startedDate).format('HH:mm')}
                    </Text>
                </View>
            )}

            {finishedDate === '-' ? (
                <View style={[cell, isEven ? light_cell : dark_cell]}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={Typography.smFont}>
                        {finishedDate}
                    </Text>
                </View>
            ) : (
                <View style={[cell, isEven ? light_cell : dark_cell]}>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={Typography.smFont}>
                        {finishedDate === '-' ? finishedDate : moment(finishedDate).format('YYYY-MM-DD')}
                    </Text>
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={Typography.smFont}>
                        {finishedDate === '-' ? finishedDate : moment(finishedDate).format('HH:mm')}
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...Spacing.flexRow,
        paddingVertical: 3,
    },
    cell: {
        ...Spacing.flex1,
        ...Spacing.center,
        height: 40,
    },
    light_cell: {
        backgroundColor: '#dcdcdc',
    },
    dark_cell: {
        backgroundColor: '#949494',
    }
})
export default HistoryRow