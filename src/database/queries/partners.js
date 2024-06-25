export const insertPartners = (db, partners) => {
    return new Promise((resolve, reject) => {
        const placeholders = partners.map(() => '(?, ?, ?, ?, ?)').join(', ');
        const params = partners.flatMap((partner) => [
            partner.partner_name,
            partner.partner_phone,
            partner.partner_url,
            partner.partner_mail,
            partner.partner_desc
        ]);
        const query = `REPLACE INTO partners (partner_name, partner_phone, partner_url, partner_mail, partner_desc) 
        VALUES ${placeholders}`;
        db.transaction((tx) => {
            tx.executeSql(query, params, (tx, result) => {
                console.log("Partners inserted successfully");
                resolve(result);
            }, (error) => {
                console.error("Error inserting partners:", error);
                reject(error);
            });
        });
    });
};

export const fetchPartners = (db) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM partners;';
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                const rows = results.rows;
                const partners = [];
                for (let i = 0; i < rows.length; i++) {
                    partners.push(rows.item(i));
                }
                // console.log("Fetched partners:", partners);
                resolve(partners);
            }, (error) => {
                console.error("Error fetching partners:", error);
                reject(error);
            });
        });
    });
};

