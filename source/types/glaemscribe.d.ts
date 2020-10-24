declare module 'glaemscribe' {
	export type VirtualClass = {
		target: string,
		triggers: string[],
	}

	export type Char = {
		charset: Charset,
		code: number,
		line: number,
		names: string[],
		str: string,
	}

	export type VirtualChar = {
		charset: Charset,
		classes: VirtualClass[],
		default: null,
		line: number,
		lookup_table: Record<string, Char>,
		names: string[],
		reversed: boolean,
	}

	export type Charset = {
		chars: Charset[],
		errors: never[],
		lookup_table: Record<string, Char>,
		virtual_chars: VirtualChar[],
		name: string,
	}

	export type Option = {
		default_value_name: string,
		is_radio: boolean,
		line: number,
		mode: Mode,
		name: string,
		type: 'ENUM' | 'BOOL',
		value_to_names: Record<number, string>,
		values: Record<string, number>,
		visibility: string | null,
	}

	export type Mode = {
		authors: string,
		current_tts_voice: null,
		default_charset: Charset,
		errors: any[],
		has_tts: false
		human_name: string,
		invention: 'experimental' | 'historical' | 'jrrt',
		language: string,
		latest_option_values: Record<string, Option>,
		name: string,
		options: Record<string, boolean | number>,
		supported_charsets: Record<string, Charset>,
		version: string,
		world: World,
		writing: Writing,
		// post_processor: any,
		// pre_processor: any,
		// processor: any,
		// raw_mode_name: string,
	}

	export type World = 'arda' | 'other_world' | 'primary' | 'primary_related_to_arda'
	export type Writing = 'Cirth' | 'Gothic Alphabet' | 'Runes' | 'Sarati' | 'Tengwar'
}
