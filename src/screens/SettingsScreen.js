import React, { useState } from 'react';
import { Button, View, Text, TextInput, Switch, StyleSheet } from 'react-native';

import { useGeofenceContext } from '../utils/geofenceProvider';
import { useLocationContext } from '../utils/locationProvider';
import { Typography, Spacing } from '../styles';

function SettingsScreen() {
	const { container, text, input, innerContainer } = styles;
	const { updateGeofenceRadius } = useGeofenceContext();
	const { isLocationEnabled, setIsLocationEnabled } = useLocationContext();

	const [newRadius, setNewRadius] = useState('');

	const toggleSwitch = () => setIsLocationEnabled(previousState => !previousState);

	const handleRadiusChange = () => {
		if (newRadius) {
			updateGeofenceRadius(parseInt(newRadius));
			console.log(`[SettingsScreen] New geofence radius: ${newRadius}`);

		}
	}

	return (
		<View style={container}>
			<View style={Spacing.flexRow}>
				<Text style={text}>Location service</Text>
				<Switch
					onValueChange={toggleSwitch}
					value={isLocationEnabled}
				/>
			</View>
			<View style={innerContainer}>
				<View style={Spacing.flexRow}>
					<Text style={text}>Geofence radius</Text>
					<TextInput
						style={input}
						placeholder="Default: 100"
						keyboardType="numeric"
						value={newRadius}
						onChangeText={setNewRadius}
					/>
				</View>
				<View style={Spacing.mdMargin.margin}>
					<Button title="Update radius" onPress={handleRadiusChange} color='green' />
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...Spacing.flex1,
		...Spacing.lgMargin.margin,
		alignItems: 'center',
		marginTop: 150,
	},
	text: {
		...Spacing.xlgMargin.horizontal,
		...Typography.lgFont,
	},
	input: {
		...Spacing.xsmMargin.right,
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 8,
		textAlign: 'center',
		borderRadius: 5,
	},
	innerContainer: {
		...Spacing.center,
		margin: 50,
	}
});


export default SettingsScreen;