const Discord = require('discord.js');
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
                       var embed = new Discord.MessageEmbed().setColor("#0099FF")
                                        .setTitle(`Tu es niveau ${level} avec ${xp} xp !`)
                       message.channel.send(embed)
                       //message.reply(`Voici ton niveau actuel ${level} avec ${xp} xp !`)
                   })
         })
}
