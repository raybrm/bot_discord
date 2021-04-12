require('dotenv').config() // permet d'utiliser les varaibles d'environnement dans le fichier .env
const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs')

const mongo = require('./mongo')
const levels = require('./levels')

const token = process.env.token;

const client = new Discord.Client();

client.login(token);

client.commands = new Discord.Collection(); // stock toutes les commandes : {run: xx, name : 'xx'}

// Lire tous les fichiers js. Un fichier correspond à une commande. ex => !play, !kick, !info, !lvl, ...

fs.readdir('./commands', (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        if (!file.endsWith('js')) return;
        const command = require(`./commands/${file}`) // import le fichier
        client.commands.set(command.name, command)
    })
})

// au lancement du bot discord
client.on('ready', async () => { // 'on' permet d'écouter un évenement; ici l'évenement c'est ready
    console.log(`Logged in as ${client.user.tag}!`);

    await mongo().then(() => console.log("connected to db"))
                 .catch((err) => console.log("Unable to connect to db", err))

    levels(client)
});

// listener au niveau de l'evenement message quand un message apparait dans le chat.
client.on('message', message => {

    
    if (message.type !== 'DEFAULT' || message.author.bot) return;

    console.log(message.author.discriminator)
    // if (message.author.discriminator === '8331') { // Syna number

    //     message.reply("Le fils de Dominique a parlé")
    // };
    
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLocaleLowerCase()

    if (!commandName.startsWith(config.prefix)) return; // different du préfixe.

    const command = client.commands.get(commandName.slice(config.prefix.length)) // récupère la commande

    if (!command) return;
    command.run(message, args, client);
})

// Listener sur l'arrivé de membre
client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member} a rejoint le serveur. Nous sommes ${member.guild.memberCount} désormais`)
    member.roles.add(config.greeting.role)
})

// Listener sur la suppresion de membre 
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member.user.tag} a quitté le serveur...`)
})

// rajouter les membres à chaque fois qu'il parle pour la première fois (voir s'il existe)