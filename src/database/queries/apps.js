/*
CREATE TABLE IF NOT EXISTS apps (
            app_id INTEGER PRIMARY KEY AUTOINCREMENT,
            app_name TEXT NOT NULL UNIQUE,
            app_desc TEXT,
            app_landing_page_text TEXT
          );
*/

export const createAppTable = (db) => {
    return new Promise((resolve, reject) => {

        const query = `
        CREATE TABLE IF NOT EXISTS apps (
            app_id INTEGER PRIMARY KEY AUTOINCREMENT,
            app_name TEXT NOT NULL UNIQUE,
            app_desc TEXT,
            app_landing_page_text TEXT
          );`;
        db.executeSql(
            query, [], (result) => {
                
                resolve(result);
            }, (error => {
                reject(error);
            })
        );
    });
}

export const insertApp = (db, app) => {

    return new Promise((resolve, reject) => {

        const {app_name, app_desc, app_landing_page_text } = app;
        const query = `
        REPLACE INTO apps (app_id, app_name, app_desc, app_landing_page_text) 
        VALUES (?, ?, ?, ?);`;
        const params = [0, app_name, app_desc, app_landing_page_text];
        db.executeSql(query, params, (result) => {
                const inserted = result.appid;
                resolve(inserted);
            }, (error => {
                reject(error);
            })
        );
    });
}


export const getAppInfo = (db) => {
    return new Promise((resolve, reject) => {

        const query = `SELECT * FROM apps;`;
        db.executeSql(query, [], (result) => {
            
            const rows = result.rows;
            //console.log('saw ', rows.item(0));
            resolve(rows.item(0));
        }, (error) => {
            reject(error);
        });
    });
}