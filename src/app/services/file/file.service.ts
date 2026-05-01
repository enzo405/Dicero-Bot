import path from 'path'
import { promises as fs } from 'fs'
import { logger } from '../logger/logger.service.js'

export class FileService {
	private static async openFile(
		path: any,
		encoding: BufferEncoding = 'utf8'
	): Promise<string | undefined> {
		try {
			return await fs.readFile(path, encoding)
		} catch (err) {
			logger.error(`Error reading file ${path}: ${err}`)
			return undefined
		}
	}

	private static async writeFile(
		path: any,
		content: any,
		encoding: BufferEncoding = 'utf8'
	): Promise<void> {
		try {
			await fs.writeFile(path, content, encoding)
		} catch (err) {
			logger.error(`Error writing file ${path}: ${err}`)
		}
	}

	public static generateFilePath(folder: string, filename: string): string {
		return path.join(folder, filename)
	}

	public static async openJsonFile<T>(
		folder: string,
		filename: string,
		encoding: BufferEncoding = 'utf8'
	): Promise<T> {
		const content = await FileService.openFile(
			FileService.generateFilePath(folder, filename),
			encoding
		)
		return JSON.parse(content ?? '{}')
	}

	public static async openCsvFile(
		folder: string,
		filename: string,
		delimiter: string,
		encoding: BufferEncoding = 'utf8'
	): Promise<string[][]> {
		const content = await FileService.openFile(
			FileService.generateFilePath(folder, filename),
			encoding
		)
		return (content ?? '')
			.split('\n') // split string to lines
			.map((e) => e.trim()) // remove white spaces for each line
			.map((e) => e.split(delimiter).map((e) => e.trim()))
	}

	public static async saveJsonFile<T>(
		folder: string,
		filename: string,
		content: T,
		encoding: BufferEncoding = 'utf8'
	): Promise<void> {
		await FileService.writeFile(
			FileService.generateFilePath(folder, filename),
			JSON.stringify(content, null, 2),
			encoding
		)
	}
}
