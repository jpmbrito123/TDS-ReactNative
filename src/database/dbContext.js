import { createContext, useContext, useEffect, useState } from 'react';
import { connectToDb, createTables, getTableCount } from './database';

const DbContext = createContext();

export const useDbContext = () => {
    return useContext(DbContext);
}

export function DbContextProvider({ children }) {
    const [db, setDb] = useState(null);

    useEffect(() => {
        let dbCon = null;
        async function getDbConnection() {
            dbCon = await connectToDb();
            const tableCount = await getTableCount(dbCon);
            console.log('[DbContext] Number of tables:', tableCount);
            if (tableCount === 0) {
                await createTables(dbCon);
            }
            else {
                console.log('[DbContext] Tables already created!');
            }
            setDb(dbCon);
        }

        getDbConnection();
        return function closeDb () {
            if (dbCon !== null) {
                dbCon.close();
            }
        }
    }, []);

    return <DbContext.Provider value={db}>{children}</DbContext.Provider>
}