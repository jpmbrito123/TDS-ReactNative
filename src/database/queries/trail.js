
export const insertTrails = (db, trail_data) => {
    return new Promise((resolve, reject) => {
        for (const trail of trail_data) {

            const placeholders = trail_data.map(trail => '(?, ?, ?, ?, ?, ?)').join(', ');
            const values = trail_data.flatMap(trail => [
                trail.trail_id, 
                trail.trail_img, 
                trail.trail_name, 
                trail.trail_desc, 
                trail.trail_duration, 
                trail.trail_difficulty
            ]);
            const query = `INSERT OR REPLACE INTO trail (trail_id, trail_img, trail_name, trail_desc, trail_duration, trail_difficulty) 
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

export const fetchTrails = (db) => {
    return new Promise((resolve, reject) => {
        db.executeSql('SELECT * FROM trail', [], (result) => {
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

export const fetchTrailById = (db, trail_id) => {
    return new Promise((resolve, reject) => {
        db.executeSql('SELECT * FROM trail WHERE trail_id = ?', [trail_id], (result) => {
            resolve(result.rows.item(0));
        },
        (error) => {
            reject(error);
        });
    });
}