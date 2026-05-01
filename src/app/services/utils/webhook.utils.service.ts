import { TextChannel, WebhookClient } from 'discord.js'
import { sirrobbit } from '../../../main.js'
import { config } from '../../config/config.js'
import { logger } from '../../services/logger/logger.service.js'

class WebhookClientWrapper {
	public client: WebhookClient
	public name: string

	constructor(client: WebhookClient, name: string) {
		this.client = client
		this.name = name
	}
}

export class WebhookUtils {
	private static readonly webhookClients: WebhookClientWrapper[] = []

	private static async createWebhookClient(
		channelId: string,
		webhookName: string
	): Promise<WebhookClient> {
		const channel = await sirrobbit.channels.fetch(channelId)
		if (!channel || !(channel instanceof TextChannel)) {
			throw new Error('Channel not found or not text based')
		}

		const webhooks = await channel.fetchWebhooks()
		const webhook =
			webhooks.find((wh) => wh.name === webhookName) ??
			(await channel.createWebhook({
				name: webhookName,
			}))

		const client = new WebhookClient({
			id: webhook.id,
			token: webhook.token ?? '',
		})

		this.webhookClients.push({
			client: client,
			name: webhookName,
		})
		return client
	}

	private static async getWebhookClient(
		channelId: string,
		webhookName: string
	): Promise<WebhookClient> {
		return this.webhookClients.some((wh) => wh.name === webhookName)
			? this.webhookClients.find((wh) => wh.name === webhookName)!.client
			: this.createWebhookClient(channelId, webhookName)
	}

	private static async send(
		webhookName: string,
		channelId: string | undefined,
		content: string,
		authorName: string,
		authorIconURL?: string
	): Promise<void> {
		if (!channelId) {
			throw new Error('Channel ID is undefined')
		}

		if (!webhookName) {
			throw new Error('Webhook name is undefined')
		}

		try {
			const webhookClient = await this.getWebhookClient(
				channelId,
				webhookName
			)
			await webhookClient.send({
				username: authorName,
				avatarURL: authorIconURL,
				content: content,
			})
		} catch (error) {
			logger.error('Failed to send webhook log: ' + error)
		}
	}

	public static async sendLog(level: string, content: string): Promise<void> {
		const messageContent = `[${level}] ${content}`

		await this.send(
			'LogWebhook',
			config.BOT_LOG_CHANNEL_ID,
			messageContent,
			'Logger'
		)
	}
}
