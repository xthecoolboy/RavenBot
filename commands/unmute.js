const Discord = require('discord.js');
exports.run = async (client, message, args) => {
  if (message.channel.type == 'dm') {
    return message.channel.send("This is Not a right place to use this Command!");
  };

  if (!message.member.roles.some(r=>['Dev', 'Admin'].includes(r.name)) ) 
  return message.channel.send(`Only Admins can use this Command`);

  let member = message.mentions.members.first() || message.guild.members.get(args[0]);

  if (!member) 
  return message.channel.send(`Please mention a valid member of this Server!`);

  if (member == message.guild.members.get(message.author.id)) 
  return;
  
  if (member == message.guild.members.get(client.user.id)) 
  return;

  if (!member.roles.has('505324342679437322'))
  return message.channel.send('User is not Muted!');

  if (member.roles.has('513284645274517504')) 
  return;
  
  if (member.roles.has('500683658009640975')) 
  return;
  
  if (member.roles.has('500683949018710036')) 
  return;

  let reason = args.slice(1).join('');
  if (!reason) {
    reason = "Not Provided";
  };

  let mod_log_channel = message.guild.channels.find(c => c.name === "mod-log");

  let muteRole = message.guild.roles.find(r => r.name === 'Muted');

  const embed = new Discord.RichEmbed()
  .setTitle(`${member.user.tag} | ${member.user.id}`)
  .setColor("#d7342a")
  .setTimestamp()
  .addField(`Mod : ${message.author.tag} | ${message.author.id}`, `Reason : ${reason}`)
  .setFooter(`Un-Muted` , message.member.user.displayAvatarURL)

  member.removeRole(muteRole).then(() => {

    client.channels.get(mod_log_channel.id).send({embed});
    message.channel.send("Done. User has been Un-muted <a:hype:515571561345056783>")
    .catch(error => message.channel.send(`I could not un-mute this user! \n ${error}`));

  });

}