const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const qs = require('querystring');

const SOURCES = ['stable', 'master', 'rpc', 'commando', 'akairo', 'akairo-master'];

class DocsCommand extends Command {
	constructor() {
		super('docs', {
			aliases: ['docs'],
			category: 'docs',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'query',
					match: 'rest',
					type: 'lowercase',
					prompt: {
						start: 'what would you like to search?'
					}
				},
				{
					id: 'force',
					match: 'flag',
					flag: ['--force', '-f']
				}
			],
			description: {
				content: 'Searches discord.js documentation.',
				usage: '<query>',
				examples: ['TextChannel', 'Client', 'ClientUser#setActivity master']
			}
		});
	}

	async exec(message, { query, force }) {
		query = query.split(' ');
		const source = SOURCES.includes(query.slice(-1)[0]) ? query.pop() : 'stable';
		const queryString = qs.stringify({ src: source, q: query.join(' '), force });
		const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queryString}`);
		const embed = await res.json();
		if (!embed) {
			return message.util.reply('I couldn\'t find the requested information.');
		}
		if (message.channel.type === 'dm' || !message.channel.permissionsFor(message.guild.me).has(['ADD_REACTIONS', 'MANAGE_MESSAGES'], false)) {
			return message.util.send({ embed });
		}
		const msg = await message.util.send({ embed });
		msg.react('🗑');
		let react;
		try {
			react = await msg.awaitReactions(
				(reaction, user) => reaction.emoji.name === '🗑' && user.id === message.author.id,
				{ max: 1, time: 30000, errors: ['time'] }
			);
		} catch (error) {
			msg.reactions.removeAll();

			return message;
		}
		react.first().message.delete();

		return message;
	}
}

module.exports = DocsCommand;
