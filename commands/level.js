const mongo = require('../mongo')
const member = require("../models/member");

module.exports = { // on export un objet qui contient une fonction et un nom
    run : (message, args, client) => {
        const { guild, member} = message
        getLevel(guild.id, member.id, message)
    },
    name: 'lvl'
};


const getLevel = (guildId, userId, message) => {
    mongo().then(() => {
             member.findOne({guildId, userId})
                   .then(result => {
                       const { xp, level } = result
                       message.reply(`Voici ton niveau actuel ${level} avec ${xp} xp !`)
                   })
         })
}
