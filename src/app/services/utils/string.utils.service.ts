export class StringUtils {
	public static compareString(
		a: string,
		b: string,
		order: string = 'asc'
	): number {
		if (order.toLowerCase() === 'asc') {
			return parseInt(a, 10) - parseInt(b, 10)
		}
		return parseInt(b, 10) - parseInt(a, 10)
	}

	public static mightToString(mightInString: string | number): string {
		const might = parseInt(`${mightInString}`, 10)
		if (might >= 1000) {
			return might.toLocaleString('en-US').replace(',', 'B')
		} else {
			return `${might}M `
		}
	}

	/**
	 * This method is used to sanitize a string so it doesn't break links when using markdown
	 * @param name The name (title) of the thread's post
	 * @returns
	 */
	public static sanitizeForMarkdown(value: string): string {
		// Si j'ai ( mais pas ) alors j'enlève (
		// Si j'ai ) mais pas ( alors j'enlève )
		// Si j'ai [ mais pas ] alors j'enlève [
		// Si j'ai ] mais pas [ alors j'enlève ]

		const openParenthesis = (value.match(/\(/g) || []).length
		const closeParenthesis = (value.match(/\)/g) || []).length
		const openBracket = (value.match(/\[/g) || []).length
		const closeBracket = (value.match(/\]/g) || []).length

		if (openParenthesis > closeParenthesis) {
			value = value.replace(/\(/g, '')
		}
		if (closeParenthesis > openParenthesis) {
			value = value.replace(/\)/g, '')
		}
		if (openBracket > closeBracket) {
			value = value.replace(/\[/g, '')
		}
		if (closeBracket > openBracket) {
			value = value.replace(/\]/g, '')
		}
		return value.trim()
	}
}
