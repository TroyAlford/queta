import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, select, text } from '@storybook/addon-knobs/react'
import Tengwar, { MODES } from '../source/components/Tengwar'

const stories = storiesOf('Tengwar', module)

stories.addDecorator(withKnobs)

const LANGUAGES = MODES.reduce((map, mode) => ({
  ...map,
  [mode.name]: mode.humanName
}), {})
const TYPEFACE_OPTIONS = {
  annatar: 'Tengwar Annatar',
  eldamar: 'Tengwar Eldamar',
  elfica: 'Tengwar Elfica',
  parmaite: 'Tengwar Parmaite',
  sindarin: 'Tengwar Sindarin',
}
const WRITING_OPTIONS = {
  cirth: 'Cirth',
  gothic: 'Gothic',
  runes: 'Runes',
  sarati: 'Sarati',
  tengwar: 'Tengwar',
}

const DEFAULT_TEXT =
  `Ai ! laurië lantar lassi súrinen ,
yéni únótimë ve rámar aldaron !
Yéni ve lintë yuldar avánier
mi oromardi lissë-miruvóreva
Andúnë pella , Vardo tellumar
nu luini yassen tintilar i eleni
ómaryo airetári-lírinen .

Sí man i yulma nin enquantuva ?`

stories.add('Full Example', () => (
  <Tengwar
    tagName="pre"
    children={text('Text', DEFAULT_TEXT, 'foo')}
    language={select('Language', LANGUAGES, 'quenya', 'foo')}
    typeface={select('Typeface', TYPEFACE_OPTIONS, 'eldamar', 'foo')}
    writing={select('Writing', WRITING_OPTIONS, 'tengwar', 'foo')}
    options={{
      always_use_romen_for_r: true,
      split_diphthongs: true,
    }}
  />
))
