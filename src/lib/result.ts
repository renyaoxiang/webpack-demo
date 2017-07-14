interface ICallback {
	(...args): any
}
export class AsyncAction {
	private onBefore: ICallback
	private onFinish: ICallback
	public init(onBefore: ICallback, onFinish: ICallback) {
		this.onBefore = onBefore
		this.onFinish = onFinish
		return this
	}
	public start(request: (start, finish) => void) {
		request(this.onBefore, this.onFinish)
	}
}
