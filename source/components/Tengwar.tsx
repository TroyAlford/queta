import type * as Glaemscribe from 'glaemscribe'
import React, { Component } from 'react'
// import GS from '../../temp/glaemscribe.built'

// GS.resource_manager.load_modes()
// GS.resource_manager.load_charsets()

// const modes = GS.resource_manager.loaded_modes
// export const MODES = Object.values(modes)
// 	.map(mode => ({
// 		charsets: mode.supported_charsets,
// 		humanName: mode.human_name,
// 		language: mode.language,
// 		name: mode.name,
// 		transcriber: modes[mode.name],
// 		writing: mode.writing,
// 	}))
// window.Glaemscribe = GS
// window.MODES = MODES

type TProps = {
	charset?: string,
	className?: string,
	language?: string,
	writing?: string,
}

type TState = {
	loading: boolean,
}

export class Tengwar extends Component<TProps, TState> {
	private static dependencies = Promise.all([
		import('../../temp/glaemscribe.built').then(module => {
			window.Glaemscribe = module.default
			window.Glaemscribe.resource_manager.load_charsets()
			window.Glaemscribe.resource_manager.load_modes()
			return module.default as Glaemscribe.default
		}),
		import('../../temp/glaemscribe.built.scss'),
	])

	static defaultProps: TProps = {
		charset: 'tengwar_guni_sindarin',
		language: 'quenya-tengwar-classical',
		writing: 'Tengwar',
	}

	#modes: Array<Glaemscribe.Mode> = []

	state: TState = {
		loading: !window.Glaemscribe,
	}

	componentDidMount = (): void => {
		if (this.state.loading) {
			Tengwar.dependencies.then(() => {
				this.#modes = Array.from(Object.values(window.Glaemscribe.resource_manager.loaded_modes))
				this.setState({ loading: false })
			})
		}
	}

	get mode(): Glaemscribe.Mode | undefined {
		return (
			this.#modes.find(m => m.name === this.props.language && m.writing === this.props.writing)
			|| this.#modes.find(m => m.name === this.props.language)
			|| this.#modes[0]
		)
	}
	get charset(): Glaemscribe.Charset | undefined {
		const charsets = this.mode?.supported_charsets || {}
		return charsets[this.props.charset] ?? Object.values(charsets)[0]
	}

	transcribe = (text: string): string => this.mode?.transcribe(text, this.charset) ?? text
	transcribeChildren = (children: React.ReactNode): React.ReactChild[] => (
		(React.Children.toArray(children) as React.ReactChild[]).map((child, index) => {
			if (typeof child === 'string') {
				const [success, transcription] = this.transcribe(child)
				if (success) {
					return transcription
				}
			} else if (typeof child === 'number') {
				return child
			} else if (child?.props?.children) {
				const grandChildren = child.props.children
				const Type = child.type
				return (
					<Type key={index} {...child.props}>
						{this.transcribeChildren(
							Array.isArray(grandChildren)
								? grandChildren
								: [grandChildren],
						)}
					</Type>
				)
			}

			return child
		})
	)
	render = (): JSX.Element => {
		const { className } = this.props
		const { loading } = this.state
		const classes = [
			'glaemscribe', 'glaemfont',
			'tengwar-annatar-bold-glaemunicode',
			className,
			loading ? 'loading' : null,
		].filter(Boolean)

		return (
			<div className={classes.join(' ')}>
				{(loading
					? <div className="loading" />
					: this.transcribeChildren(this.props.children)
				)}
			</div>
		)
	}
}
