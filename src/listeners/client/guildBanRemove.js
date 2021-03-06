const { Listener } = require('discord-akairo');
const Base = require('../../util/Base');
const Case = require('../../models/Case');
const moment = require('moment');

class GuildBanRemoveListener extends Listener {
	constructor() {
		super('guildBanRemove', {
			emitter: 'client',
			event: 'guildBanRemove',
			category: 'client'
		});
	}

	async exec(guild, user) {
		if (!this.client.settings.get(guild, 'moderation', undefined)) return;
		if (this.client.cached.delete(`${guild.id}:${user.id}:UNBAN`)) return;
		const totalCases = this.client.settings.get(guild, 'caseTotal', 0) + 1;
		this.client.settings.set(guild, 'caseTotal', totalCases);

		const modLogChannel = this.client.settings.get(guild, 'modLogChannel', undefined);
		const prefix = this.client.commandHandler.prefix({ guild });
		const reason = `Use \`${prefix}reason ${totalCases} <...reason>\` to set a reason for this case`;

		let modMessage;
		if (modLogChannel) {
			const embed = Base.logEmbed({ member: user, action: 'Unban', caseNum: totalCases, reason }).setColor(Base.CONSTANTS.COLORS.UNBAN);
			modMessage = await this.client.channels.get(modLogChannel).send(embed);
		}

		await Case.create({
			caseID: totalCases,
			targetID: user.id,
			targetTag: user.tag,
			guildID: guild.id,
			reason,
			action: Base.CONSTANTS.ACTIONS.BAN,
			createdAt: moment.utc().toDate(),
			messageID: modMessage ? modMessage.id : null
		});
	}
}

module.exports = GuildBanRemoveListener;
