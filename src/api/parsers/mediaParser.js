export default function parseMediaAPI(base_url, data) {
    
    console.log("#> number of media data: " + data.length);

    /** medias info */
    const medias = [];

    for (const m of data) {

        const media = {
            media_id: m.id,
            media_file: base_url + m.media_file,
            media_type: m.media_type,
            media_pin: m.media_pin,
        }
        medias.push(media);
    }

    return medias;
}
