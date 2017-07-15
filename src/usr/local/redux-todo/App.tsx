import * as React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { AppContent } from './AppContent'
class Todo {
	public complete: boolean
	public text: string
	public id: number
}
const initState = { state: 'uninit', todos: [] }
const reducer = (state = initState, action) => {
	const { todos = [] } = state
	todos as Todo[]
	switch (action.type) {
		case 'todo_init': return {
			state: 'init',
			todos: action.payload || [],
		}
		case 'todo_create': return {
			todos: [{
				id: todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
				text: action.payload.text,
				complete: true
			},
			...todos]
		}
		case 'todo_remove': return {
			todos: todos.filter(it => it.id !== action.payload)
		}
		case 'todo_toggle': return {
			todos: todos.map(todo => {
				return todo.id === action.payload ?
					{ ...todo, complete: !todo.complete } :
					{ ...todo }
			})
		}
		default: return {
			...state
		}
	}
}
function loadReducer(state = false, action) {
	switch (action.type) {
		case 'loading_start': return true
		case 'loading_finish': return false
		default: return state

	}
}
const store = createStore(combineReducers({
	todo: reducer,
	loading: loadReducer
}), applyMiddleware(thunk))

export const App = () => (
	<Provider store={store}>
		<AppContent />
	</Provider>
)
