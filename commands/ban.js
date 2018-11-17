const Discord = require('discord.js');
const client = new Discord.Client();

exports.run = async (client, message, args) => {

    if(message.channel.type == 'dm') return message.channel.send('`Not a right place to use this command`')
    
    if(!message.member.roles.some(r=>["Dev", "Admin"].includes(r.name)) )
    return message.channel.send(`**${message.author.username}:** `+ "Sorry, you don't have the role to use this! \nMissing **Admin** or **Administrator** role. Please create them and try again.");

    let member = message.mentions.members.first();
    let botcmd = message.guild.channels.find(ch => ch.name === "bot-spam");
    if (!botcmd) return message.channel.send('Could not found **#bot-spam** channel. Please create it and try again.')

    if(!member)
    return message.channel.send(`**${message.author.username}**: `+ "Please mention a valid member of this server");

    if(!member.bannable) 
    return message.channel.send(`**${message.author.username}**: `+ "I cannot ban this user: `Missing Permission or Role Order`");

    let reason = args.slice(1).join(' ');

    if(!reason) reason = "No reason provided";

    await member.ban(reason)
    .catch(error => message.channel.send(`**${message.author.username}**: `+ `Sorry, I couldn't ban because of : ${error}`));

    const embed = new Discord.RichEmbed()
    
    .setColor("#f32d11")
    .setTimestamp()
    .setDescription(`\`❯ USER BANNED \n• ${member.user.username} has been banned by ${message.author.username} \n• Reason : ${reason}\``)

    client.channels.get(botcmd.id).send({embed});
}
