interface SingletonOptions {
	verbose?: boolean
	name: string
}
function Singleton(options?: SingletonOptions) {
	return function <T extends new (...args: any[]) => any>(ctr: T): T {
		let instance: T

		return class {
			constructor(...args: any[]) {
				if (instance) {
					if (options?.verbose) {
						console.warn(
							`You cannot instantiate a singleton twice : ${options?.name ?? ''}`
						)
					}

					return instance
				}

				instance = new ctr(...args)

				if (options?.verbose) {
					console.debug(
						`Instantiate a singleton ${options?.name ?? ''}`
					)
				}

				return instance
			}
		} as T
	}
}

export { Singleton, SingletonOptions }
