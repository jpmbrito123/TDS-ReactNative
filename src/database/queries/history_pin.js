import moment from "moment";

export const insertHistoryPin = (db, username, pin_id) => {
    return new Promise((resolve, reject) => {
        const now_datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        const values = [
            username,
            pin_id,
            now_datetime,
            username,
            pin_id,
            now_datetime
        ];
        const query = `
                INSERT INTO history_pin(username, pin_id, date_seen) 
                SELECT ?, ?, ?
                WHERE NOT EXISTS (
                    SELECT 1 FROM history_pin
                    WHERE username = ? AND pin_id = ? and DATE(date_seen) = DATE(?)
                )
            `;

        db.executeSql(
            query,
            values,
            (_, result) => resolve(result),
            (_, error) => reject(error)
        );
    });
}


export const fetchAllHistoryPins = (db) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            db.executeSql('SELECT * FROM history_pin', [], (result) => {
                const data = [];
                const rows = result.rows;

                for (let i = 0; i < rows.length; i++) {
                    data.push(rows.item(i));
                }

                resolve(data);
            },
                (error) => {
                    reject(error);
                });
        });
    });
}

export const fetchHistoryPinByUsername = (db, username) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            db.executeSql(
                `
                SELECT history_pin.id, pin_name, date_seen
                FROM history_pin
                INNER JOIN pin on pin.pin_id = history_pin.pin_id
                WHERE username = ?`,
                [username], (result) => {
                    const data = [];
                    const rows = result.rows;

                    for (let i = 0; i < rows.length; i++) {
                        data.push(rows.item(i));
                    }

                    resolve(data);
                },
                (error) => {
                    reject(error);
                });
        });
    });
}

export const fetchHistoryPinSeenByUsername = (db, username) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            db.executeSql(
                'SELECT pin_id FROM history_pin WHERE username = ?',
                [username, date], (result) => {
                    const data = [];
                    const rows = result.rows;

                    for (let i = 0; i < rows.length; i++) {
                        data.push(rows.item(i));
                    }

                    resolve(data);
                },
                (error) => {
                    reject(error);
                });
        });
    });
}