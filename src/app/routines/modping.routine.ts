import { CronJob } from 'cron'
import { Client } from 'discord.js'
import { syncModPingRoles } from '../services/habby/modping.service.js'
import { logger } from '../services/logger/logger.service.js'

const modpingRoutine = async (client: Client) => {
	// Runs every hour at :00
	const job = new CronJob('0 * * * *', async () => {
		logger.info('[ModPing] Running hourly sync...')
		try {
			await syncModPingRoles(client)
		} catch (err) {
			logger.error('[ModPing] Sync failed', err)
		}
	})

	logger.info('[ModPing] Routine started')
	job.start()
}

export { modpingRoutine }
