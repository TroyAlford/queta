import type * as Glaemscribe from 'glaemscribe'

declare global {
	interface Window {
		Glaemscribe: Glaemscribe.default,
	}
}
