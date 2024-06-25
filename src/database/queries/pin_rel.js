/*
CREATE TABLE IF NOT EXISTS rel_pin (
    rel_pin_id INTEGER PRIMARY KEY,
    rel_pin_attrib TEXT,
    rel_pin_value TEXT,
    pin_id INTEGER,
    FOREIGN KEY (pin_id) REFERENCES pin(pin_id)
);*/

export const insertPinRels = (db, relTrails) => {

    return new Promise((resolve, reject) => {

        const placeholders = relTrails.map(() => '(?, ?, ?, ?)').join(', ');
        const params = relTrails.flatMap((relPin) => [
            relPin.rel_pin_id,
            relPin.rel_pin_attrib,
            relPin.rel_pin_value,
            relPin.pin_id
        ]);
        const query = `REPLACE INTO rel_pin (rel_pin_id, rel_pin_attrib, rel_pin_value, pin_id ) 
        VALUES ${placeholders};`;
        
        db.executeSql(query, params, (result) => {
            resolve(result);
        }, (error) => {
            console.log("[pin_rel_db] [insertPinRels] : error, ", error);
            reject(error);
        });
    });
};

export const getPinRels = (db, pin_id) => {
    return new Promise((resolve, reject) => {

        const query = 'SELECT * FROM rel_pin WHERE pin_id = ?;'

        db.executeSql(query, [pin_id], (result) => {

            const rows = result.rows;
            const rels = [];

            for (let i = 0; i < rows.length; i++) {
                rels.push(rows.item(i)); 
            }
            resolve(rels);
        },
        (error) => {
            console.log("[pin_rel_db] [getPinRels] : error, ", error);
            reject(error);
        });
    });
};