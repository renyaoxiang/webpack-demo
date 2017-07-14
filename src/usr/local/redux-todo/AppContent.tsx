import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as React from 'react'
import { Component } from 'react'
@connect(state => state, dispatch => bindActionCreators({
	refresh: data => (data),
}, dispatch))
class AppContent extends Component<any, any> {
	constructor(props, context) {
		super(props, context)
	}
	public render() {
		return <div onClick={this.props.refresh} >
			dadf
		</div>
	}
}
interface D<P, S> {
	run(p: P): S
}
class C<P, S> implements D<P, S> {
	public init = 0
	public run(p: P): S {
		return null
	}
}
new C().init = 1
export {
	AppContent
}
