import type { ArgsOf } from 'discordx'
import { Discord, On } from 'discordx'
import { logger } from '../services/logger/logger.service.js'
import { WebhookUtils } from '../services/utils/webhook.utils.service.js'
import { config } from '../config/config.js'

@Discord()
export class DiscordLogging {
	@On()
	async debug([message]: ArgsOf<'debug'>): Promise<void> {
		logger.debug(message)
	}

	@On()
	async warn([message]: ArgsOf<'warn'>): Promise<void> {
		logger.warn(message)
	}

	@On()
	async error([error]: ArgsOf<'error'>): Promise<void> {
		const message =
			'<@&' + config.BOT_DEV_ROLE_ID + '> `' + error.toString() + '`'
		WebhookUtils.sendLog('Bot Error', message)
		logger.log(error)
	}
}
