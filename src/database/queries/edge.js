export const insertEdges = (db, edge_data) => {
    return new Promise((resolve, reject) => {
        for (const edge of edge_data) {

            const placeholders = edge_data.map(edge => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
            const values = edge_data.flatMap(edge => [
                edge.edge_id,
                edge.edge_transport,
                edge.edge_duration,
                edge.edge_desc,
                edge.trail_id,
                edge.edge_start,
                edge.edge_end
            ]);
            const query = `INSERT OR REPLACE INTO edge (edge_id, edge_transport, edge_duration, edge_desc, trail_id, edge_start, edge_end) 
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

export const fetchEdgesByTrailId = (db, trail_id) => {
    return new Promise((resolve, reject) => {
        db.executeSql(`
            SELECT 
                edge.*, 
                start_pin.pin_name AS start_pin_name,
                start_pin.pin_latitude AS start_pin_latitude,
                start_pin.pin_longitude AS start_pin_longitude,
                end_pin.pin_name AS end_pin_name,
                end_pin.pin_latitude AS end_pin_latitude,
                end_pin.pin_longitude AS end_pin_longitude
            FROM 
                edge 
            INNER JOIN 
                pin AS start_pin ON edge.edge_start = start_pin.pin_id 
            INNER JOIN 
                pin AS end_pin ON edge.edge_end = end_pin.pin_id 
            WHERE 
                edge.trail_id = ? 
            ORDER BY 
                edge.edge_id`, [trail_id], (result) => {
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
