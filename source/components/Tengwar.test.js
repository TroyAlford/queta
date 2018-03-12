import React from 'react'
import Tengwar from './Tengwar'
import { shallow } from 'enzyme'

const classString = (language, writing, typeface) => (
  `glaemscribe language-${language} writing-${writing} typeface-${typeface}`
)

describe('tengwar', () => {
  it('defaults to quenya|tengwar|elfica', () => {
    const wrapper = shallow(<Tengwar />)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('transpiles single child string contents', () => {
    const wrapper = shallow(<Tengwar>Minas Tirith</Tengwar>)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('transpiles nested children & their contents', () => {
    const wrapper = shallow(
      <Tengwar>
        Minas Tirith
        <i>Ost Valaron</i>
        <b>Anduin</b>
        Minas Valaron
      </Tengwar>
    )
    expect(wrapper.html()).toMatchSnapshot()
  })
})
