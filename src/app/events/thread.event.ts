import type { ArgsOf } from 'discordx'
import { Discord, On } from 'discordx'
import { config } from '../config/config.js'
import threadService from '../services/habby/thread.service.js'

@Discord()
export class ThreadListener {
	@On({ event: 'threadCreate' })
	async onThread([thread]: ArgsOf<'threadCreate'>) {
		if (thread.parentId === config.BUGREPORT_CHANNEL_ID) {
			setTimeout(() => {
				threadService.processBugReport(thread)
			}, 1000)
		}

		if (thread.parentId === config.GR_CHANNEL_ID) {
			setTimeout(() => {
				threadService.processGuildRecruitment(thread)
			}, 1000)
		}
	}
}
