import type { resolve as resolveFn, translate as translateFn } from '../translate/translate'

type TOptions = {
	bold?: boolean,
	defaultLanguage?: string,
	defaultTypeface?: string,
	italic?: boolean,
}

const defaultOptions: TOptions = {
	bold: false,
	defaultLanguage: 'quenya-tengwar-classical',
	defaultTypeface: 'tengwar_guni_annatar',
	italic: false,
}

function createComponent(options: TOptions) {
	const settings: TOptions = { ...defaultOptions, ...options }

	return class Component extends HTMLElement {
		private static dependencies = import('~/translate/translate')
			.then(module => module.dependencies.then(() => ({
				resolve: module.resolve,
				translate: module.translate,
			})))

		#loading: boolean
		#mutationObserver: MutationObserver
		#resolve: typeof resolveFn
		#translate: typeof translateFn

		#slot: HTMLSlotElement
		#span: HTMLSpanElement

		constructor() {
			super()
			const shadowRoot = this.attachShadow({ mode: 'closed' })
			this.#slot = Object.assign(document.createElement('slot'), { style: 'display: none;' })
			this.#span = document.createElement('span')
			shadowRoot.append(this.#slot, this.#span)

			this.#mutationObserver = new MutationObserver(() => this.#render())
			this.#mutationObserver.observe(this, {
				characterData: true, // changes to text content
				childList: true, // adding/removing child nodes
				subtree: true, // adding/removing grandchildren
			})

			Component.dependencies.then(({ resolve, translate }) => {
				this.#loading = false
				this.#resolve = resolve
				this.#translate = translate

				shadowRoot.appendChild(
					document.querySelector('link#queta-styles').cloneNode(),
				)
			})

			this.#loading = true
			this.#render()
			Component.dependencies.then(() => {
				this.#loading = false
				this.#render()
			})
		}

		attributeChangedCallback(name, oldValue, newValue) {
			if (['language', 'typeface'].includes(name) && oldValue !== newValue) {
				this.#render()
			}
		}

		#renderChildren = (
			source: Node,
			target: Node,
			language?: string,
			typeface?: string,
		): void => {
			Array.from(source.childNodes).forEach(child => {
				if (child instanceof Text) {
					const { success, translation } = this.#translate(child.data, language, typeface)
					target.appendChild(new Text(success ? translation : child.data))
				} else if (child.childNodes) {
					const clone = child.cloneNode(false)
					this.#renderChildren(child, clone, language, typeface)
					target.appendChild(clone)
				}
			})
		}

		#render = (): void => {
			if (this.#loading) {
				this.#span.innerHTML = ''
				this.#span.className = 'queta loading'
				return
			}

			const bold = this.getAttribute('bold') ?? settings.bold
			const italic = this.getAttribute('italic') ?? settings.italic

			const { charset, mode } = this.#resolve(
				this.getAttribute('language') ?? settings.defaultLanguage,
				this.getAttribute('typeface') ?? settings.defaultTypeface,
			)
			const language = mode?.name
			const typeface = charset?.name

			this.#span.innerHTML = ''
			this.#span.className = [
				'queta', language, typeface,
				bold && 'bold', italic && 'italic',
			].filter(Boolean).join(' ')
			this.#renderChildren(this, this.#span, language, typeface)
		}
	}
}

;([ // eslint-disable-line
	['queta', {}],
	['adunaic', { defaultTypeface: 'tengwar_guni_annatar' }],
	['blackspeech', { defaultTypeface: 'tengwar_guni_annatar', italic: true }],
	['khuzdul', { defaultLanguage: 'khuzdul-cirth-moria', defaultTypeface: 'cirth_ds' }],
	['runic', { defaultLanguage: 'old_norse-futhark-runicus', defaultTypeface: 'unicode_runes' }],
]).forEach(([elementName, options]: [string, TOptions]) => {
	window.customElements.define(`${elementName}-text`, createComponent(options))
})
