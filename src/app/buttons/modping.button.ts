import { ButtonInteraction, MessageFlags } from 'discord.js'
import { ButtonComponent, Discord } from 'discordx'
import { TIMEZONE_GROUPS } from '../services/habby/modping.service.js'
import { config } from '../config/config.js'
import { staticI18n } from '../services/i18n/i18n.service.js'

@Discord()
export class ModPingButton {
	@ButtonComponent({ id: /modping_toggle-.*/ })
	public async handler(interaction: ButtonInteraction): Promise<void> {
		const slug = interaction.customId.replace('modping_toggle-', '')
		const group = TIMEZONE_GROUPS.find((g) => g.slug === slug)

		const lng = interaction.locale || 'en'

		if (!group) {
			await interaction.reply({
				content: staticI18n.translate(
					'command.modping-setup.response.unknown_group',
					{
						lng,
					}
				),
				flags: MessageFlags.Ephemeral,
			})
			return
		}

		const member = await interaction.guild?.members.fetch(
			interaction.user.id
		)
		if (!member) return

		const role = interaction.guild?.roles.cache.get(group.roleId)
		if (!role) {
			await interaction.reply({
				content: staticI18n.translate(
					'command.modping-setup.response.role_not_found',
					{ lng }
				),
				flags: MessageFlags.Ephemeral,
			})
			return
		}

		if (member.roles.cache.has(role.id)) {
			await member.roles.remove(role)
			await interaction.reply({
				content: staticI18n.translate(
					'command.modping-setup.response.role_removed',
					{
						lng,
						label: group.label,
						modPingRoleId: config.MODPING_ROLE_ID,
					}
				),
				flags: MessageFlags.Ephemeral,
			})
		} else {
			await member.roles.add(role)
			await interaction.reply({
				content: staticI18n.translate(
					'command.modping-setup.response.role_added',
					{
						lng,
						label: group.label,
						modPingRoleId: config.MODPING_ROLE_ID,
					}
				),
				flags: MessageFlags.Ephemeral,
			})
		}
	}
}
