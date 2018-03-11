import React, { Component } from 'react'
import Glaemscribe from '../../vendor/build/glaemscribe'
import './Tengwar.scss'

Glaemscribe.resource_manager.load_modes()
Glaemscribe.resource_manager.load_charsets()
if (!window.Glaemscribe) window.Glaemscribe = Glaemscribe;

const CHARSETS = {
  annatar: "tengwar_ds_annatar",
  cirth: "cirth_ds",
  eldamar: "tengwar_ds_eldamar",
  elfica: "tengwar_ds_elfica",
  freemono: "tengwar_freemono",
  gothic: "unicode_gothic",
  parmaite: "tengwar_ds_parmaite",
  runes: "unicode_runes",
  sarati: "sarati_eldamar",
  sindarin: "tengwar_ds_sindarin",
}

export default class Tengwar extends Component {
  static defaultProps = {
    charset: 'elfica',
    language: 'quenya',
    tagName: 'span',
  }

  componentWillMount = () => { this.updateParsers(this.props) }
  componentWillReceiveProps = (props) => { this.updateParsers(props) }

  updateParsers = ({ charset, language }) => {
    this.language = Glaemscribe.resource_manager.loaded_modes[language]

    let charsets = Object.keys(Glaemscribe.resource_manager.loaded_charsets)
    if (this.language) charsets = Object.keys(this.language.supported_charsets)

    if (charsets.includes(charset)) {
      this.charset = Glaemscribe.resource_manager.loaded_charsets[charset]
      this.charsetName = charset
    } else {
      this.charset = Glaemscribe.resource_manager.loaded_charsets[charsets[0]]
      this.charsetName = charsets[0]
    }
  }

  transcribe = (text) => this.language ? this.language.transcribe(text, this.charset) : text
  renderTextNodes = () => {
    const { children = [] } = this.props
    const nodes = typeof children === 'string' ? [children] : Array.from(children)
    return nodes.map(child => {
      if (typeof child !== 'string') return child
      let [success, transcription, context] = this.transcribe(child)
      if (success) return transcription
      return child
    })
  }
  render = () => {
    const { children, language, tagName: Tag } = this.props
    return (
      <Tag className={`tengwar ${language} ${this.charsetName}`}>
        {this.renderTextNodes()}
      </Tag>
    )
  }
}
