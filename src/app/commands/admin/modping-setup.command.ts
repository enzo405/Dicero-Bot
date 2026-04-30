import {
	ButtonStyle,
	CommandInteraction,
	EmbedBuilder,
	MessageFlags,
	PermissionFlagsBits,
	TextChannel,
	ApplicationCommandOptionType,
	ChannelType,
} from 'discord.js'
import { Discord } from 'discordx'
import { I18nSlash } from '../../decorators/i18n/discord/decorators/slash.i18n.decorator.js'
import { I18nSlashOption } from '../../decorators/i18n/discord/decorators/slash-option.i18n.decorator.js'
import { TIMEZONE_GROUPS } from '../../services/habby/modping.service.js'
import { config } from '../../config/config.js'
import { ButtonRowBuilder } from '../../builder/button-row.builder.js'
import { staticI18n } from '../../services/i18n/i18n.service.js'

@Discord()
export class ModPingSetupCommand {
	@I18nSlash({
		name: 'modping-setup',
		description: 'Send the ModPing timezone subscription embed',
		defaultMemberPermissions: PermissionFlagsBits.Administrator,
		defaultLanguage: 'en',
	})
	public async handler(
		@I18nSlashOption({
			description: 'Channel to send the embed in',
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
			name: 'channel',
			defaultLanguage: 'en',
		})
		channelParam: TextChannel,
		interaction: CommandInteraction
	): Promise<void> {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const lng = interaction.locale

		const embed = new EmbedBuilder()
			.setTitle(
				staticI18n.translate('command.modping-setup.embed.title', {
					lng,
				})
			)
			.setDescription(
				staticI18n.translate(
					'command.modping-setup.embed.description',
					{
						lng,
						modPingRoleId: config.MODPING_ROLE_ID,
					}
				)
			)
			.setColor(0x5865f2)
			.addFields(
				TIMEZONE_GROUPS.map((g) => ({
					name: staticI18n.translate(
						`command.modping-setup.embed.timezone.${g.slug}`,
						{ lng }
					),
					value: staticI18n.translate(
						'command.modping-setup.embed.field_active',
						{
							lng,
							start: g.activeLocalTime.start,
							end: g.activeLocalTime.end,
						}
					),
					inline: true,
				}))
			)

		const row = ButtonRowBuilder.create()
			.addButtons(
				TIMEZONE_GROUPS.map((g) => ({
					id: g.slug,
					name: staticI18n.translate(
						`command.modping-setup.embed.timezone.${g.slug}`,
						{ lng }
					),
				})),
				ButtonStyle.Primary,
				'modping_toggle'
			)
			.newRow()
			.addButtons(
				[
					{
						id: 'modping_info',
						name: staticI18n.translate(
							'command.modping-setup.embed.more_info',
							{ lng }
						),
					},
				],
				ButtonStyle.Secondary
			)
			.build()

		await channelParam.send({ embeds: [embed], components: row })

		await interaction.followUp({
			content: staticI18n.translate(
				'command.modping-setup.response.success',
				{
					lng,
					channelId: channelParam.id,
				}
			),
			flags: MessageFlags.Ephemeral,
		})
	}
}
