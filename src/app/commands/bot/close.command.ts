import {
	ApplicationCommandOptionType,
	CommandInteraction,
	EmbedBuilder,
	GuildMember,
	MessageFlags,
	ThreadChannel,
} from 'discord.js'
import { Discord } from 'discordx'
import { config } from '../../config/config.js'
import { I18nSlash } from '../../decorators/i18n/discord/decorators/slash.i18n.decorator.js'
import { logger } from '../../services/logger/logger.service.js'
import { I18nSlashOption } from '../../decorators/i18n/discord/decorators/slash-option.i18n.decorator.js'

@Discord()
export class CloseBugCommand {
	@I18nSlash({
		name: 'close',
		description: 'command.close.description',
		translateLanguages: ['fr'],
		defaultLanguage: 'en',
	})
	public async handler(
		@I18nSlashOption({
			description: 'command.close.paramsDescription.reason',
			type: ApplicationCommandOptionType.String,
			required: true,
			name: 'reason',
			defaultLanguage: 'en',
		})
		reason: string,
		interaction: CommandInteraction
	): Promise<void> {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const author = interaction.member as GuildMember
		const hasPermission = author.permissions.has('ManageThreads')
		const hasRole = author.roles.cache.some((role) =>
			config.CLOSE_CMD_PERMISSION_ROLE_IDS.includes(role.id)
		)
		if (!hasRole && !hasPermission) {
			await interaction.editReply({
				content: 'You do not have the required permissions !',
			})
			return
		}

		const thread = (await interaction.client.channels.fetch(
			interaction.channelId
		)) as ThreadChannel | undefined

		if (
			thread instanceof ThreadChannel &&
			config.CLOSE_CHANNEL_IDS.find((id) => id === thread.parentId)
		) {
			// Don't need to check if the thread is archived or locked
			// because when you execute the command it will re-open the thread
			if (thread.name.startsWith('Closed:')) {
				await interaction.editReply({
					content: 'This thread is already closed.',
				})
				return
			}
			try {
				await thread.send(
					`Thread has been successfully closed, the thread is now locked and archived with the following reason:\n> ${reason}`
				)
				await interaction.editReply(
					'Thread has been successfully closed and archived'
				)

				// Slice the name of the thread because the name can't reach over 100 char
				await thread.setName(`Closed: ${thread.name.slice(0, 91)}`)
				await thread.setLocked(true)
				await thread.setArchived(true)
				logger.discord(
					`Thread <#${thread.id}> has been locked and archived by ${author.user.tag} with the following reason: \`${reason.slice(0, 20)}\``
				)
			} catch (e) {
				logger.discord(
					`Failed to execute close command sent by ${author.user.username} on the thread <#${thread.id}>: ${e}`
				)
			}
			// DM the author of the thread
			if (thread.ownerId) {
				const owner = await interaction.client.users.fetch(
					thread.ownerId
				)
				if (owner) {
					try {
						await owner.send({
							content: `Hi! Thanks for taking the time to share your feedback in <#${thread.id}>. 📝`,
							embeds: [buildEmbed(reason, thread.id)],
						})
					} catch (error) {
						logger.info(
							`Failed to send DM to ${owner.tag} regarding thread <#${thread.id}>: ${error}`
						)
					}
				}
			}
		} else {
			await interaction.editReply({
				content: 'This command can only be used in certain channels',
			})
		}
	}
}

const buildEmbed = (reason: string, threadId: string) => {
	return new EmbedBuilder()
		.setTitle('Thread Closed')
		.setDescription(
			`We have decided to close this thread for now.\nReason: ${reason}\n\nIf you believe this was closed in error, feel free to reach out in <#1326343230119477362>\n\nThanks again for helping improve the experience! 🙌`
		)
		.setColor('Blue')
		.setFooter({ text: `Thread ID: ${threadId}` })
		.setTimestamp()
}
