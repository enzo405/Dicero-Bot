import { LocaleString } from 'discord.js'
import {
	ApplicationCommandOptions,
	SlashChoiceType,
	SlashOptionOptions,
} from 'discordx'

type I18nBotTranslateOptions<TD extends string> = {
	translateLanguages?: LocaleString[]
	defaultLanguage?: string
	description: TD
}

type I18nApplicationCommandOptions<T extends string, TD extends string> = Omit<
	ApplicationCommandOptions<T, TD>,
	'description' | 'descriptionLocalizations' | 'nameLocalizations'
> &
	I18nBotTranslateOptions<TD>

type I18nSlashOptionOptions<T extends string, TD extends string> = Omit<
	SlashOptionOptions<T, TD>,
	'description' | 'descriptionLocalizations' | 'nameLocalizations'
> &
	I18nBotTranslateOptions<TD>

type I18nSlashChoiceTypeOptions<
	T extends string = string,
	X = string | number,
> = Omit<SlashChoiceType, 'name' | 'nameLocalizations' | 'value'> & {
	prefixTranslate: T
	values: X[]
} & Omit<I18nBotTranslateOptions<T>, 'description'>

export {
	I18nBotTranslateOptions,
	I18nApplicationCommandOptions,
	I18nSlashOptionOptions,
	I18nSlashChoiceTypeOptions,
}
