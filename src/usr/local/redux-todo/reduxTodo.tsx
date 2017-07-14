import * as React from 'react'
import { render } from 'react-dom'
import { App } from './App'
document.addEventListener('DOMContentLoaded', () => {
	const div = document.createElement('div')
	document.body.appendChild(div)
	render(<App />, div)
})
