import {
	NotEmpty,
	ParameterDecoratorEx,
	SlashOption,
	SlashOptionOptions,
	VerifyName,
} from 'discordx'
import { DiscordI18nCommandsUtils } from '../../../../services/utils/discord-i18n-commands.utils.service.js'
import { I18nSlashOptionOptions } from '../types/slash.i18n.types.js'

function I18nSlashOption<T extends string, TD extends string>(
	options: I18nSlashOptionOptions<VerifyName<T>, NotEmpty<TD>>
): ParameterDecoratorEx {
	const optionsToUse: SlashOptionOptions<VerifyName<T>, NotEmpty<TD>> = {
		...options,
		...DiscordI18nCommandsUtils.generateTranslation(options),
	} as any

	return SlashOption(optionsToUse)
}

export { I18nSlashOption }
