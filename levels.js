const mongo = require('./mongo')
const memberSchema = require('./models/member')
const member = require('./models/member')

//https://www.pierre-giraud.com/javascript-apprendre-coder-cours/introduction-asynchrone/
module.exports = (client) => {
    client.on('message', message => { // a chaque message écrit
        const { guild, member} = message

        addXP(guild.id, member.id, 23, message) 
    })
}

const getNeededXp = level => level * level * 100 // au niveau tu as besoin de 100 xp pour passé au prochain niv; lvl 2 => 200 etc...

// appel asynchrone pour ne pas bloquer le thread lors de l'appel à la db
// dans le cas où ça sera long
const addXP = async (guildId, userId, xpToAdd, message) => {
    await mongo().then(async mongoose => { 
        member.findOneAndUpdate(  // update ou rajoute s'il n'existe pas 
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
            let { xp, level } = memberUpdated
            const needed = getNeededXp(level)

            // 1 = 100
            // 80 (+25) -> 105
            //level = 2
            // 105 -= needed (100) 
            if (xp >= needed) { // 
                ++level
                xp -= needed

                message.reply(`Félicitation tu es maintenant level ${level} avec ${xp} expérience`)
                member.updateOne({ // attend le resultat grâce à await
                    guildId,
                    userId
                }, {
                    level,
                    xp
                })
            }
            mongoose.connection.close()
        })
   }) 
} 

module.exports.addXP = addXP