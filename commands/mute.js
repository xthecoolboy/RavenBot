const Discord = require('discord.js');
module.exports = {
  name: 'mute',
  type: 'Mod',
  aliases: ['mute'],
	usage: '[ @user ] [ optional reason ]',
  description: 'Mention a member and mute him',
  guildOnly: true,

	async execute(message, args, client) {
    if (message.guild.id !== '500004711005683717') return;

    if (!message.member.roles.get('500700090181222400') && !message.member.roles.get('500683949018710036')  && !message.member.roles.get('500683658009640975') && !message.member.roles.get('513284645274517504')) {
      //message.delete(4000)
      return message.channel.send(`Only <@&500683949018710036> / <@&500683658009640975> / <@&513284645274517504> can use this Command!`).then(msg => {msg.delete(4000)});
    }
  
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
  
    if (!member) 
    return message.channel.send(`Please mention a valid member of this Server! <:wrong:523020135737458689>`).then(msg => {msg.delete(4000)});
  
    if (member == message.guild.members.get(message.author.id)) 
    return message.channel.send("Don't mute yourself Idiot!");
    
    if (member == message.guild.members.get(client.user.id)) 
    return message.channel.send("Hello <:meww:523021051202895872>, that's me! **I'm not muteable!!!** <:huh:523021014481764352>");
  
    if (member.roles.has('505324342679437322'))
    return message.channel.send('User is already <@&505324342679437322>!') // muted
  
    if (member.roles.has('513284645274517504')) 
    return message.channel.send("You can't mute a <@&513284645274517504>!"); // staff
  
    if (member.roles.has('525375822391934997')) 
    return message.channel.send("You can't mute a <@&525375822391934997>!"); // ah staff
    
    if (member.roles.has('500683658009640975')) 
    return message.channel.send("You can't mute a <@&500683658009640975>!"); // mod
    
    if (member.roles.has('500683949018710036')) 
    return message.channel.send("You can't mute an <@&500683949018710036>!"); // admin
  
    let reason = args.slice(1).join(' ');
    if (!reason) {
      reason = "Not Provided";
    };
  
    let mod_log_channel = message.guild.channels.find(c => c.name === "mod-log");
  
    let muteRole = message.guild.roles.find(r => r.name === 'Muted');
  
    const embed = new Discord.RichEmbed()
    .setTitle(`${member.user.tag} | ${member.user.id}`)
    .setColor("#f60839")
    .setTimestamp()
    .addField(`\`MOD: ${message.author.tag}\``, `\`REASON: ${reason}\``)
    .setFooter(`MUTED`, member.user.displayAvatarURL)
  
    member.addRole(muteRole).then(() => {
  
      client.channels.get(mod_log_channel.id).send({embed});
      message.channel.send("Done. User has been Muted <a:hype:515571561345056783>")
      .catch(error => message.channel.send(`I could not mute this user! \n ${error}`));
  
      setTimeout ( () => {
        member.removeRole(muteRole);
  
        /*const embed = new Discord.RichEmbed()
        .setTitle(`${member.user.tag} | ${member.user.id}`)
        .setColor("#d7342a")
        .setTimestamp()
        .addField(`Mod : ${message.author.tag} | ${message.author.id}`, `Reason : ${reason}`)
        .setFooter(`Un-Muted` , member.user.displayAvatarURL)*/
      }, 3000000);
  
    });
	},
};
