import * as $ from 'jquery'
import * as React from 'react'
import { Component } from 'react'
import { connect, Provider } from 'react-redux'
import { createStore } from 'redux'
import { render } from 'react-dom'

$(start)
const store = createStore(function reducer(init: { num: number } = { num: 0 }, action) {
	switch (action.type) {
		case 'demo':
			return {
				num: init.num + 1
			}
		default:
			return init
	}
})
function start() {
	const div = document.createElement('div')
	document.body.appendChild(div)
	render(<Container />, div)
}
const Container = (props) => {
	return <Provider store={store}>
		<App> </App>
	</Provider>
}
function get() {
	return Promise.resolve(new Date())
}
async function getTime() {
	const time = await get()
	return time
}

@connect((state) => {
	return state
}, (dispatch) => {
	return {
	}
})
class App extends Component<any, any> {
	public render() {
		return <div>{this.props.num}</div>
	}
}
executor(console.log, 123)
function executor(op, ...data) {
	function defaultOp() {
		throw new Error('op error')
	}
	function wrapOp(newOp: any) {
		if (typeof newOp === 'function') {
			return newOp
		} else {
			return defaultOp
		}
	}
	return function execute() {
		return wrapOp(op)(...data)
	}
}

