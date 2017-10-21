export interface Stat0 {
	(): void
}
export interface Stat1<A> {
	(arg: A): void
}
export interface Stat2<A1, A2> {
	(arg1: A1, arg2: A2): void
}
export interface Call0 {
	(err: any): void
}
export interface Call1<A> {
	(err: any, arg: A): void
}
export interface Call2<A1, A2> {
	(err: any, arg1: A1, arg2: A2): void
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

export class Lock<T> {
	constructor(private _lock: boolean = false, private _desc: T = null,
		private beforeLock?: Stat0, private afterLock?: Stat0) {

	}
	locking(): boolean {
		return this._lock
	}
	lock(beforeLock?: Stat0): this {
		this.checkUnlocking()
		if (this.beforeLock) {
			this.beforeLock()
		}
		if (beforeLock) {
			beforeLock()
		}
		this._lock = true
		return this
	}
	unlock(afterLock?: Stat0): this {
		this.checkLocking()
		this._lock = false
		if (afterLock) {
			afterLock()
		}
		if (this.afterLock) {
			this.afterLock()
		}
		return this
	}
	doAction(next: Stat0): this {
		this.checkUnlocking()
		this.lock()
		next()
		this.unlock()
		return this
	}
	getDesc(): T {
		return this._desc
	}
	private checkUnlocking(): void {
		if (!this._lock) {
		} else {
			throw new Exception('object locked')
		}
	}
	private checkLocking(): void {
		if (this._lock) {
		} else {
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
	private _resolve: Stat1<T>
	private _reject: Stat1<any>
	private _promise: Promise<T>
	constructor() {
		this._promise = new Promise<T>((resolve, reject) => {
			this._resolve = resolve
			this._reject = reject
		})
	}
	isFinished() {
		return this._finished
	}
	reject(error?: any) {
		this.checkWriteable()
		this._reject(error)
	}
	resolve(data: T) {
		this.checkWriteable()
		this._finished = true
	}
	promise(): Promise<T> {
		return this._promise
	}
	private checkWriteable() {
		if (this._finished) {
			throw new Exception('result has been setted')
		}
	}


}
export class CacheablePromise<T> {
	private _finished: boolean = false
	private _resolve: Stat1<T>
	private _reject: Stat1<any>
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
	resolveCache(data: T): this {
		this.checkWriteable()
		this._store.setData(data)
		return this
	}
	rejectCache(error?: any): this {
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

export function lazyValue<T>(value: Stat0 | any): T {
	if (typeof value === 'function') {
		return value()
	} else {
		return value
	}
}
