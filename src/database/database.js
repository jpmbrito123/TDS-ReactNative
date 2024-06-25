import { enablePromise, openDatabase } from 'react-native-sqlite-storage';
enablePromise(true);

const dbName = "braguia.db";
const dbVersion = "0.4";

export async function connectToDb() {
    const db = await openDatabase({
        name: dbName,
        version: dbVersion
    },
        () => {
            console.log("[Database] Connected!");
        },
        (error) => {
            error => console.log("[Database] Error connecting - ", error)
        }
    );
    return db;
}

const tables = {
    users: `CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        first_name TEXT DEFAULT '',
        last_name TEXT DEFAULT '',
        email TEXT DEFAULT '',
        password TEXT NOT NULL,
        is_staff TEXT DEFAULT '',
        user_type TEXT DEFAULT '',
        date_joined TEXT DEFAULT '');` ,
    apps: `CREATE TABLE IF NOT EXISTS apps (
         app_id INTEGER PRIMARY KEY AUTOINCREMENT,
         app_name TEXT NOT NULL UNIQUE,
         app_desc TEXT,
         app_landing_page_text TEXT);`,
    contacts: `CREATE TABLE IF NOT EXISTS contacts (
            contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
            contact_name TEXT NOT NULL,
            contact_phone TEXT UNIQUE NOT NULL,
            contact_url TEXT,
            contact_mail TEXT,
            contact_desc TEXT);`,
    partners: `CREATE TABLE IF NOT EXISTS partners (
               partner_id INTEGER PRIMARY KEY AUTOINCREMENT,
               partner_name TEXT NOT NULL,
               partner_phone TEXT UNIQUE NOT NULL,
               partner_url TEXT,
               partner_mail TEXT,
               partner_desc TEXT);`,
    socials: `CREATE TABLE IF NOT EXISTS socials (
                social_id INTEGER PRIMARY KEY AUTOINCREMENT,
                social_name TEXT UNIQUE NOT NULL,
                social_url TEXT,
                social_share_link TEXT);`,
    trails: `CREATE TABLE IF NOT EXISTS trail(
        trail_id INTEGER NOT NULL PRIMARY KEY,
        trail_img TEXT NOT NULL DEFAULT '',
        trail_name TEXT NOT NULL,
        trail_desc TEXT NOT NULL DEFAULT '',
        trail_duration REAL,
        trail_difficulty TEXT DEFAULT ''
    );`,
    rel_trails: `CREATE TABLE IF NOT EXISTS rel_trail(
        rel_trail_id INTEGER NOT NULL PRIMARY KEY,
        rel_trail_attrib TEXT,
        rel_trail_value TEXT,
        trail_id INTEGER NOT NULL,
        FOREIGN KEY(trail_id) REFERENCES trail(trail_id)
    );`,
    pins: `CREATE TABLE IF NOT EXISTS pin(
        pin_id INTEGER NOT NULL PRIMARY KEY,
        pin_name TEXT NOT NULL,
        pin_desc TEXT NOT NULL DEFAULT '',
        pin_latitude REAL NOT NULL DEFAULT 0.0,
        pin_longitude REAL NOT NULL DEFAULT 0.0,
        pin_altitude REAL NOT NULL DEFAULT 0.0
    );`,
    edges: `CREATE TABLE IF NOT EXISTS edge(
        edge_id INTEGER NOT NULL PRIMARY KEY,
        edge_transport TEXT,
        edge_duration REAL,
        edge_desc TEXT,
        trail_id INTEGER NOT NULL,
        edge_start INTEGER NOT NULL,
        edge_end INTEGER NOT NULL,
        FOREIGN KEY(trail_id) REFERENCES trail(trail_id),
        FOREIGN KEY(edge_start) REFERENCES pin(pin_id),
        FOREIGN KEY(edge_end) REFERENCES pin(pin_id)
    );`,
    rel_pins: `CREATE TABLE IF NOT EXISTS rel_pin(
        rel_pin_id INTEGER NOT NULL PRIMARY KEY,
        rel_pin_attrib TEXT,
        rel_pin_value TEXT,
        pin_id INTEGER NOT NULL,
        FOREIGN KEY(pin_id) REFERENCES pin(pin_id)
    );`,
    medias: `CREATE TABLE IF NOT EXISTS medias(
        media_id INTEGER NOT NULL PRIMARY KEY,
        media_file TEXT NOT NULL,
        media_type TEXT NOT NULL,
        media_pin INTEGER NOT NULL,
        FOREIGN KEY (media_pin) REFERENCES pins(pin_id));`,
    history_trails: `CREATE TABLE IF NOT EXISTS history_trail(
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            trail_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            started INTEGER NOT NULL DEFAULT 0,
            started_date TEXT,
            finished INTEGER NOT NULL DEFAULT 0,
            finished_date TEXT,
            FOREIGN KEY(username) REFERENCES users(username),
            FOREIGN KEY(trail_id) REFERENCES trail(trail_id));`,
    history_pins: `CREATE TABLE IF NOT EXISTS history_pin(
                        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        pin_id INTEGER NOT NULL,                        
                        date_seen TEXT,
                        FOREIGN KEY(username) REFERENCES users(username),
                        FOREIGN KEY(pin_id) REFERENCES pin(pin_id));`,
}

export async function getTableCount(db) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'")
                .then(([tx, results]) => {
                    // console.log("[Database] Number of tables:", results.rows.length - 1);

                    /* 
                    for (let i=1; i<results.rows.length; i++) {
                        console.log("[Database] Table name:", results.rows.item(i).name);
                    }
                     */


                    resolve(results.rows.length - 1);
                })
                .catch((error) => {
                    console.log("[Database] Error executing SQL - ", error);
                    reject(error);
                });
        });
    });
}

export async function createTables(db) {
    const queries = [
        tables.users,
        tables.apps,
        tables.contacts,
        tables.partners,
        tables.socials,
        tables.trails,
        tables.rel_trails,
        tables.pins,
        tables.edges,
        tables.rel_pins,
        tables.medias,
        tables.history_trails,
        tables.history_pins
    ];

    try {
        await db.transaction((tx) => {
            queries.forEach((query) => tx.executeSql(query));
            console.log("[Database] Tables created!");
        });
    }
    catch (error) {
        console.log("[Database] Error creating tables - ", error);
    }
};

export async function initDatabase() {
    const db = await connectToDb();
    await createTables(db);
    await db.close();
};