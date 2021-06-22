const { client } = require('../index.js');
const { retrieveMutes } = require('../resources/database-query-helper');
const { getGuildMemberByNameOrID, sleep } = require('../resources/helper-functions.js');


client.once('ready', () => {
    console.log('The Great! The Powerful! Zote the Mighty, has arrived!');
    client.user.setActivity("And I looked, and behold a pale stag: and his name that sat on him was Zote, and bans followed with him");

    resumeMutes().then(() => { console.log('[client-ready-handler.js] Resuming mutes') }).catch((err) => { console.error("[client-ready-handler.js] Unable to resume mutes ", err) });
});


//Resume Mutes
async function resumeMutes() {
    //this will later account for multiple servers if needed, so well have to do this check for each servers for scalability
    const guild = client.guilds.cache.get('837505202398953493');
    const mutes = await retrieveMutes();
    const role = guild.roles.cache.find(role => role.name === 'Muted');

    console.log("[client-ready-handler.js] LIST OF MUTES ", mutes);
    //console.log(mutes);
    if (!mutes) return;

    async function removeMute(remainingMuteTime, guildMember, userID) {
        try {
            await sleep(remainingMuteTime);
            guildMember.roles.remove(role);
            delete mutes[userID]; //removes the mute from the global mute var
        }
        catch (err) {
            console.log(err);
        }
    };

    //Uses the GuildMember id as the key with the mute function as the value
    mutes.forEach(async (row) => {
        
        let rowString = JSON.stringify(row);
        let rowJson = JSON.parse(rowString);
        //console.log("[client-ready-handler.js] ROW ID IS ", rowJson.user_id);
        let guildMember = await getGuildMemberByNameOrID(rowJson.user_id, guild);
        //console.log(guildMember);
        if (!guildMember) {
            console.error("[client-ready-handler.js] unable to set remove mute command to specified user, most likely an inproper input was supplied");
        }
        else{
            client.mutes[row.user_id] = removeMute(row.mute_end - Date.now(), guildMember, row.user_id);
        }
    });
    
}