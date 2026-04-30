import Jimp from 'jimp'

class ImageException extends Error {
	constructor(message: string, cause?: any) {
		super(message, cause)
	}
}

class ImageService {
	private imageToProcess: Jimp | null = null

	public async loadImage(path: string): Promise<this> {
		this.imageToProcess = await Jimp.read(path)
		return this
	}

	public async resize(height?: number, width?: number): Promise<this> {
		if (this.imageToProcess) {
			this.imageToProcess = this.imageToProcess.resize(
				width ?? Jimp.AUTO,
				height ?? Jimp.AUTO
			)
		}
		return this
	}

	public async compress(quality: number = 70): Promise<this> {
		if (this.imageToProcess) {
			this.imageToProcess = this.imageToProcess.quality(quality)
		}
		return this
	}

	public async toBuffer(): Promise<Buffer> {
		if (!this.imageToProcess) {
			throw new ImageException('No image to process loaded')
		}
		return this.imageToProcess.getBufferAsync(
			this.imageToProcess.getMIME() ?? Jimp.MIME_PNG
		)
	}
}

export { ImageService, ImageException }
