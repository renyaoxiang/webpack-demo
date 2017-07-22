interface IDisposable {
	dispose()
	onDispose()
}
interface IRenderer extends IDisposable {
	render()
	onRender()
}

