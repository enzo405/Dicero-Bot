import { CommandInteraction, PermissionFlagsBits } from 'discord.js'
import { Client, Discord } from 'discordx'
import { packageInfos } from '../../config/config.js'
import { I18nSlash } from '../../decorators/i18n/discord/decorators/slash.i18n.decorator.js'
import { staticI18n } from '../../services/i18n/i18n.service.js'

@Discord()
export class PingCommand {
	@I18nSlash({
		name: 'ping',
		description: 'command.ping.description',
		defaultMemberPermissions: PermissionFlagsBits.Administrator,
		translateLanguages: ['fr'],
		defaultLanguage: 'en',
	})
	public async handler(
		interaction: CommandInteraction,
		client: Client
	): Promise<void> {
		const messageLatency = Math.abs(
			Date.now() - interaction.createdTimestamp
		)
		const apiLatency = Math.abs(Math.round(client.ws.ping))
		const appVersion = packageInfos.version

		await interaction.reply(
			staticI18n.translate('command.ping.response', {
				lng: interaction.locale,
				messageLatency,
				apiLatency,
				appVersion,
			})
		)
	}
}
