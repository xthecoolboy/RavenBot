module.exports = (client) => {
    console.log(`logging In \nClient: ${client.user.tag} \nUsers: ${client.users.size} \nChannels: ${client.channels.size} \nServers: ${client.guilds.size}`);
    client.user.setActivity(`${process.env.DISCORD_PREFIX}help <a:hype:515571561345056783>`, {type: "PLAYING"});
}
