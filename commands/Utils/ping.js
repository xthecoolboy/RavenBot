
module.exports = {
    name: 'ping',
    type: 'Utils',
    usage: ' ',
    aliases: ['pong', 'latency'],
	description: 'API Latency or Ping Status',
    
	async execute(message, args, client) {
        const m = await message.channel.send("PING TEST");
        m.edit(`\`LATENCY ${m.createdTimestamp - message.createdTimestamp}ms\` <a:hype:515571561345056783> \`API LATENCY ${Math.round(client.ping)}ms\``);
    
	},
};