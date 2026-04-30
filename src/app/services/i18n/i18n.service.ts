import { i18n } from 'i18next'
import { Singleton } from '../../decorators/singleton.decorator.js'
import { getI18nInstance } from './i18n.init.service.js'

interface ITranslateOptions {
	lng: string
	[key: string]: any
}

@Singleton({ name: 'i18n' })
class I18nService {
	private i18nextInstance: i18n

	public constructor() {
		this.i18nextInstance = getI18nInstance()
	}

	public changeLanguage(language: string): void {
		this.i18nextInstance.language = language
	}

	public translate(key: string, options: ITranslateOptions): string {
		return this.i18nextInstance.t(key, options) as string
	}
}

const staticI18n = new I18nService()

export { I18nService, ITranslateOptions, staticI18n }
