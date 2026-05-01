import { Client, time } from 'discord.js'
import { config } from '../../config/config.js'
import { logger } from '../logger/logger.service.js'

const transformToLocalTime = (
	utcHourStart: number,
	utcHourEnd: number
): { start: string; end: string } => {
	const startDate = new Date()
	startDate.setUTCHours(utcHourStart, 0, 0, 0)

	const endDate = new Date()
	endDate.setUTCHours(utcHourEnd, 0, 0, 0)
	// If end < start, it wraps to next day
	if (utcHourEnd < utcHourStart) {
		endDate.setUTCDate(endDate.getUTCDate() + 1)
	}

	return {
		start: time(startDate, 't'),
		end: time(endDate, 't'),
	}
}

// Active hours = 8am to 2am local time (next day)
// Represented as UTC hour ranges based on the center offset of each group
// isActive checks if the current UTC hour falls within the group's active window
const TIMEZONE_GROUPS: {
	slug: string
	roleId: string
	label: string
	activeStartUTC: number // inclusive
	activeEndUTC: number // inclusive, can wrap around midnight
	activeLocalTime: { start: string; end: string } // inclusive
}[] = [
	{
		slug: 'west-americas',
		label: 'West Americas',
		roleId: config.MODPING_WEST_AMERICAS_ROLE_ID ?? '',
		activeStartUTC: 18, // 8am UTC-10
		activeEndUTC: 12, // 2am UTC-10 (wraps)
		activeLocalTime: transformToLocalTime(18, 12),
	},
	{
		slug: 'east-americas',
		label: 'East Americas',
		roleId: config.MODPING_EAST_AMERICAS_ROLE_ID ?? '',
		activeStartUTC: 13, // 8am UTC-5
		activeEndUTC: 7, // 2am UTC-5 (wraps)
		activeLocalTime: transformToLocalTime(13, 7),
	},
	{
		slug: 'europe-africa',
		label: 'Europe & Africa',
		roleId: config.MODPING_EUROPE_AFRICA_ROLE_ID ?? '',
		activeStartUTC: 7, // 8am UTC+1
		activeEndUTC: 1, // 2am UTC+1 (wraps)
		activeLocalTime: transformToLocalTime(7, 1),
	},
	{
		slug: 'middle-east-india',
		label: 'Middle East & India',
		roleId: config.MODPING_MIDDLE_EAST_INDIA_ROLE_ID ?? '',
		activeStartUTC: 3, // 8am UTC+5
		activeEndUTC: 21, // 2am UTC+5 (no wrap)
		activeLocalTime: transformToLocalTime(3, 21),
	},
	{
		slug: 'asia-pacific',
		label: 'Asia & Pacific',
		roleId: config.MODPING_ASIA_PACIFIC_ROLE_ID ?? '',
		activeStartUTC: 22, // 8am UTC+10
		activeEndUTC: 16, // 2am UTC+10 (wraps)
		activeLocalTime: transformToLocalTime(22, 16),
	},
]

const isGroupActive = (
	startUTC: number,
	endUTC: number,
	currentHourUTC: number
): boolean => {
	if (startUTC <= endUTC) {
		return currentHourUTC >= startUTC && currentHourUTC <= endUTC
	}
	return currentHourUTC >= startUTC || currentHourUTC <= endUTC
}

export const syncModPingRoles = async (client: Client): Promise<void> => {
	if (!config.GUILD_ID) throw new Error('GUILD_ID undefined')

	const guild = client.guilds.cache.get(config.GUILD_ID)
	if (!guild) throw new Error('Guild not found')

	const allMembers = await guild.members.fetch()

	const modPingRole = guild.roles.cache.get(config.MODPING_ROLE_ID ?? '')
	if (!modPingRole) throw new Error('Mod Ping role not found')

	const modRole = guild.roles.cache.get(config.MOD_ROLE_ID ?? '')
	if (!modRole) throw new Error('Mod role not found')

	const modMembers = allMembers.filter((m) => m.roles.cache.has(modRole.id))

	guild.members.cache.clear()

	const currentHourUTC = new Date().getUTCHours()
	let modPingCount = 0

	for (const member of modMembers.values()) {
		const hasNoTimezoneRole = !TIMEZONE_GROUPS.some((g) =>
			member.roles.cache.has(g.roleId)
		)

		if (hasNoTimezoneRole) {
			if (!member.roles.cache.has(modPingRole.id)) {
				await member.roles.add(modPingRole)
				modPingCount++
				logger.info(
					`[ModPing] Added to ${member.user.username} (no timezone role)`
				)
			}
			continue
		}

		const shouldBeActive = TIMEZONE_GROUPS.some(
			(group) =>
				member.roles.cache.has(group.roleId) &&
				isGroupActive(
					group.activeStartUTC,
					group.activeEndUTC,
					currentHourUTC
				)
		)

		const userHasModPingRole = member.roles.cache.has(modPingRole.id)
		if (shouldBeActive && !userHasModPingRole) {
			await member.roles.add(modPingRole)
			logger.info(`[ModPing] Added to ${member.user.username}`)
			modPingCount++
		} else if (!shouldBeActive && userHasModPingRole) {
			await member.roles.remove(modPingRole)
			logger.info(`[ModPing] Removed from ${member.user.username}`)
		}
	}

	logger.info(`[ModPing] Sync done — ${modPingCount}`)
}

export { TIMEZONE_GROUPS, isGroupActive }
