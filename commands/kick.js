const Discord = require('discord.js');
exports.run = async (client, message, args) => {
  //message.delete(6000);

  if(message.channel.type == 'dm') return message.channel.send('`Not a right place to use this command`')

  if(!message.member.roles.some(r=>[client.config.mod_role.r1, client.config.mod_role.r2].includes(r.name)) ) {
    message.delete(5000);
    return message.channel.send(`${message.author.username} ` + `you don't have the role to use this, missing **${client.config.mod_role.r2}** role, please create them and try again.`).then(msg => {msg.delete(5000)});
  }

  let member = message.mentions.members.first() || message.guild.members.get(args[0]);
  let botcmd = message.guild.channels.find(ch => ch.name === client.config.logchannel.modlog_ch_id);
  if (!botcmd) return;

  if(!member)
  return message.channel.send(`${message.author.username}: ` + "Please mention a valid member of this server!").then(msg => {msg.delete(5000)});

  if(!member.kickable) 
  return message.channel.send(`${message.author.username}: ` + "I cannot kick this user: `Missing Permission or Role Order`").then(msg => {msg.delete(5000)});

  let reason = args.slice(1).join(' ');

  if(!reason) reason = "No reason provided";

  await member.kick(reason)

  .catch(error => message.channel.send(`${message.author.username}: ` + `Sorry, I couldn't kick because of : ${error}`)).then(msg );

  const embed = new Discord.RichEmbed()

  .setColor("#f32d11")
  .setTimestamp()
  .setDescription(`\`❯ USER KICKED \n• ${member.user.username} has been kicked by ${message.author.username} \n• Reason : ${reason}\``)

  client.channels.get(botcmd.id).send({embed});
  message.channel.send("Done. User has been Kicked <a:hype:515571561345056783>");
}
