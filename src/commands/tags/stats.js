const { Command } = require('discord-akairo');
const Tags = require('../../models/Tags');
const { Op, fn, col } = require('sequelize');

class TagStatsCommand extends Command {
    constructor() {
        super('tag-stats', {
            aliases: ['tag-stats'],
            category: 'tag',
            channel: 'guild',
            args: [
                {
                    id: 'member',
                    type: 'member'
                }
            ],
            description: {
                content: 'Displays tag statistics of a member.',
                usage: '<member>',
                examples: ['@Suvajit']
            }
        })
    }

    async exec(message, { member }) {

        if (member) {
            const top = await Tags.findAll({ where: { uses: { [Op.lt] : 10000 }, guildID: message.guild.id, authorID: member.user.id }});
            const tags = await Tags.findAll({ where: { authorID: member.user.id, guildID: message.guild.id }});
            const totaluses = tags.reduce((count, c) => {
                return count + c.uses;
            }, 0);
            
            const embed = this.client.util.embed().setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
            .addField(`Owned Tags`, tags.length).addField(`Owned Tag Uses`, totaluses)
            .addField('Top Tag', `${top[0].name} ( ${top[0].uses} uses )`)
            .setFooter(message.guild.name, message.guild.iconURL()).setColor(0x8387db)
            return message.util.send({ embed });
        }
        const top = await Tags.findAll({ where: { uses: { [Op.lt] : 10000 }, guildID: message.guild.id }});
        const tags = await Tags.findAll({ where: { guildID: message.guild.id }});
        const totaluses = tags.reduce((count, c) => {
			return count + c.uses;
        }, 0);
        
        const embed = this.client.util.embed().setAuthor(`${message.guild.name}`, message.guild.iconURL())
        .addField(`Total Tags`, tags.length).addField(`Total Uses`, totaluses).addField('Top Tag', `${top[0].name} ( ${top[0].uses} uses)`).setColor(0x8387db)
        return message.util.send({ embed });
    }
}

module.exports = TagStatsCommand;