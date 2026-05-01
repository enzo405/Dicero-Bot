import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	MessageActionRowComponentBuilder,
} from 'discord.js'

export class ButtonRowBuilder {
	private readonly rows: Array<Array<ButtonBuilder>> = [[]]

	private constructor() {}

	public static create(): ButtonRowBuilder {
		return new ButtonRowBuilder()
	}

	public addButtons(
		items: Array<{ id?: string; name: string; style?: ButtonStyle }>,
		defaultStyle: ButtonStyle = ButtonStyle.Primary,
		prefix: string = 'button'
	): this {
		const buttons = items.map((item) => {
			return new ButtonBuilder()
				.setCustomId(`${prefix}-${item.id ?? item.name}`)
				.setLabel(item.name)
				.setStyle(item.style ?? defaultStyle)
		})

		this.rows[this.rows.length - 1].push(...buttons)
		return this
	}

	public newRow(): this {
		this.rows.push([])
		return this
	}

	public build(): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
		return this.rows
			.filter((row) => row.length > 0)
			.map((row) =>
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
					...row
				)
			)
	}
}
