export const insertMedias = (db, medias) => {

    return new Promise((resolve, reject) => {

        const placeholders = medias.map(() => '(?, ?, ?, ?)').join(', ');
        const params = medias.flatMap((media) => [
            media.media_id,
            media.media_file,
            media.media_type,
            media.media_pin
        ]);
        const query = `REPLACE INTO medias (media_id, media_file, media_type, media_pin) 
        VALUES ${placeholders};`;
        
        db.executeSql(query, params, (result) => {

            resolve(result);
        }, (error) => {
            console.log("[medias] [insertMedias] : error, ", error);
            reject(error);
        });
    });
};

export const insertMedia = (db, media) => {

    return new Promise((resolve, reject) => {

        const { media_id, media_file, media_type, media_pin } = media;        
        const query = `
            REPLACE INTO medias (media_id, media_file, media_type, media_pin) 
            VALUES (?, ?, ?, ?)
        `;
        const params = [media_id, media_file, media_type, media_pin];

        db.executeSql(query, params, (result) => {

            const inserted = result.insertId;
            resolve(inserted);
        }, (error => {
            console.log("[medias] [insertMedia] : error, ", error);
            reject(error);
        }));
    });
};


export const getMedias = (db) => {
    return new Promise((resolve, reject) => {

        const query = 'SELECT * FROM medias;'

        db.executeSQL(query, [], (result) => {

            const rows = result.rows;
            const medias = [];

            for (let i = 0; i < rows.length; i++) {
                medias.push(rows.item(i)); 
            }
            resolve(medias);
        },
        (error) => {
            console.log("[medias] [getMedias] : error, ", error);
            reject(error);
        });
    });
};

export const fetchTrailMedias = (db, trail_id) => {
    return new Promise((resolve, reject) => {

        const query = `
            SELECT DISTINCT medias.* FROM medias 
            JOIN edge ON medias.media_pin = edge_start OR medias.media_pin = edge_end 
            WHERE trail_id = ${trail_id};
        `;

        db.executeSql(query, [], (result) => {
            
            const rows = result.rows;
            const medias = [];
            for (let i = 0; i < rows.length; i++) {
                medias.push(rows.item(i)); 
            }
            resolve(medias);
        },
        (error) => {
            console.log("[medias] [getTrailMedias] : error, ", error);
            reject(error);
        });
    });
};


export const fetchPinMedias = (db, pin_id) => {

    return new Promise((resolve, reject) => {

        const query = `SELECT * FROM medias WHERE media_pin = ?`;
        db.executeSql(query, [pin_id], (result) => {

        const rows = result.rows;
            const medias = [];
            for (let i = 0; i < rows.length; i++) {
                medias.push(rows.item(i)); 
            }
            resolve(medias);
        },
        (error) => {
            console.log("[medias] [getPinMedias] : error, ", error);
            reject(error);
        });
    });
};