import React, { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useDbContext } from '../database/dbContext';
import { fetchTrails } from '../database/queries/trail';
import { getTrails } from '../api/api';

import { Spacing, Colors, Typography } from '../styles';

import TrailCard from '../components/trailCard';

function TrailsScreen() {
	const { container } = styles;
	const db = useDbContext();

	const [loading, setLoading] = useState(true);
	const [trailData, setTrailData] = useState([]);

	const fetchTrailData = async () => {
		try {
			let trails = await fetchTrails(db);
			if (trails && trails.length > 0) {
				setTrailData(trails);
			}
			else {
				await getTrails(db);
				trails = await fetchTrails(db);
				setTrailData(trails);
			}
			setLoading(false);
		} catch (error) {
			console.error('[TrailsScreen]: Error fetching data:', error);
		}
	}

	const fetchTrailDataCallback = useCallback(function () {
		console.log("fetching trail data")
		fetchTrailData();
	}, [db]);
	useFocusEffect(fetchTrailDataCallback);

	return (loading) ? (
		<SafeAreaView style={container}>
			<Text style={Typography.center}>Loading...</Text>
		</SafeAreaView>
	) : (
		<SafeAreaView style={container}>
			<FlatList
				data={trailData}
				renderItem={({ item }) =>
					<TrailCard trail={item} />
				}
				contentContainerStyle={{ gap: 15 }}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		...Spacing.center,
		...Spacing.flex1
	}
});

export default TrailsScreen;