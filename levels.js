const mongo = require('./mongo')
const member = require('./models/member')
const config = require('./config.json');

//https://www.pierre-giraud.com/javascript-apprendre-coder-cours/introduction-asynchrone/
module.exports = (client) => {
    client.on('message', message => { // a chaque message écrit
        const { guild, member} = message

        if (message.author.bot) return;
        
        addXP(guild.id, member.id, 23, message) 
    })
}

const getNeededXp = level => level * 100 // au niveau tu as besoin de 100 xp pour passé au prochain niv; lvl 2 => 200 etc...

const setRole = (level, member) => {// donner le role en fonction du level
    switch (level) {
        case 5:
            console.log('reach level 5')
            member.roles.add(config.roles.level_5)
            break
        case 10:
            break   
    }
}

const addXP = (guildId, userId, xpToAdd, message) => {
     mongo().then( mongoose => { member.findOneAndUpdate
        (  // update ou rajoute s'il n'existe pas 
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
            }
        ).then(async memberUpdated => {
            console.log(memberUpdated)
            let { xp, level } = memberUpdated
            const needed = getNeededXp(level)
            // lvl 1 = 100 xp
            // 80 (+25) -> 105
            //level = 2
            // 105 -= needed (100) 
            if (xp >= needed) { // 
                ++level
                xp -= needed

                message.reply(`Félicitation tu es maintenant level ${level} avec ${xp} expérience ! Tu as besoin de 
                ${getNeededXp(level)} Xp pour atteindre le prochain niveau !`)
                
                setRole(level, message.member)

               await member.updateOne({ // update le level --> obliger d'attendre sinon la connexion se ferme
                    guildId,
                    userId
                }, {
                    level,
                    xp
                })
            }
            mongoose.connection.close().then(() => console.log('connexion closed'))
        })
   }) 
} 

module.exports.addXP = addXP