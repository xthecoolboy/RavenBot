const { Command } = require('discord-akairo');
const Base = require('../../util/Base');
const Case = require('../../models/Case');
const moment = require('moment');

class RestrictEmojiCommand extends Command {
	constructor() {
		super('restrict-emoji', {
			category: 'mod',
			channel: 'guild',
			clientPermissions: ['MANAGE_ROLES'],
			ratelimit: 2,
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: 'what member do you want to restrict?',
						retry: 'please mention a member.'
					}
				},
				{
					id: 'reason',
					match: 'rest',
					type: 'string',
					default: ''
				}
			],
			description: {
				content: 'Restrict a members ability to use custom emoji.',
				usage: '<member> <...reason>',
				examples: []
			}
		});
	}

	userPermissions(message) {
		const staffRole = this.client.settings.get(message.guild, 'modRole', undefined);
		const hasStaffRole = message.member.roles.has(staffRole);
		if (!hasStaffRole) return 'Moderator';
		return null;
	}

	async exec(message, { member, reason }) {
		const staffRole = this.client.settings.get(message.guild, 'modRole', undefined);
		if (member.id === message.author.id) return;
		if (member.roles.has(staffRole)) {
			return message.reply('uh-uh! You know you can\'t do this.');
		}

		const restrictRoles = this.client.settings.get(message.guild, 'restrictRoles', undefined);
		if (!restrictRoles) return message.reply('there are no restricted roles configured on this server.');

		const key = `${message.guild.id}:${member.id}:EMOJI`;
		if (this.client.cached.has(key)) {
			return message.reply('that user is currently being moderated by someone else.');
		}
		this.client.cached.add(key);

		const totalCases = this.client.settings.get(message.guild, 'caseTotal', 0) + 1;

		try {
			await member.roles.add(restrictRoles.emoji, `Embed restricted by ${message.author.tag} | Case #${totalCases}`);
		} catch (error) {
			this.client.cached.delete(key);
			return message.reply(`there was an error emoji restricting this member: \`${error}\``);
		}

		this.client.settings.set(message.guild, 'caseTotal', totalCases);

		if (!reason) {
			const prefix = this.handler.prefix(message);
			reason = `Use \`${prefix}reason ${totalCases} <...reason>\` to set a reason for this case`;
		}

		const modLogChannel = this.client.settings.get(message.guild, 'modLogChannel', undefined);
		let modMessage;
		if (modLogChannel) {
			const embed = Base.logEmbed({ message, member, action: 'Emoji restriction', caseNum: totalCases, reason }).setColor(Base.CONSTANTS.COLORS.EMOJI);
			modMessage = await this.client.channels.get(modLogChannel).send(embed);
		}

		await Case.create({
			caseID: totalCases,
			targetID: member.id,
			targetTag: member.user.tag,
			authorTag: message.author.tag,
			authorID: message.author.id,
			guildID: message.guild.id,
			messageID: modMessage ? modMessage.id : undefined,
			action: Base.CONSTANTS.ACTIONS.EMOJI,
			reason,
			createdAt: moment.utc().toDate()
		});

		return message.util.send(`Successfully emoji restricted **${member.user.tag}**`);
	}
}

module.exports = RestrictEmojiCommand;
