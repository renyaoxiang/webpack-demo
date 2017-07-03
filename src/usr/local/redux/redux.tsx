import { createStore } from 'redux'
import * as React from 'react'
import { Component } from 'react'
import { render } from 'react-dom'
import 'todomvc-app-css/index.css'
document.addEventListener('DOMContentLoaded', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<App />, div)
})
const todo = (state = {}, action) => {
    switch (action.type) {
        case 'init':
            return { inited: false }
        case 'inited':
            return { inited: true }
        case 'load':
            return { inited: true, loaded: false }
        case 'loaded':
            return { inited: true, loaded: true, data: action.data }
        default:
            return { inited: false }
    }
}
const store = createStore(todo, {})

store.subscribe(() => {
    console.log(123)
})
class App extends Component<any, any>{
    private store: any
    constructor(props, context) {
        super(props, context)
        this.store = store
        this.state = store.getState()
        console.log(this.state)
    }
    public render() {
        return <div>
            {!this.state.inited ? 'init' : !this.state.load ? 'load' : !!this.state.data ? this.state.data : 'none'}
            <ul>
                <li onClick={() => { this.startInit() }}>startInit</li>
                <li onClick={() => { this.startLoad() }}>startLoad</li>
                <li onClick={() => { this.reset() }}>reset</li>
            </ul>
        </div>
    }
    public componentDidMount() {
        this.store.subscribe(() => {
            this.setState({ ...this.store.getState() })
        })
    }
    private reset() {
        this.store.dispatch({
            type: 'init'
        })
    }
    private startInit() {
        this.store.dispatch({
            type: 'inited'
        })
    }
    private startLoad() {
        this.store.dispatch({
            type: 'load'
        })
        setTimeout(() => {
            this.store.dispatch({
                type: 'loaded',
                data: new Date().getTime()
            })
        }, 2000)
    }
}
