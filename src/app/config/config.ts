import * as dotenv from 'dotenv'
dotenv.config({ path: './.env.dev' })

import * as fs from 'fs'
import * as path from 'path'

export const packageInfos = JSON.parse(
	fs
		.readFileSync(path.join('./package.json'), { encoding: 'utf8' })
		.toString()
)

const p = process.env
const parentFolder = p.NODE_ENV === 'production' ? 'dist' : 'src'

export const config = {
	BOT_VERSION: packageInfos.version,
	COLOR: {
		OK: 'Green',
		NOK: 'Red',
		WARNING: 'Orange',
	},
	TRIPLE_QUOTE: '```',
	UNIX_NEWLINE: '\n',
	PROCESSED_IMAGE_FOLDER: `./${parentFolder}/processed_image/`,
	DATA_FOLDER: `./${parentFolder}/data/`,
	LOCALES_FOLDER: `./${parentFolder}/public/i18n/`,

	// ENV PROPS
	TOKEN: p.TOKEN,
	LOG_LEVEL: p.LOG_LEVEL ?? (p.NODE_ENV === 'production' ? 'info' : 'debug'),
	CLIENT_ID: p.CLIENT_ID,
	GUILD_ID: p.GUILD_ID,

	// Roles
	CLOSE_CMD_PERMISSION_ROLE_IDS:
		p.CLOSE_CMD_PERMISSION_ROLE_IDS?.split(',') ?? [],
	BOT_DEV_ROLE_ID: p.BOT_DEV_ROLE_ID,
	MOD_ROLE_ID: p.MOD_ROLE_ID,
	MODPING_ROLE_ID: p.MODPING_ROLE_ID,
	MODPING_WEST_AMERICAS_ROLE_ID: p.MODPING_WEST_AMERICAS_ROLE_ID,
	MODPING_EAST_AMERICAS_ROLE_ID: p.MODPING_EAST_AMERICAS_ROLE_ID,
	MODPING_EUROPE_AFRICA_ROLE_ID: p.MODPING_EUROPE_AFRICA_ROLE_ID,
	MODPING_MIDDLE_EAST_INDIA_ROLE_ID: p.MODPING_MIDDLE_EAST_INDIA_ROLE_ID,
	MODPING_ASIA_PACIFIC_ROLE_ID: p.MODPING_ASIA_PACIFIC_ROLE_ID,

	// Channels
	BOT_LOG_CHANNEL_ID: p.BOT_LOG_CHANNEL_ID,
	GIFTCODES_CHANNEL_IDS: p.GIFTCODES_CHANNEL_IDS?.split(',') ?? [],
	CLOSE_CHANNEL_IDS: p.CLOSE_CHANNEL_IDS?.split(',') ?? [],
	GR_CHANNEL_ID: p.GR_CHANNEL_ID,
	BUGREPORT_CHANNEL_ID: p.BUGREPORT_CHANNEL_ID,
	ANNOUNCEMENTS_CHANNEL_IDS: p.ANNOUNCEMENTS_CHANNEL_IDS?.split(',') ?? [],
}
