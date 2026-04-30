export type diff<T> = {
	added: Array<T>
	removed: Array<T>
}

export class ArrayUtils {
	public static removeItemAll<T>(arr: Array<T>, value: T) {
		let i = 0
		while (i < arr.length) {
			if (arr[i] === value) {
				arr.splice(i, 1)
			} else {
				++i
			}
		}
		return arr
	}

	public static diff<T>(oldList: Array<T>, newList: Array<T>): diff<T> {
		const added = newList.filter((e) => !oldList.includes(e))
		const removed = oldList.filter((e) => !newList.includes(e))
		return { added, removed }
	}
}
