import * as React from 'react'
import { Component } from 'react'
import { render } from 'react-dom'
import 'todomvc-app-css/index.css'
document.addEventListener('DOMContentLoaded', () => {
	const div = document.createElement('div')
	document.body.appendChild(div)
	render(<Todo>aaa</Todo>, div)
})
enum TaskState {
	Empty, Todo, Done
}
class Task {
	public state: TaskState = TaskState.Todo
	constructor(public content: string = '') { }
}
class Todo extends Component<any, any> {
	constructor(props: any, context: any) {
		super(props, context)
		this.state = {
			inputValue: '',
			tasksState: TaskState.Empty,
			tasks: []
		}
	}
	public render() {
		return <div>
			<header className="header">
				<h1>todos</h1>
				<input type='input' defaultValue={this.state.inputValue} onKeyUp={(e) => {
					if (e.keyCode === 13) {
						this.setInput(e.currentTarget.value)
					}
				}} />
			</header>
			<button type='button' value='showAll' onClick={() => {
				this.setState({
					tasksState: TaskState.Empty
				})
			}} >showAll</button>
			<button type='button' value='showTodo' onClick={() => {
				this.setState({
					tasksState: TaskState.Todo
				})
			}} >showTodo</button>
			<button type='button' value='showDone' onClick={() => {
				this.setState({
					tasksState: TaskState.Done
				})
			}} >showDone</button>
			<section className='main'>
				<ul className="todo-list">
					{
						this.state.tasks.filter(it => this.state.tasksState === TaskState.Empty
							|| it.state === this.state.tasksState).map((it, index) => {
								return <li key={index} onClick={(i) => {
									this.toggleState(it)
								}}>
									<span>{it.state === TaskState.Todo ? 'TODO' : 'DONE'}</span>
									<span>{it.content}</span>
								</li>
							})
					}
				</ul>
			</section>
		</div>
	}
	private toggleState(task) {
		if (task.state === TaskState.Done) {
			task.state = TaskState.Todo
		} else {
			task.state = TaskState.Done
		}
		this.setState({
			tasks: [...this.state.tasks]
		})
	}
	private setInput(value) {
		this.setState({
			inputValue: value,
			tasks: [...this.state.tasks, new Task(value)]
		})
	}
}
