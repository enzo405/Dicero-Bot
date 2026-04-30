import { LocaleString, LocalizationMap } from 'discord.js'
import {
	I18nBotTranslateOptions,
	I18nSlashChoiceTypeOptions,
} from '../../decorators/i18n/discord/types/slash.i18n.types.js'
import { staticI18n } from '../i18n/i18n.service.js'
import { NotEmpty, SlashChoiceType } from 'discordx'
import { DEFAULT_DISCORD_LANGUAGE } from './discord.utils.service.js'

export class DiscordI18nCommandsUtils {
	public static generateTranslation<TD extends string>(
		i18nOptions: I18nBotTranslateOptions<NotEmpty<TD>>
	): {
		description: NotEmpty<TD>
		descriptionLocalizations?: LocalizationMap
	} {
		const result: {
			description: NotEmpty<TD>
			descriptionLocalizations?: LocalizationMap
		} = { description: i18nOptions.description }

		const defaultLanguage =
			i18nOptions?.defaultLanguage ?? DEFAULT_DISCORD_LANGUAGE

		result.description = staticI18n.translate(
			i18nOptions.description as string,
			{
				lng: defaultLanguage,
			}
		) as NotEmpty<TD>

		if (
			i18nOptions?.translateLanguages &&
			i18nOptions?.translateLanguages?.length > 0
		) {
			result.descriptionLocalizations = {}

			for (const locale of i18nOptions.translateLanguages) {
				result.descriptionLocalizations[locale] = staticI18n.translate(
					i18nOptions.description as string,
					{
						lng: locale,
					}
				)
			}
		}

		return result
	}

	public static generateChoicesTranslation<
		T extends string,
		X = string | number,
	>(i18nOptions: I18nSlashChoiceTypeOptions<T, X>): SlashChoiceType<T, X>[] {
		const defaultLanguage =
			i18nOptions?.defaultLanguage ?? DEFAULT_DISCORD_LANGUAGE

		const choices: SlashChoiceType<T, X>[] = i18nOptions.values.map(
			(value) => {
				const key = `${value}`.toLowerCase()
				const translationKey = `${i18nOptions.prefixTranslate}.${key}`

				return this.generateChoiceTranslation(
					translationKey,
					value,
					defaultLanguage,
					i18nOptions?.translateLanguages
				)
			}
		)

		return choices
	}

	private static generateChoiceTranslation<
		T extends string,
		X = string | number,
	>(
		translationKey: string,
		value: X,
		defaultLanguage: string,
		translateLanguages?: LocaleString[]
	): SlashChoiceType<T, X> {
		let nameLocalizations: LocalizationMap | undefined = undefined

		if (translateLanguages && translateLanguages?.length > 0) {
			nameLocalizations = {}
			for (const locale of translateLanguages) {
				nameLocalizations[locale] = staticI18n.translate(
					translationKey,
					{
						lng: locale,
					}
				)
			}
		}

		return {
			name: staticI18n.translate(translationKey, {
				lng: defaultLanguage,
			}) as NotEmpty<T>,
			nameLocalizations,
			value,
		}
	}
}
