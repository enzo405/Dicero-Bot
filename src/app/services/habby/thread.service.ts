import { AnyThreadChannel } from 'discord.js'
import { logger } from '../../services/logger/logger.service.js'

/**
 * Process a guild recruitment thread.
 * @param thread The thread channel
 */
function processGuildRecruitment(thread: AnyThreadChannel) {
	logger.info(`New guild recruitment thread created: ${thread.id}`)
	thread.send(
		`Hi <@${thread.ownerId}>, \n### Your post title should include the following information: \n> \`{GuildName} - {GL-XX} - [Range {x}-{y}]\`\n> Feel free to add more information.\n> You can also add tags on your post so it's easier for people to filter\n\n\n### How guilds works?\n> Guilds work in ranges of 10 so they look like GL 1 - 10, GL 11 - 20, GL 21 - 30 (so if you are GL-308 then your range is GL 301 - 310 you can search for guilds between those numbers) when you have watched the video search all GL numbers in your range in the search bar to find a guild that has space.\n\n### What is my GL?\n> To find your server number go into the game and then click the 3 lines in the top left, then click settings and then click on select server. On this page you will see something that looks like GL-XXX (XXX being the number of your server)`
	)
}

/**
 * Process a bug report thread.
 * @param thread The thread channel
 */
function processBugReport(thread: AnyThreadChannel) {
	logger.info(`New bug report thread created: ${thread.id}`)
	thread.send(
		`Hi <@${thread.ownerId}>, can you please add the below information to your post\n\n- The time this bug occurred (including your local time zone)\n- Your player ID (This can be found in game in settings)\n- Device information INC software version\n- A detailed description of the bug\n- Any screenshots or videos you have of the issue\n\nThose informations will be useful for developers and lumus to check and reproduce the issue.`
	)
	thread.send(
		`If your issue is related to one of these topics, please use in-game support system:\n- Losing items\n- Not receiving rank rewards, for example Seal Battle, guild boss, guild expedition, etc\n- The pity counter was reset, but the corresponding quality gear was not received.\n\nThank you for your report!`
	)
}

export default {
	processGuildRecruitment,
	processBugReport,
}
