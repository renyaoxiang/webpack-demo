import * as Promise from 'bluebird'

export class UnpendingResult {
    private isInit: Promise<any>
    private resolve: (result) => void
    private result: any = null
    constructor() {
        this.isInit = new Promise((resolve, reject) => {
            this.resolve = resolve
        })
    }
    public onResolve(onResolve: (result) => void): Promise<any> {
        return this.isInit.then(() => {
            onResolve(this.result)
        })
    }
    public request(value: any = null) {
        if (this.isInit.isResolved()) {
            throw new Error('the result has been setted')
        }
        this.result = value
        this.resolve(this.result)
        return this
    }
}

export class PendingResult {
    private isPending: Promise<any>
    private onRequestStart: () => Promise<any>
    private onRequestFinish: (result: any) => Promise<any>
    private result: any
    constructor() {
        this.onRequestStart = () => Promise.resolve()
        this.onRequestFinish = (result) => Promise.resolve()
    }
    public configRequest(onRequestStart: () => Promise<any>, onRequestFinish: (result: any) => Promise<any>) {
        this.onRequestStart = onRequestStart
        this.onRequestFinish = onRequestFinish
    }
    public request(doRequest: () => Promise<any>): Promise<any> {
        return this.isPending = new Promise((resolve) => {
            this.onRequestStart && this.onRequestStart()
            doRequest().then((result) => {
                this.result = result || null
                if (this.onRequestFinish) {
                    this.onRequestFinish(this.result).then(() => {
                        resolve(this.result)
                    })
                } else {
                    resolve(this.result)
                }
            })
        })
    }

}