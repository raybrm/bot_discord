const mongo = require('./mongo')
const memberSchema = require('./models/member')
const member = require('./models/member')

//https://www.pierre-giraud.com/javascript-apprendre-coder-cours/introduction-asynchrone/
module.exports = (client) => {
    client.on('message', message => {
        const { guild, member} = message

        addXP(guild.id, member.id, 23) 
    })
}

const addXP = (guildId, userId, xpToAdd) => {
    mongo().then(mongoose => {
        const result =  member.findOneAndUpdate(  // update ou rajoute s'il n'existe pas 
        {
            guildId,
            userId
        }, {
            guildId,
            userId,
            $inc: {
                xp: xpToAdd
            }
        }, {
            upsert: true,
            new: true
        }).then(memberUpdated => {
            console.log(memberUpdated)
            console.log("Resultat", result)
            mongoose.connection.close()}
            )
   }) 
} 

module.exports.addXP = addXP