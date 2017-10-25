export interface Call {
	(): void
}
export interface Call1<A> {
	(arg: A): void
}
export interface Call2<A1, A2> {
	(arg1: A1, arg2: A2): void
}
export interface Call3<A1, A2, A3> {
	(arg1: A1, arg2: A2, arg3: A3): void
}
export class Pair<T1, T2>{
	constructor(public first: T1, public second: T2) { }
}
export interface Fun0<T> {
	(): T
}
export interface Fun1<A, T> {
	(arg: A): T
}
export interface Fun2<A1, A2, T> {
	(arg1: A1, arg2: A2): T
}

export function arrayif(obj: any = []): any[] {
	if (Array.isArray(obj)) {
		return [...obj]
	} else {
		return [obj]
	}
}
export function lazy(val: any): () => any {
	if (typeof val === 'function') {
		return val()
	} else {
		return () => val
	}
}

export class Lock {
	constructor(private _lock: boolean = false,
		private before?: Call, private after?: Call) {
	}
	public static of(): Lock {
		return new Lock()
	}
	get isLock(): boolean {
		return this._lock
	}
	get isFree(): boolean {
		return !this._lock
	}
	start(before?: Call): void {
		this.checkFree()
		if (this.before) {
			this.before()
		}
		if (before) {
			before()
		}
		this._lock = true
	}
	end(after?: Call): void {
		this.checkLocking()
		this._lock = false
		if (after) {
			after()
		}
		if (this.after) {
			this.after()
		}
	}
	atom(action: Call, before?: Call, after?: Call): Lock {
		this.start(before)
		action()
		this.end(after)
		return this
	}
	private checkLocking(): void {
		if (!this._lock) {
			throw new Exception('object locked')
		}
	}
	private checkFree(): void {
		if (this._lock) {
			throw new Exception('object locked')
		}
	}

}

/**
 * 同步方法中随便使用
 * 异步方法中如果不关心结果的前置处理，只关心结果的后置处理，可以使用该类，
 */
export class Store<T>{
	private _state: boolean = false
	private _data: T = null

	set data(result: T) {
		this._state = true
		this._data = result
	}
	get state(): boolean {
		return this._state
	}
	get data(): T {
		return this._data
	}
	reset(): this {
		this._state = false
		this._data = null
		return this
	}
}
export class StandardStore<T>{
	private _isStandard: boolean = false
	private _store: Store<T | any> = new Store<T | any>()

	state() {
		return this._store.state
	}
	isStandard(): boolean {
		this.checkReadable()
		return this._isStandard
	}
	setData(data: T): this {
		this._isStandard = false
		this._store.data = data
		return this
	}
	setError(error: any): this {
		this._isStandard = true
		this._store.data = error
		return this
	}
	getData(): T {
		this.checkReadable()
		return !this._isStandard ? this._store.data : null
	}
	getError() {
		this.checkReadable()
		return this._isStandard ? this._store.data : null
	}
	private checkReadable() {
		if (!this._store.state) {
			throw new Error('result does not set')
		}
	}
	reset() {
		this._store.reset()
	}
}
export class StatePromise<T>   {
	private _finished: boolean = false
	private _resolve: Call1<T>
	private _reject: Call1<any>
	private _promise: Promise<T>
	private _lock: Lock = new Lock()
	constructor() {
		this._promise = new Promise<T>((resolve, reject) => {
			this._resolve = resolve
			this._reject = reject
		})
	}
	get isFinished() {
		return this._finished
	}
	action(action: Call2<Call1<T>, Call1<any>>) {
		this.checkWriteable()
		if (this._lock.isLock) {
			this._lock.atom(() => {
				action((data?: T) => {
					this.resolve(data)
				}, (error?: any) => {
					this.reject(error)
				})
			})
		}
	}
	reject(error?: any) {
		this.checkWriteable()
		this._finished = true
		this._reject(error)
	}
	resolve(data?: T) {
		this.checkWriteable()
		this._finished = true
		this._resolve(data)
	}
	get promise(): Promise<T> {
		return this._promise
	}
	private checkWriteable() {
		if (this._finished) {
			throw new Exception('result has been setted')
		}
	}
}

export class StatesPromise<T> {
	private _finished: boolean = false
	private _resolve: Call1<T>
	private _reject: Call1<any>
	private _promise: Promise<T>
	private _store: StandardStore<T> = new StandardStore<T>()
	constructor() {
		this._promise = new Promise<T>((resolve, reject) => {
			this._resolve = resolve
			this._reject = reject
		})
	}
	isFinished() {
		return this._finished
	}
	resolveData(data: T): this {
		this.checkWriteable()
		this._store.setData(data)
		return this
	}
	rejectData(error?: any): this {
		this.checkWriteable()
		this._store.setError(error)
		return this
	}
	reject() {
		this.checkWriteable()
		this._reject(this._store.getError())
	}
	resolve() {
		this.checkWriteable()
		this._resolve(this._store.getData())
	}
	private checkWriteable() {
		if (this._finished) {
			throw new Exception('result has been setted')
		}
	}
	get promise(): Promise<T> {
		return this._promise
	}

}
export class Exception extends Error {
	private code: number = -1
	constructor(message?: string, code?: number) {
		super(message)
		if (Number.isFinite(code)) {
			this.code = code
		}
	}
}

export function lazyValue<T>(value: Call | any): T {
	if (typeof value === 'function') {
		return value()
	} else {
		return value
	}
}
