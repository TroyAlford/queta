import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Tengwar } from '../source/components/Tengwar'

ReactDOM.render(
	<Tengwar>
		Ai ! laurië lantar lassi súrinen ,
		yéni únótimë ve rámar aldaron !
		Yéni ve lintë yuldar avánier
		mi oromardi lissë-miruvóreva
		Andúnë pella , Vardo tellumar
		nu luini yassen tintilar i eleni
		ómaryo airetári-lírinen .

		Sí man i yulma nin enquantuva ?
	</Tengwar>,
	document.querySelector('#root'),
)
