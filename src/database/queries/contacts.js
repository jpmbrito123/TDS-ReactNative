/*
CREATE TABLE IF NOT EXISTS contacts (
    contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_name TEXT NOT NULL,
    contact_phone TEXT UNIQUE NOT NULL,
    contact_url TEXT,
    contact_mail TEXT,
    contact_desc TEXT,
    FOREIGN KEY (app_id) REFERENCES apps (app_id)
);
*/

export const insertMedia = (db, contacts) => {
    return new Promise((resolve, reject) => {
        const { contact_id, contact_name, contact_phone, contact_url, contact_mail, contact_desc } = contacts;        
        const query = `
            REPLACE INTO contacts (contact_id, contact_name, contact_phone, contact_url, contact_mail, contact_desc) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [ contact_id, contact_name, contact_phone, contact_url, contact_mail, contact_desc ];
        db.executeSql(query, params, (result) => {
            const inserted = result.insertId;
            console.log("Inserted contact with ID:", inserted); // Log para verificar a inserção
            resolve(inserted);
        }, (error) => {
            console.error("Error inserting contact:", error); // Log de erro em caso de falha na inserção
            reject(error);
        });
    });
};

export const insertContacts = (db, contacts) => {
    return new Promise((resolve, reject) => {
        const placeholders = contacts.map(() => '(?, ?, ?, ?, ?)').join(', ');
        const params = contacts.flatMap((contact) => [
            contact.contact_name,
            contact.contact_phone,
            contact.contact_url,
            contact.contact_mail,
            contact.contact_desc
        ]);
        const query = `REPLACE INTO contacts (contact_name, contact_phone, contact_url, contact_mail, contact_desc) 
        VALUES ${placeholders}`;
        db.executeSql(query, params, (result) => {
            console.log("Contacts inserted successfully"); // Log para verificar a inserção bem-sucedida
            resolve(result);
        }, (error) => {
            console.error("Error inserting contacts:", error); // Log de erro em caso de falha na inserção
            reject(error);
        });
    });
};

export const fetchContacts = (db) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM contacts;';
        db.executeSql(query, [], (result) => {
            const rows = result.rows;
            const contacts = [];
            for (let i = 0; i < rows.length; i++) {
                contacts.push(rows.item(i));
            }
            // console.log("Fetched contacts:", contacts); // Log para verificar os contatos recuperados
            resolve(contacts);
        }, (error) => {
            console.error("Error fetching contacts:", error); // Log de erro em caso de falha na recuperação
            reject(error);
        });
    });
};
