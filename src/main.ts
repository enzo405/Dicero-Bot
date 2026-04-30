import { dirname, importx } from '@discordx/importer'
import {
	GatewayIntentBits,
	Interaction,
	MessageFlags,
	Snowflake,
} from 'discord.js'
import { Client, IGuild } from 'discordx'
import 'reflect-metadata'
import { config } from './app/config/config.js'
import { modpingRoutine } from './app/routines/modping.routine.js'
import { staticI18n } from './app/services/i18n/i18n.service.js'
import { logger } from './app/services/logger/logger.service.js'

const deployMode = (process.env.DEPLOY_MODE ?? 'guild').toLowerCase()

const isGlobalDeploy = deployMode.toUpperCase() === 'GLOBAL'

const purgeCommands = process.env.PURGE_COMMANDS === 'true'

export const sirrobbit = new Client({
	// To use only guild command
	// botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
	botGuilds: !isGlobalDeploy ? ([config.GUILD_ID] as IGuild[]) : undefined,

	// Discord intents
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
	],

	// Debug logs are disabled in silent mode
	silent: false,

	logger: logger,
})

sirrobbit.once('ready', async () => {
	// Make sure all guilds are cached
	await sirrobbit.guilds.fetch()

	if (purgeCommands) {
		const guildsToPurge = isGlobalDeploy
			? []
			: ([config.GUILD_ID] as Snowflake[])
		logger.info(`Purge all application (/) commands in ${deployMode} mode.`)
		await sirrobbit.clearApplicationCommands(...guildsToPurge)
	}

	logger.info(
		`Started refreshing all application (/) commands in ${deployMode} mode.`
	)

	if (isGlobalDeploy) {
		await sirrobbit.initGlobalApplicationCommands()
	} else {
		// Ensure that we do not add global commands when in guild mode
		await sirrobbit.initApplicationCommands()
	}

	logger.info(
		`Successfully reloaded all application (/) commands in ${deployMode} mode`
	)

	// Start crons
	await modpingRoutine(sirrobbit)

	logger.info(`Logged in as ${sirrobbit.user!.tag}!`)
})

sirrobbit.on('interactionCreate', async (interaction: Interaction) => {
	if (interaction.isChatInputCommand()) {
		try {
			logger.info(
				`...Executing ${interaction.commandName} by ${interaction.user.username}.`
			)
			await sirrobbit.executeInteraction(interaction)
		} catch (error) {
			logger.error(error)
			await interaction.reply({
				content: staticI18n.translate('global.error.occurred', {
					lng: interaction.locale,
					commandName: interaction.commandName,
				}),
				flags: MessageFlags.Ephemeral,
			})
		}
	} else if (interaction.isButton() || interaction.isStringSelectMenu()) {
		try {
			await sirrobbit.executeInteraction(interaction)
		} catch (error) {
			logger.error(error)
			await interaction.reply({
				content: staticI18n.translate('global.error.occurred', {
					lng: interaction.locale,
					commandName: interaction.customId,
				}),
				flags: MessageFlags.Ephemeral,
			})
		}
	} else {
		logger.warn('Unhandled interaction')
		return
	}
})

async function run() {
	// The following syntax should be used in the ECMAScript environment
	await importx(
		`${dirname(import.meta.url)}/app/{events,commands,buttons}/**/*.{ts,js}`
	)

	// Let's start the bot
	if (!config.TOKEN) {
		logger.error('Could not find TOKEN in your environment')
		throw new Error('Could not find TOKEN in your environment')
	}

	// Log in with your bot token
	await sirrobbit.login(config.TOKEN)
}

void run()
