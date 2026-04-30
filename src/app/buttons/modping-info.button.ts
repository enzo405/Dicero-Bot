import { ButtonInteraction, MessageFlags, time } from 'discord.js'
import { ButtonComponent, Discord } from 'discordx'
import { TIMEZONE_GROUPS } from '../services/habby/modping.service.js'
import { staticI18n } from '../services/i18n/i18n.service.js'
import { config } from '../config/config.js'

@Discord()
export class ModPingInfoButton {
	@ButtonComponent({ id: 'button-modping_info' })
	public async handler(interaction: ButtonInteraction): Promise<void> {
		const lng = interaction.locale
		const member = await interaction.guild?.members.fetch(
			interaction.user.id
		)
		if (!member) return

		const userTimezoneGroups = TIMEZONE_GROUPS.filter((g) =>
			member.roles.cache.has(g.roleId)
		)

		if (userTimezoneGroups.length === 0) {
			await interaction.reply({
				content: staticI18n.translate(
					'command.modping-setup.info.no_role',
					{ lng, modPingRoleId: config.MODPING_ROLE_ID }
				),
				flags: MessageFlags.Ephemeral,
			})
			return
		}

		const scheduleLines = userTimezoneGroups.map((g) => {
			// Build a Discord timestamp for activeStartUTC and activeEndUTC
			// We use today's date just to get a readable HH:MM display via Discord's :t format
			const startDate = new Date()
			startDate.setUTCHours(g.activeStartUTC, 0, 0, 0)

			const endDate = new Date()
			endDate.setUTCHours(g.activeEndUTC, 0, 0, 0)
			// If end < start, it wraps to next day
			if (g.activeEndUTC < g.activeStartUTC) {
				endDate.setUTCDate(endDate.getUTCDate() + 1)
			}

			const label = staticI18n.translate(
				`command.modping-setup.embed.timezone.${g.slug}`,
				{ lng }
			)

			return staticI18n.translate(
				'command.modping-setup.info.schedule_line',
				{
					lng,
					label,
					start: time(startDate, 't'), // e.g. 8:00 AM
					end: time(endDate, 't'),
				}
			)
		})

		await interaction.reply({
			content: staticI18n.translate(
				'command.modping-setup.info.active_roles',
				{
					lng,
					schedules: scheduleLines.join('\n'),
				}
			),
			flags: MessageFlags.Ephemeral,
		})
	}
}
