/*
CREATE TABLE IF NOT EXISTS pin(
            pin_id INTEGER NOT NULL PRIMARY KEY,
            pin_name TEXT NOT NULL,
            pin_desc TEXT NOT NULL DEFAULT '',
            pin_latitude REAL NOT NULL DEFAULT 0.0,
            pin_longitude REAL NOT NULL DEFAULT 0.0,
            pin_altitude READ NOT NULL DEFAULT 0.0
        );
*/

export async function insertPin(db, pin) {
    const query = `
        REPLACE INTO pin (pin_id, pin_name, pin_desc, pin_latitude, pin_longitude, pin_altitude)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const { pin_id, pin_name, pin_desc, pin_latitude, pin_longitude, pin_altitude } = pin;
    return db.executeSql(query, [pin_id, pin_name, pin_desc, pin_latitude, pin_longitude, pin_altitude]);
}

export const insertPins = (db, pin_data) => {
    return new Promise((resolve, reject) => {
        for (const pin of pin_data) {

            const placeholders = pin_data.map(pin => '(?, ?, ?, ?, ?, ?)').join(', ');
            const values = pin_data.flatMap(pin => [
                pin.pin_id,
                pin.pin_name,
                pin.pin_desc,
                pin.pin_latitude,
                pin.pin_longitude,
                pin.pin_altitude
            ]);
            const query = `INSERT OR REPLACE INTO pin (pin_id, pin_name, pin_desc, pin_latitude, pin_longitude, pin_altitude) 
            VALUES ${placeholders}`;

            db.executeSql(query, values, (result) => {
                resolve(result);
            },
            (error) => {
                reject(error);
            });
        }
    });
}

export const fetchPins = (db) => {
    return new Promise((resolve, reject) => {
        db.executeSql('SELECT * FROM pin', [], (result) => {
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
}


export const fetchPinById = (db, pin_id) => {
    return new Promise((resolve, reject) => {
        db.executeSql('SELECT * FROM pin WHERE pin_id = ?', [pin_id], (result) => {
            resolve(result.rows.item(0));
        },
        (error) => {
            reject(error);
        });
    });
}

export const fetchPinsCoords = (db) => {
    return new Promise((resolve, reject) => {

        const query = `SELECT pin_id, pin_name, pin_latitude, pin_longitude FROM pins;`
        db.executeSql(query, [], (result) => {
            const rows = result.rows;
            const data = [];
            for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
            resolve(data);
        }),
        (error) => {
            console.log("[pins_db] [fetchPinsCoords] : error, ", error);
            reject(error);
        }
    })
}


