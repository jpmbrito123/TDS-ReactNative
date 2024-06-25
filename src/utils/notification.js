import notifee, { AndroidImportance } from '@notifee/react-native';

export async function displayPermanentNotification(channel_id, channel_name, notif_id, notif_title, notif_body) {
	await notifee.requestPermission();

	await notifee.createChannel({
    	id: channel_id,
    	name: channel_name,
    	importance: AndroidImportance.HIGH,
  	});

  	await notifee.displayNotification({
		id: notif_id,
		title: notif_title,
		body: notif_body,
		android: {
			channelId: channel_id,
			importance: AndroidImportance.HIGH,
			ongoing: true,
		},
  	});
}

export async function displayClickableNotification(channel_id, channel_name, notif_id, notif_title, notif_body) {
	await notifee.requestPermission();

	await notifee.createChannel({
		id: channel_id,
		name: channel_name,
		importance: AndroidImportance.HIGH,
  	});

	await notifee.displayNotification({
		id: notif_id,
		title: notif_title,
		body: notif_body,
		android: {
			channelId: channel_id,
			importance: AndroidImportance.HIGH,
			autoCancel: true,
		},
	});
}

export async function removeNotification(notif_id) {
	await notifee.cancelNotification(notif_id);
}
