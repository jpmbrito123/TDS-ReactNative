/*
CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    password TEXT NOT NULL,
    is_staff TEXT,
    date_joined TEXT);
*/

export const insertUser = (db, username, password) => {

    return new Promise((resolve, reject) => {

        const query = `
            REPLACE INTO users (username, password) 
            VALUES (?, ?);
        `;
        const params = [username, password];

        db.executeSql(query, params, (result) => {

            resolve(result);
        }, (error => {
            console.log("[user] [insertUser] : error, ", error);
            reject(error);
        }));
    });
};


export const fetchUser = (db, username) => {

    return new Promise((resolve, reject) => {

        const query = 'SELECT * FROM users WHERE username = ?;'
        db.executeSql(query, [username], (result) => {

            const rows = result.rows;
            //console.log("fetchuser:", rows.item(0));
            resolve(rows.item(0));
        },
        (error) => {
            console.log("[user] [fetchUser] : error, ", error);
            reject(error);
        });
    });
};


export const updateUser = (db, user) => {

    return new Promise((resolve, reject) => {

        console.log(user);

        const { username, first_name, last_name, email, is_staff, user_type, date_joined } = user;
        const query = `UPDATE USERS  
            SET first_name = ?, last_name = ?, email = ?, is_staff = ?, user_type = ?, date_joined = ? 
            WHERE username = ?;`;
        
        const params = [first_name, last_name, email, is_staff, user_type, date_joined, username, ];

        db.executeSql(query, params, (result) => {
            resolve(result);
        }, (error) => {
            console.log('[user] [updateUser] error:, ', error);
            reject(error);
        })
    })

}