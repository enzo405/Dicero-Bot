import {
	ApplicationCommandOptions,
	MethodDecoratorEx,
	NotEmpty,
	Slash,
	VerifyName,
} from 'discordx'

import { I18nApplicationCommandOptions } from '../types/slash.i18n.types.js'
import { DiscordI18nCommandsUtils } from '../../../../services/utils/discord-i18n-commands.utils.service.js'

function I18nSlash<T extends string, TD extends string>(
	options: I18nApplicationCommandOptions<VerifyName<T>, NotEmpty<TD>>
): MethodDecoratorEx {
	const optionsToUse: ApplicationCommandOptions<
		VerifyName<T>,
		NotEmpty<TD>
	> = {
		...options,
		...DiscordI18nCommandsUtils.generateTranslation(options),
	}
	return Slash(optionsToUse)
}

export { I18nSlash }
