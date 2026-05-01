import { ParameterDecoratorEx, SlashChoice, SlashChoiceType } from 'discordx'
import { I18nSlashChoiceTypeOptions } from '../types/slash.i18n.types.js'
import { DiscordI18nCommandsUtils } from '../../../../services/utils/discord-i18n-commands.utils.service.js'

function I18nSlashChoice<T extends string, X = string | number>(
	options: I18nSlashChoiceTypeOptions<T, X>
): ParameterDecoratorEx {
	const choices: SlashChoiceType<T, X>[] =
		DiscordI18nCommandsUtils.generateChoicesTranslation(options)
	return SlashChoice(...choices)
}

export { I18nSlashChoice }
