import moment from "moment";

export const insertHistoryTrail = (db, username, trail_id) => {
    return new Promise((resolve, reject) => {
        const now = moment().format('YYYY-MM-DD');
        const values = [username, trail_id, now];
        const query = `
                INSERT INTO history_trail (username, trail_id, date) 
                VALUES (?, ?, ?)
            `;

        db.executeSql(
            query,
            values,
            (_, result) => resolve(result),
            (error) => reject(error)
        );
    });
}

export const updateHistoryTrail_Started = (db, username, trail_id) => {
    return new Promise((resolve, reject) => {
        const now = moment().format('YYYY-MM-DD');
        const now_datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        const values = [now_datetime, username, trail_id, now];
        const query = `
                UPDATE history_trail
                SET started = 1, started_date = ?
                WHERE username = ? AND trail_id = ? AND date = ?
            `;

        db.executeSql(
            query,
            values,
            (_, result) => resolve(result),
            (_, error) => reject(error)
        );
    });
}

export const updateHistoryTrail_Finished = (db, username, trail_id) => {
    return new Promise((resolve, reject) => {
        const now_datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        const values = [now_datetime, username, trail_id, now];
        const query = `
                UPDATE history_trail
                SET finished = 1, finished_date = ?
                WHERE username = ? AND trail_id = ? AND started = 1
            `;

        db.executeSql(
            query,
            values,
            (_, result) => resolve(result),
            (_, error) => reject(error)
        );
    });
}

export const updateHistoryTrail_Aborted = (db, username, trail_id) => {
    return new Promise((resolve, reject) => {
        const now_datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        const values = [now_datetime, username, trail_id, now];
        const query = `
                UPDATE history_trail
                SET finished_date = ?
                WHERE username = ? AND trail_id = ? AND started = 1
            `;

        db.executeSql(
            query,
            values,
            (_, result) => resolve(result),
            (_, error) => reject(error)
        );
    });
}


export const fetchAllHistoryTrails = (db) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            db.executeSql('SELECT * FROM history_trail', [], (result) => {
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

export const fetchHistoryTrailByUsername = (db, username) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT history_trail.id, trail_name, date, started_date, finished_date
            FROM history_trail
            INNER JOIN trail on trail.trail_id = history_trail.trail_id
            WHERE username = ?
            `
        db.transaction(tx => {
            db.executeSql(
                query,
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

export const fetchHistoryTrailByUsernameDate = (db, username, date) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            db.executeSql(
                'SELECT trail_id FROM history_trail WHERE username = ? AND date = ?',
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