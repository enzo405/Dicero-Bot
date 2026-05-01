import { AnyThreadChannel } from 'discord.js'
import { logger } from '../../services/logger/logger.service.js'

/**
 * Process a guild recruitment thread.
 * @param thread The thread channel
 */
function processGuildRecruitment(thread: AnyThreadChannel) {
	logger.info(`New guild recruitment thread created: ${thread.id}`)
	thread.send(
		`Hi <@${thread.ownerId}>, \n### Your post title should include the following information: \n> \`{GuildName} - {Server Type} - {Server Number}\`\n> Feel free to add more information.\n> :warning: Make sure you have the correct tags on your post so people can find it more easily.\n\n### What is my Server?\n> You can find your **Server Type** and **Server Number** when you open the game:\nE.G: \`Light of Dawn - 28\``
	)
}

/**
 * Process a bug report thread.
 * @param thread The thread channel
 */
function processBugReport(thread: AnyThreadChannel) {
	logger.info(`New bug report thread created: ${thread.id}`)
	thread.send(
		`Hi <@${thread.ownerId}>, can you please add those information to your post:\n\n- The time this bug occurred (including your local time zone)\n- Player ID (Required for account checks)\n- Device information INC software version\n- A detailed description of the bug (the more details, the faster it will be fixed)\n- Any screenshots or videos you have of the issue\n\nThose informations will be useful for developers or Habby Staff/CS team to check and reproduce the issue.`
	)
}

export default {
	processGuildRecruitment,
	processBugReport,
}
