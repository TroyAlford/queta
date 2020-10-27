import { shallow } from 'enzyme'
import React from 'react'
import { Queta } from './Queta'

const classString = (language, writing, typeface) => (
	`glaemscribe language-${language} writing-${writing} typeface-${typeface}`
)

describe('Queta', () => {
	test('defaults to quenya|Queta|elfica', () => {
		const wrapper = shallow(<Queta />)
		expect(wrapper.html()).toMatchSnapshot()
	})

	test('transpiles single child string contents', () => {
		const wrapper = shallow(<Queta>Minas Tirith</Queta>)
		expect(wrapper.html()).toMatchSnapshot()
	})

	test('transpiles nested children & their contents', () => {
		const wrapper = shallow(
			<Queta>
				Minas Tirith
				<i>Ost Valaron</i>
				<b>Anduin</b>
				Minas Valaron
			</Queta>,
		)
		expect(wrapper.html()).toMatchSnapshot()
	})
})
