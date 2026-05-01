import { Transform } from 'stream'
import { Console } from 'console'
import { staticI18n } from '../i18n/i18n.service.js'

export class DataTableUtils {
	public static beautifulTable(
		data: any,
		overrideColumnName: { [key: string]: string },
		displayLanguage: string
	) {
		const ts = new Transform({
			transform(chunk, enc, cb) {
				cb(null, chunk)
			},
		})
		const logger = new Console({ stdout: ts as any })
		let newData = data || []
		let columnName = this.getTranslatedColumns(
			overrideColumnName || {},
			displayLanguage
		)
		if (data && data.length > 0) {
			if (Object.keys(columnName).length === 0) {
				columnName = {}
				Object.keys(data[0]).forEach((key) => {
					columnName[key] = key.charAt(0).toUpperCase() + key.slice(1)
				})
			}

			newData = data.map((d: any) => {
				const newObj = {} as any
				Object.keys(d).forEach((key) => {
					const newKey =
						columnName[key] ||
						key.charAt(0).toUpperCase() + key.slice(1)
					newObj[newKey] = d[key]
				})
				return newObj
			})
		}

		logger.table(newData)
		const table = (ts.read() || '').toString()
		let result = ''
		for (const row of table.split(/[\r\n]+/)) {
			let r = row.replace(/[^┬]*┬/, '┌')
			r = r.replace(/^├─*┼/, '├')
			r = r.replace(/│[^│]*/, '')
			r = r.replace(/^└─*┴/, '└')
			r = r.replace(/'/g, ' ')
			result += `${r}\n`
		}
		return result
	}

	private static getTranslatedColumns(
		columns: { [key: string]: string },
		displayLanguage: string
	): { [key: string]: string } {
		const newColumns = {} as { [key: string]: string }

		for (const key of Object.keys(columns)) {
			newColumns[key] = staticI18n.translate(columns[key], {
				lng: displayLanguage,
			})
		}

		return newColumns
	}
}
