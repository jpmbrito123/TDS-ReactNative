export const insertRelTrails = (db, rel_trail_data) => {
    return new Promise((resolve, reject) => {
        for (const rel_trail of rel_trail_data) {

            const placeholders = rel_trail_data.map(rel_trail => '(?, ?, ?, ?)').join(', ');
            const values = rel_trail_data.flatMap(relTrail => [
                rel_trail.rel_trail_id, 
                rel_trail.rel_trail_attrib, 
                rel_trail.rel_trail_value, 
                rel_trail.trail_id
            ]);
            const query = `INSERT OR REPLACE INTO rel_trail (rel_trail_id, rel_trail_attrib, rel_trail_value, trail_id) 
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

export const fetchRelTrailsByTrailId = (db, trailId) => {
    return new Promise((resolve, reject) => {
        db.executeSql('SELECT * FROM rel_trail WHERE trail_id = ?', [trailId], (result) => {
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
