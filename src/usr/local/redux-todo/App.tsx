import * as React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { AppContent } from './AppContent';

const store = createStore(function reducer(state, action) {
	console.log(action)
	return state
})

export const App = () => (
	<Provider store={store}>
		<AppContent />
	</Provider>
)
