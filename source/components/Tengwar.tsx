import React, { Component } from 'react'
import Glaemscribe from '../../temp/glaemscribe.built'

Glaemscribe.resource_manager.load_modes()
Glaemscribe.resource_manager.load_charsets()

const modes = Glaemscribe.resource_manager.loaded_modes
export const MODES = Object.values(modes)
	.map(mode => ({
		charsets: mode.supported_charsets,
		humanName: mode.human_name,
		language: mode.language,
		name: mode.name,
		transcriber: modes[mode.name],
		writing: mode.writing,
	}))
window.Glaemscribe = Glaemscribe
window.MODES = MODES

type TProps = {
	charset?: string,
	language?: string,
	writing?: string,
}

export class Tengwar extends Component<TProps> {
	styles = import('../../temp/glaemscribe.built.css')

	static defaultProps: TProps = {
		charset: 'tengwar_guni_sindarin',
		language: 'quenya-tengwar-classical',
		writing: 'Tengwar',
	}

	get language() {
		return (
			MODES.find(m => m.name === this.props.language && m.writing === this.props.writing)
			|| MODES.find(m => m.name === this.props.language)
			|| MODES[0]
		)
	}
	get charset() {
		const { language } = this
		return language.charsets[this.props.charset] ?? Object.values(language.charsets)[0]
	}

	transcribe = text => this.language.transcriber.transcribe(text, this.charset)
	transcribeChildren = (children: React.ReactChild[]): React.ReactChild[] => (
		children.map((child, index) => {
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
		console.log(this.language)

		const classes = [
			'glaemscribe', 'glaemfont',
			'tengwar-annatar-bold-glaemunicode',
		].filter(Boolean)

		return (
			<div className={classes.join(' ')}>
				{this.transcribeChildren(
					React.Children.toArray(this.props.children) as React.ReactChild[],
				)}
			</div>
		)
	}
}
