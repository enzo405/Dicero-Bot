import { CommandInteraction, TextChannel, ThreadChannel } from 'discord.js'
import { config } from '../../config/config.js'
import { DataTableUtils } from './datatable.utils.service.js'

interface ISendDateTableOptions {
	isDeferReply?: boolean
	chunkSize?: number
	columnsName?: { [key: string]: string }
	displayLanguage: string
}

const DEFAULT_DISCORD_LANGUAGE = 'en'

class DiscordUtils {
	public static createDiscordCodeBlock(content: any): string {
		return `${config.TRIPLE_QUOTE}${config.UNIX_NEWLINE}${content}${config.TRIPLE_QUOTE}`
	}

	public static async sendDataTable(
		interaction: CommandInteraction,
		data: any,
		options?: ISendDateTableOptions
	): Promise<void> {
		const defaultOptions = {
			isDeferReply: false,
			chunkSize: 1,
			columnsName: {},
			displayLanguage: DEFAULT_DISCORD_LANGUAGE,
		}
		const optionsToUse = options
			? { ...defaultOptions, ...options }
			: defaultOptions

		if (optionsToUse.chunkSize < 1) {
			optionsToUse.chunkSize = 1
		}

		if (data.length > optionsToUse.chunkSize) {
			for (let i = 0; i < data.length; i += optionsToUse.chunkSize) {
				const chunk = data.slice(i, i + optionsToUse.chunkSize)
				const messageToSend = `${this.createDiscordCodeBlock(
					DataTableUtils.beautifulTable(
						chunk,
						optionsToUse.columnsName,
						optionsToUse.displayLanguage
					)
				)}`
				await this.send(
					interaction,
					optionsToUse.isDeferReply,
					true,
					messageToSend
				)
			}
		} else {
			await this.send(
				interaction,
				optionsToUse.isDeferReply,
				true,
				`${this.createDiscordCodeBlock(
					DataTableUtils.beautifulTable(
						data,
						optionsToUse.columnsName,
						optionsToUse.displayLanguage
					)
				)}`
			)
		}
	}

	public static async send(
		commandInteraction: CommandInteraction,
		isDeferReply: boolean,
		toChannel: boolean,
		messageToSend: any
	): Promise<void> {
		let channel: TextChannel | ThreadChannel
		if (isDeferReply) {
			channel = commandInteraction.client.channels.cache.get(
				commandInteraction.channelId
			) as TextChannel
		} else {
			channel = commandInteraction.channel as TextChannel
		}

		if (toChannel) {
			await channel.send(messageToSend)
		} else {
			await commandInteraction.editReply(messageToSend)
		}
	}
}

/**
 * Get the author (creator) of a thread channel.
 * @param thread The thread channel
 * @returns The user ID of the thread creator, or null if not found
 */
export async function getThreadAuthor(
	thread: import('discord.js').ThreadChannel
): Promise<string | null> {
	try {
		// Discord.js v14: fetchOwner() returns the thread owner (creator)
		const owner = await thread.fetchOwner()
		return owner?.id ?? null
	} catch (e) {
		console.error('Error fetching thread owner:', e)
		return null
	}
}

export { DEFAULT_DISCORD_LANGUAGE, DiscordUtils }
