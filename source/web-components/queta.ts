import type * as Glaemscribe from 'glaemscribe'
import type {
	ITranslator,
	resolve as resolveFn,
	translate as translateFn,
} from '../translate/translate'

class Component extends HTMLElement {
	private static dependencies = import('~/translate/translate')
		.then(module => module.dependencies.then(() => ({
			resolve: module.resolve,
			translate: module.translate,
		})))

	#load = Component.dependencies.then(({ resolve, translate }) => {
		this.#loading = false
		this.#resolve = resolve
		this.#translate = translate
	})
	#loading: boolean = true
	#resolve: typeof resolveFn
	#translate: typeof translateFn

	constructor() {
		super()
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.#render()
	}

	// #renderChildren = (node: Element, language?: string, typeface?: string): HTMLCollection => {
	// 	Array.from(node.children).forEach((child, index) => {
	// 		switch (child.nodeType) {
	// 			case Node.TEXT_NODE:
	// 				const { success, translation } = this.#translate(child.innerText, language, typeface)
	// 				if (success) {
	// 					child.parentElement.innerText = translation
	// 				}
	// 		}
	// 		// } else if (typeof child === 'number') {
	// 		// 	return child
	// 		// } else if (child?.props?.children) {
	// 		// 	const grandChildren = child.props.children
	// 		// 	const Type = child.type
	// 		// return (
	// 		// 	<Type key={index} {...child.props}>
	// 		// 		{this.#renderChildren(
	// 		// 			Array.isArray(grandChildren)
	// 		// 				? grandChildren
	// 		// 				: [grandChildren],
	// 		// 		)}
	// 		// 	</Type>
	// 		// )
	// 		// }
	// 	})
	// }

	#render = (): void => {
		const className = this.getAttribute('class') ?? ''
		const language = this.getAttribute('lang') ?? ''
		const typeface = this.getAttribute('typeface') ?? ''
		const { charset, mode } = this.#loading
			? {} as ITranslator
			: this.#resolve(language, typeface)

		this.className = [
			'queta',
			className,
			mode?.name,
			charset?.name,
			this.#loading && 'loading',
		].filter(Boolean).join(' ')

		if (!this.#loading) {
			const { success, translation } = this.#translate(this.innerText, language, typeface)
			if (success) {
				this.innerText = translation
			}
		}

		// return (
		// 	<div className={classes}>
		// 		{!loading && this.#renderChildren(this)}
		// 	</div>
		// )
	}
}

window.customElements.define('queta-text', Component)
