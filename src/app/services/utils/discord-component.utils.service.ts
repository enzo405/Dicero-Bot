import { APIEmbedField, AttachmentBuilder } from 'discord.js'
import { ImageService } from '../image/image.service.js'
import path from 'path'

export class DiscordComponentUtils {
	public static createEmbedBoldUnderlinedField(content: any): APIEmbedField {
		return {
			name: '\u200b',
			value: `**__${content}__**`,
		}
	}

	public static async createAnAttachmentImage(
		imagePath: string,
		compressRatio: number = 70,
		resizeHeight: number = 64
	): Promise<AttachmentBuilder> {
		const imageName = path.basename(imagePath)

		const imageService = new ImageService()
		const compressedImage = await imageService
			.loadImage(imagePath)
			.then((service) => service.resize(resizeHeight))
			.then((service) => service.compress(compressRatio))
			.then((service) => service.toBuffer())

		return new AttachmentBuilder(compressedImage, {
			name: imageName,
		})
	}

	public static async createUncompressAttachmentImage(
		imagePath: string
	): Promise<AttachmentBuilder> {
		const imageName = path.basename(imagePath)

		const imageService = new ImageService()
		const image = await imageService
			.loadImage(imagePath)
			.then((service) => service.toBuffer())

		return new AttachmentBuilder(image, {
			name: imageName,
		})
	}
}
