import i18next, { i18n, InitOptions } from 'i18next'
import * as fs from 'fs'
import * as path from 'path'
import { config } from '../../config/config.js'

let initialized = false

const loadTranslations = (): { [key: string]: any } => {
	const translations: { [key: string]: any } = {}
	const localesPath = path.join(config.LOCALES_FOLDER)
	const dirents = fs.readdirSync(localesPath, { withFileTypes: true })
	const dirNames = dirents
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)

	for (const dir of dirNames) {
		const localeFilePath = path.join(localesPath, dir, 'translation.json')
		const fileContent = JSON.parse(fs.readFileSync(localeFilePath, 'utf8'))
		translations[dir] = { translation: fileContent }
	}
	return translations
}

const initializeI18n = async (options: InitOptions): Promise<void> => {
	if (!initialized) {
		await i18next.init(options)
		initialized = true
	}
}

const getI18nInstance = (): i18n => {
	initializeI18n({
		fallbackLng: 'en',
		supportedLngs: ['fr', 'en', 'zh-CN'],
		resources: loadTranslations(),
		interpolation: {
			escapeValue: false,
		},
	}).then(() => {})
	return i18next
}

export { getI18nInstance }
