export const insertSocials = (db, socials) => {
    return new Promise((resolve, reject) => {
        const placeholders = socials.map(() => '(?, ?, ?)').join(', ');
        const params = socials.flatMap((social) => [
            social.social_name,
            social.social_url,
            social.social_share_link
        ]);
        const query = `REPLACE INTO socials (social_name, social_url, social_share_link) 
        VALUES ${placeholders}`;
        db.transaction((tx) => {
            tx.executeSql(query, params, (tx, result) => {
                console.log("Socials inserted successfully");
                resolve(result);
            }, (error) => {
                console.error("Error inserting socials:", error);
                reject(error);
            });
        });
    });
};

export const fetchSocials = (db) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM socials;';
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                const rows = results.rows;
                const socials = [];
                for (let i = 0; i < rows.length; i++) {
                    socials.push(rows.item(i));
                }
                // console.log("Fetched socials:", socials);
                resolve(socials);
            }, (error) => {
                console.error("Error fetching socials:", error);
                reject(error);
            });
        });
    });
};
