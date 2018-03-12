import React, { Component, Fragment } from 'react'
import Glaemscribe from '../../vendor/build/glaemscribe'
import './Tengwar.scss'

Glaemscribe.resource_manager.load_modes()
Glaemscribe.resource_manager.load_charsets()
if (!window.Glaemscribe) window.Glaemscribe = Glaemscribe;

const modes = Glaemscribe.resource_manager.loaded_modes
export const MODES = Object.values(modes)
  .map(mode => ({
    charsets: mode.supported_charsets,
    humanName: mode.human_name,
    language: mode.language,
    languageClass: `language-${mode.name}`,
    name: mode.name,
    writing: mode.writing,
    writingClass: `writing-${mode.writing.toLowerCase()}`,

    transcriber: modes[mode.name]
  }))

window.MODES = MODES;

export default class Tengwar extends Component {
  static defaultProps = {
    bold: false,
    italic: false,
    language: 'quenya',
    writing: 'Runes',
    tagName: 'span',
    typeface: 'elfica',
  }

  get language() {
    return (
      MODES.find(m => m.name === this.props.language && m.writing === this.props.writing) ||
      MODES.find(m => m.name === this.props.language) ||
      MODES[0]
    )
  }
  get charset() {
    return (
      this.language.charsets[this.props.charset] ||
      Object.values(this.language.charsets)[0]
    )
  }

  transcribe = (text) => this.language.transcriber.transcribe(text, this.charset)
  transcribeChildren = nodes => {
    const children = Array.isArray(nodes) ? nodes : [nodes]

    return children.map((child, index) => {
      if (typeof child === 'string') {
        const [success, transcription] = this.transcribe(child)
        if (success) return transcription
      }

      if (child && child.props && child.props.children) {
        const grandChildren = child.props.children
        const Type = child.type
        return (
          <Type key={index} {...child.props}>
            {this.transcribeChildren(Array.isArray(grandChildren) ? grandChildren : [grandChildren])}
          </Type>
        )
      }

      return child
    })
  }
  render = () => {
    const { bold, italic, children, tagName: Tag, typeface } = this.props
    const language = this.language
    const classes = [
      'glaemscribe',
      language.languageClass,
      language.writingClass,
      `typeface-${typeface}`,
      bold && 'bold',
      italic && 'italic',
    ].filter(Boolean)

    return (<Tag className={classes.join(' ')}>{this.transcribeChildren(children)}</Tag>)
  }
}
