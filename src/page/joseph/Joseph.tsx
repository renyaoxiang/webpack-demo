
/**
 * 约瑟夫环
 * total: 总人数
 * specialNumber: 出局号(从0开始数)
*/
export class Joseph {
	constructor(private total: number, private specialNumber) { }
	getIndex() {
		let index = -1
		this._getIndex(1, 0, this.specialNumber, (total, current, next) => {
			if (total !== this.total) {
				next()
			} else {
				index = current
			}
		})
		return index
	}
	private _getIndex(total: number, current: number, specialNumber: number,
		onGet: (total: number, current: number, next) => void) {
		const next = () => {
			this._getIndex(total + 1, current, specialNumber, onGet)
		}
		current = (current + specialNumber) % (total + 1)
		onGet(total + 1, current, next)
	}
}

const index = new Joseph(3, 2).getIndex()
console.log(index)
