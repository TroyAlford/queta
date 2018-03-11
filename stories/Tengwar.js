import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, select, text } from '@storybook/addon-knobs/react'
import Tengwar from '../source/components/Tengwar'

const stories = storiesOf('Tengwar', module)

stories.addDecorator(withKnobs)

const LANGUAGES = {
  'adunaic': 'Adûnaic',
  'blackspeech': 'Black Speech',
  'quenya': 'Quenya',
  'sindarin': 'Sindarin',
  'telerin': 'Telerin',
}

stories.add('quenya basic example', () => (
  <Tengwar
    language={select('Language', LANGUAGES, 'Quenya', 'foo')}
    children={text('Text', 'An Elven Phrase', 'foo')}
  />
))
