module.exports = (client) => {
    console.log(`logging In \nClient: ${client.user.tag} \nUsers: ${client.users.size} \nChannels: ${client.channels.size} \nServers: ${client.guilds.size}`);
    client.user.setActivity(`!help for options`, {type: "PLAYING"});
}
