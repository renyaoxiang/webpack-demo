import * as React from "react";
import { Component, KeyboardEvent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createAction } from "redux-actions";

export class AppContent2 extends Component<any, any> {
	private input: HTMLInputElement;
	constructor(props, context) {
		super(props, context);
	}
	public componentDidMount() {
		if (this.props.model.state === "uninit") {
			Promise.resolve([
				{
					id: 1,
					text: "test",
					complete: true
				}
			]).then(this.props.init);
		}
	}
	public render() {
		const readOnly = this.props.model.readOnly;
		return (
			<div>
				<div>
					<button onClick={this.doCreate} disabled={readOnly}>
						create
					</button>
					<button onClick={this.props.refresh} disabled={readOnly}>
						refresh
					</button>
				</div>
				<input
					type="input"
					disabled={readOnly}
					ref={ref => (this.input = ref)}
					onKeyUp={this.onKeyPress}
				/>
				<ul>
					{this.props.model.todos.map(it => {
						return (
							<li key={it.id}>
								<span
									style={{
										display: "inline-block",
										width: "50px"
									}}
								>
									{it.complete.toString()}
								</span>
								<button
									onClick={() => this.remove(it.id)}
									disabled={readOnly}
								>
									remove
								</button>
								<button
									onClick={() => this.toggle(it.id)}
									disabled={readOnly}
								>
									toggle
								</button>
								|{it.id}|{it.text}|
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
	private remove(id) {
		this.props.remove(id);
	}
	private toggle(id) {
		this.props.toggle(id);
	}
	private onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === 13) {
			this.doCreate();
		}
	};
	private doCreate = () => {
		const text = this.input.value;
		if (text) {
			this.input.value = "";
			this.props.create({ text });
		}
	};
}
const loadingStart = createAction("loading_start");
const loadingFinish = createAction("loading_finish");
const todoInit = createAction("todo_init", data => data);
export const AppContent = connect(
	state => ({
		model: {
			...state.todo,
			readOnly: state.loading
		}
	}),
	(dispatch, props: any) => ({
		...bindActionCreators(
			{
				init: todoInit,
				create: createAction("todo_create", data => data),
				toggle: createAction("todo_toggle", data => data),
				remove: createAction("todo_remove", data => data)
			},
			dispatch
		),
		refresh: () => {
			const action: any = (dispatch, getState) => {
				asyncAction(
					finish => {
						setTimeout(() => {
							dispatch(todoInit(getState().todo.todos));
							finish();
						}, 1000);
					},
					_ => dispatch(loadingStart()),
					_ => dispatch(loadingFinish())
				);
			};
			dispatch(action);
		},
		chain: () => {
			return (dispatch, getState) => Promise.resolve(123);
		}
	})
)(AppContent2);

function asyncAction(doAction: (onFinish) => void, onStart, onFinish) {
	onStart();
	doAction(onFinish);
}
