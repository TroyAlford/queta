import type * as Glaemscribe from 'glaemscribe'
import React, { Component } from 'react'

type TProps = {
	className?: string,
	language?: string,
	typeface?: string,
	writing?: Glaemscribe.Writing,
}

type TState = {
	loading: boolean,
}

export class Tengwar extends Component<TProps, TState> {
	private static dependencies = Promise.all([
		import('../../temp/glaemscribe.built.js').then(module => {
			const processor = module.default as Glaemscribe.default

			const manager = processor.resource_manager
			manager.load_charsets()
			manager.load_modes()
			Tengwar.charsets = Array.from(Object.values(manager.loaded_charsets))
			Tengwar.modes = Array.from(Object.values(manager.loaded_modes))

			return processor
		}),
		import('./Tengwar.scss'),
		import('../../temp/glaemscribe.built.scss'),
	])

	public static defaultProps: TProps = {
		language: 'quenya-tengwar-classical',
		typeface: 'tengwar_guni_sindarin',
		writing: 'Tengwar',
	}
	public static modes: Glaemscribe.Mode[] = []
	public static charsets: Glaemscribe.Charset[] = []

	public state: TState = {
		loading: !window.Glaemscribe,
	}

	componentDidMount = (): void => {
		if (this.state.loading) {
			Tengwar.dependencies.then(() => this.setState({ loading: false }))
		}
	}

	get charset(): Glaemscribe.Charset | undefined {
		const { mode } = this
		if (!mode) return undefined

		const charsets = mode.supported_charsets || {}
		return charsets[this.props.typeface] ?? mode.default_charset
	}
	get mode(): Glaemscribe.Mode | undefined {
		return Tengwar.modes.find(m => m.name === this.props.language)
	}
	get typeface(): string { return this.charset?.name }

	#renderChildren = (children: React.ReactNode): React.ReactChild[] => (
		(React.Children.toArray(children) as React.ReactChild[]).map((child, index) => {
			if (typeof child === 'string') {
				const [success, transcription] = this.#renderText(child)
				if (success) { return transcription }
			} else if (typeof child === 'number') {
				return child
			} else if (child?.props?.children) {
				const grandChildren = child.props.children
				const Type = child.type
				return (
					<Type key={index} {...child.props}>
						{this.#renderChildren(
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
	#renderText = (text: string): string => this.mode?.transcribe(text, this.charset) ?? text

	render = (): JSX.Element => {
		const { children, className } = this.props
		const { loading } = this.state
		const classes = [
			'glaemscribe',
			className,
			...(loading ? ['loading'] : [this.typeface, this.mode?.name]),
		].filter(Boolean).join(' ')

		if (loading) { return <div className={classes} /> }

		return (
			<div className={classes}>
				{(
					this.mode
						? this.#renderChildren(children)
						: children
				)}
			</div>
		)
	}
}

window.Tengwar = Tengwar
