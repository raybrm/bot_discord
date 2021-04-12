const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs')

const client = new Discord.Client();

client.login(config.token);

client.commands = new Discord.Collection(); // stocke toutes les commandes : {run: xx, name : 'xx'}

// Lire tous les fichiers js. Un fichier correspond à une commande. ex => !play, !kick, !info, !lvl, ...

fs.readdir('./commands', (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        if (!file.endsWith('js')) return;
        const command = require(`./commands/${file}`) // import le fichier
        client.commands.set(command.name, command)
    })
})

// au lancement du node index.js
client.on('ready', () => { // 'on' permet d'écouter un évenement; ici l'évenement c'est ready
    console.log(`Logged in as ${client.user.tag}!`);
});

// listener au niveau de l'evenement message quand un message apparait dans le chat.
client.on('message', message => {

    
    if (message.type !== 'DEFAULT' || message.author.bot) {
        console.log('not a command')
        return;
    }

    console.log(message.author.discriminator)
    if (message.author.discriminator === '9819') {

        message.reply("dominique")
    };
    
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLocaleLowerCase()

    if (!commandName.startsWith(config.prefix)) return; // different du préfixe.

    const command = client.commands.get(commandName.slice(config.prefix.length)) // récupère la commande

    if (!command) return;
    command.run(message, args, client);
})

// Listener sur l'arrivé de membre
client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member} a rejoint le serveur. Nous ${member.guild.memberCount}`)
    member.roles.add(config.greeting.role)
})

// Listener sur la suppresion de membre 
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member.user.tag} a quitté le serveur...`)
})