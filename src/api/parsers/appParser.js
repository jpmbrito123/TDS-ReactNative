export default function parseAppAPI(data) {
  
    const appData = data[0];
    console.log("#> number of app data: " + data.length);

    /** app info */
    const appInfo = {
        app_name: appData.app_name,
        app_desc: appData.app_desc,
        app_landing_page_text: appData.app_landing_page_text,
    };

    /** socials info */
    const socialsInfo = [];
    for (const s of appData.socials) {
        
        const social = {
            social_name: s.social_name,
            social_url: s.social_url,
            social_share_link: s.social_share_link, 
        };
        socialsInfo.push(social);
    }

    /** contacts info */
    const contactsInfo = [];
    for (const c of appData.contacts) {
        
        const contact = {
            contact_name: c.contact_name,
            contact_phone: c.contact_phone,
            contact_url: c.contact_url,
            contact_mail: c.contact_mail,
            contact_desc: c.contact_desc,
        };
        contactsInfo.push(contact);
    }

    /** app partners */
    const partnersInfo = [];
    for (const p of appData.partners) {
        
        const partner = {
            partner_name: p.partner_name,
            partner_phone: p.partner_phone,
            partner_url: p.partner_url,
            partner_mail: p.partner_mail,
            partner_desc: p.partner_desc,
        };
        partnersInfo.push(partner);
    }

    /** final info */
    appAPI = {
        app: appInfo,
        socials: socialsInfo,
        contacts: contactsInfo,
        partners: partnersInfo,
    }

    return appAPI;
}
