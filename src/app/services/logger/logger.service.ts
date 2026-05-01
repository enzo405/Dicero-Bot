import { ILogger } from 'discordx'
import { Logger, pino } from 'pino'
import PinoPretty from 'pino-pretty'
import { config } from '../../config/config.js'
import { Singleton } from '../../decorators/singleton.decorator.js'
import { WebhookUtils } from '../utils/webhook.utils.service.js'

const LoggerFactory = (() => {
	let logger: Logger

	const initLogger = (): Logger => {
		const stream = PinoPretty({
			colorize: true,
		})
		return pino({ level: config.LOG_LEVEL }, stream)
	}

	return {
		getLogger: (): Logger => {
			if (!logger) {
				logger = initLogger()
			}
			return logger
		},
	}
})()

@Singleton({ name: 'logger' })
class DiscordLogger implements ILogger {
	private logger: Logger = LoggerFactory.getLogger()

	public constructor() {}

	private processLog(args: unknown[], level: string): void {
		for (const arg of args) {
			if (level === 'error') {
				this.logger.error(arg)
			} else if (level === 'warn') {
				this.logger.warn(arg)
			} else if (level === 'info') {
				this.logger.info(arg)
			} else {
				this.logger.debug(arg)
			}
		}
	}

	public info(...args: unknown[]): void {
		this.processLog(args, 'info')
	}

	public log(...args: unknown[]): void {
		this.processLog(args, 'debug')
	}

	public warn(...args: unknown[]): void {
		this.processLog(args, 'warn')
	}

	public error(...args: unknown[]): void {
		this.processLog(args, 'error')
	}

	public debug(...args: unknown[]): void {
		this.processLog(args, 'debug')
	}

	public discord(...args: unknown[]): void {
		WebhookUtils.sendLog('Discord Log', args.join(' '))
		this.processLog(args, 'info')
	}
}

const logger = new DiscordLogger()

export { DiscordLogger, logger }
