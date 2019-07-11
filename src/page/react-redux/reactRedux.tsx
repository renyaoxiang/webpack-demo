import * as $ from "jquery";
import * as React from "react";
import { Component } from "react";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";
import { render } from "react-dom";

$(start);
const store = createStore(function reducer(
	init: any = { num: 0 },
	action: any
) {
	switch (action.type) {
		case "plus":
			return {
				num: init.num + action.value
			};
		default:
			return init;
	}
});
function start() {
	const div = document.createElement("div");
	document.body.appendChild(div);
	render(<Container />, div);
}
const Container = props => {
	const NewApp = connect(
		state => state,
		dispatch => ({
			change: value => {
				dispatch({
					type: "plus",
					value: value || 1
				});
			}
		})
	)(App);
	return (
		<Provider store={store}>
			<NewApp />
		</Provider>
	);
};

export class App extends Component<any, any> {
	private num: number = 0;
	render() {
		return (
			<div onClick={() => this.props.change(this.num++)}>
				{this.props.num}
			</div>
		);
	}
}
