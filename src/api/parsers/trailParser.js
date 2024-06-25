export default function parseTrails(data) {
    /* console.log("Number of trails: " + data.length); */

    const trails = [], rel_trails = [], edges = [], pins = [], rel_pins = [];

    for (trail_data of data) {
        const new_trail = {
            trail_id: trail_data.id,
            trail_img: trail_data.trail_img.replace(/http:/, "https:"),
            trail_name: trail_data.trail_name,
            trail_desc: trail_data.trail_desc,
            trail_duration: trail_data.trail_duration,
            trail_difficulty: trail_data.trail_difficulty,
        }
        trails.push(new_trail);

        /*
        for (const new_trail of trails) {
            console.log("Trail id: " + new_trail.trail_id 
            + "\n      Trail image: " + new_trail.trail_img
            + "\n      Trail name: " + new_trail.trail_name
            // + "\n      Trail desc: " + new_trail.trail_desc
            + "\n      Trail duration: " + new_trail.trail_duration
            + "\n      Trail difficulty: " + new_trail.trail_difficulty);
        }
        */

        const related_to_trail = trail_data.rel_trail;
        for (const rt of related_to_trail) {
            /*
            console.log("Related trail id: " + rt.id
                + "\n      Related trail value: " + rt.value
                + "\n      Related trail attrib: " + rt.attrib
                + "\n      Related trail: " + rt.trail);
            */
            const new_rel_trail = {
                rel_trail_id: rt.id,
                rel_trail_value: rt.value,
                rel_trail_attrib: rt.attrib,
                trail_id: rt.trail,
            }
            rel_trails.push(new_rel_trail);
        }

        const trail_edges = trail_data.edges;
        for (const e of trail_edges) {
            /*
            console.log("Edge id: " + e.id
                + "\n      Edge start pin: " + e.edge_start
                + "\n      Edge end pin: " + e.edge_end
                + "\n      Edge transport: " + e.edge_transport
                + "\n      Edge duration: " + e.edge_duration
                + "\n      Edge desc: " + e.edge_desc
                + "\n      Edge trail: " + e.edge_trail);
            */
            const new_edge = {
                edge_id: e.id,
                edge_transport: e.edge_transport,
                edge_duration: e.edge_duration,
                edge_desc: e.edge_desc,
                trail_id: e.edge_trail,
            }

            const edge_start = e.edge_start;
            pins.push({
                pin_id: edge_start.id,
                pin_name:  edge_start.pin_name,
                pin_desc: edge_start.pin_desc,
                pin_latitude: edge_start.pin_lat,
                pin_longitude: edge_start.pin_lng,
                pin_altitude: edge_start.pin_alt,
            });
            new_edge.edge_start = edge_start.id;

            const rel_to_edge_start = edge_start.rel_pin;
            for (const res of rel_to_edge_start) {
                rel_pins.push({
                    rel_pin_id: res.id,
                    rel_pin_value: res.value,
                    rel_pin_attrib: res.attrib,
                    pin_id: res.pin,
                })
            }

            const edge_end = e.edge_end;
            pins.push({
                pin_id: edge_end.id,
                pin_name:  edge_end.pin_name,
                pin_desc: edge_end.pin_desc,
                pin_latitude: edge_end.pin_lat,
                pin_longitude: edge_end.pin_lng,
                pin_altitude: edge_end.pin_alt,
            });
            new_edge.edge_end = edge_end.id;

            const rel_to_edge_end = edge_end.rel_pin;
            for (const ree of rel_to_edge_end) {
                rel_pins.push({
                    rel_pin_id: ree.id,
                    rel_pin_value: ree.value,
                    rel_pin_attrib: ree.attrib,
                    pin_id: ree.pin,
                })
            }

            edges.push(new_edge);
        }
    }

    const parsedTrails = {
        trails: trails,
        rel_trails: rel_trails,
        edges: edges,
        pins: pins,
        rel_pins: rel_pins,
    }

    /* console.log(parsedTrails); */

    return parsedTrails;
}