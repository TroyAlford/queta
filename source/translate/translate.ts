import type * as Glaemscribe from 'glaemscribe'

export interface ITranslator {
	charset: Glaemscribe.Charset,
	mode: Glaemscribe.Mode,
}

export interface ITranslation {
	success: boolean,
	text: string,
	translation: string,
}

let glaemscribe: Glaemscribe.default = null
let modes: Glaemscribe.Mode[] = []

export const dependencies = Promise.all([
	import(
		/* webpackChunkName: 'glaemscribe' */ '../../temp/glaemscribe.js'
	) as Promise<{ default: Glaemscribe.default }>,
	import(/* webpackChunkName: 'styles' */ '../../temp/glaemscribe.scss'),
]).then(([{ default: gs }]) => {
	glaemscribe = gs
	glaemscribe.resource_manager.load_charsets()
	glaemscribe.resource_manager.load_modes()

	modes = Array.from(Object.values(glaemscribe.resource_manager.loaded_modes))
})

export const resolve = (language: string, typeface?: string): ITranslator => {
	const mode = modes.find(m => m.name === language)
	if (!mode) return { charset: null, mode: null }

	return {
		charset: mode.supported_charsets[typeface] ?? mode.default_charset,
		mode,
	}
}

export const translate = (
	text: string,
	language: string,
	typeface?: string,
): ITranslation => {
	const { charset, mode } = resolve(language, typeface)
	if (!mode) {
		return { success: false, text, translation: null }
	}

	const [success, transcription] = mode.transcribe(text, charset)

	return { success, text, translation: transcription }
}
