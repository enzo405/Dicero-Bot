import { GuildMember, TextChannel } from 'discord.js'
import { Discord, On } from 'discordx'
import { config } from '../config/config.js'
import {
	TRACK_ROLES_FILE,
	trackRole,
} from '../services/habby/trackRole.service.js'
import { FileService } from '../services/file/file.service.js'
import { ArrayUtils } from '../services/utils/arrays.utils.service.js'

@Discord()
export class RoleListener {
	@On({ event: 'guildMemberUpdate' })
	async onGuildMemberUpdate(members: GuildMember[]) {
		if (members[0].guild.id === config.GUILD_ID) {
			const oldRoles = members[0].roles.cache
			const newRoles = members[1].roles.cache
			const { added, removed } = ArrayUtils.diff(
				oldRoles.map((r) => r.id),
				newRoles.map((r) => r.id)
			)
			const trackedRoles: trackRole = await FileService.openJsonFile(
				config.DATA_FOLDER,
				TRACK_ROLES_FILE
			)
			const trackedAdded = added
				.filter((r) => trackedRoles.roles?.includes(r))
				.map((r_id) => newRoles.find((r) => r.id === r_id))
			const removedAdded = removed
				.filter((r) => trackedRoles.roles?.includes(r))
				.map((r_id) => oldRoles.find((r) => r.id === r_id))
			let response = ''
			if (trackedAdded.length > 0) {
				const trackedRoleMentions: string = trackedAdded
					.map((r) => `<@&${r?.id}>`)
					.join(', ')
				response = `${members[0].toString()} just received ${trackedRoleMentions}!`
			}
			if (removedAdded.length > 0) {
				const trackedRoleMentions: string = removedAdded
					.map((r) => `<@&${r?.id}>`)
					.join(', ')
				response = response.concat(
					`${members[0].toString()} no longer has **${trackedRoleMentions}**.`
				)
			}
			if (response !== '' && trackedRoles.channel) {
				const channel = members[0].guild.channels.cache.find(
					(c) => c.id === trackedRoles.channel
				) as TextChannel
				if (channel) {
					channel.send(response)
				}
			}
		}
	}
}
