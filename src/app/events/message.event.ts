import type { ArgsOf } from 'discordx'
import { Discord, On } from 'discordx'
import { config } from '../config/config.js'
import { logger } from '../services/logger/logger.service.js'

@Discord()
export class MessageListener {
	@On({ event: 'messageCreate' })
	async onMessage(
		// The type of message is Message
		[message]: ArgsOf<'messageCreate'>
	) {
		// Gift Codes
		if (config.GIFTCODES_CHANNEL_IDS.includes(message.channelId)) {
			await message.react('✅')
			await message.react('❌')
		}

		if (config.ANNOUNCEMENTS_CHANNEL_IDS.includes(message.channelId)) {
			await message.react('❤️')
		}
	}

	@On({ event: 'messageDelete' })
	async onMessageDelete([message]: ArgsOf<'messageDelete'>) {
		const channel = message.channel

		if (channel.isThread() && message.id === channel.id) {
			try {
				await channel.send(
					'This thread has been closed after the starter message got deleted.'
				)
				await channel.setLocked(true)
				await channel.setArchived(true)

				logger.discord(
					`Thread closed after the starter message got deleted: ${channel.url}`
				)
			} catch (err) {
				logger.error('Failed to close thread:', err)
			}
		}
	}
}
