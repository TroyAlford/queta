import type * as Glaemscribe from 'glaemscribe'
import React, { Component } from 'react'
import type {
	ITranslator,
	resolve as resolveFn,
	translate as translateFn,
} from '../translate/translate'

type TProps = {
	className?: string,
	language?: string,
	typeface?: string,
	writing?: Glaemscribe.Writing,
}

type TState = {
	loading: boolean,
	resolve?: typeof resolveFn,
	translate?: typeof translateFn,
}

export class Queta extends Component<TProps, TState> {
	private static dependencies = import(/* webpackChunkName: 'translate' */ '~/translate/translate')
		.then(module => module.dependencies.then(() => ({
			resolve: module.resolve,
			translate: module.translate,
		})))

	#loading = Queta.dependencies.then(({ resolve, translate }) => {
		this.setState({ loading: false, resolve, translate })
	})

	public static defaultProps: TProps = {
		language: 'quenya-tengwar-classical',
		typeface: 'tengwar_guni_annatar',
		writing: 'Tengwar',
	}
	public state: TState = {
		loading: true,
	}

	#renderChildren = (children: React.ReactNode): React.ReactChild[] => (
		(React.Children.toArray(children) as React.ReactChild[]).map((child, index) => {
			if (typeof child === 'string') {
				const { language, typeface } = this.props
				const { success, translation } = this.state.translate(child, language, typeface)
				if (success) { return translation }
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

	render = (): JSX.Element => {
		const { children, className, language, typeface } = this.props
		const { loading, resolve } = this.state
		const { charset, mode } = loading ? {} as ITranslator : resolve(language, typeface)

		const classes = [
			'queta',
			className,
			mode?.name,
			charset?.name,
			loading && 'loading',
		].filter(Boolean).join(' ')

		return (
			<div className={classes}>
				{!loading && this.#renderChildren(children)}
			</div>
		)
	}
}

export default Queta // eslint-disable-line
