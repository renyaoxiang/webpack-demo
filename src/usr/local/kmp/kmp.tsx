import * as $ from 'jquery'
import { Call1, Call3 } from '../../../lib/index';

$(() => {

	const src = 'abcdefadacdfasdfcdfasdf'
	const subStr = 'cdfcd'
	const onFind = (index) => {
		console.log(subStr, index)
	}
	new KMP(src, subStr, onFind).search()
})


class KMP {
	constructor(private src: string, private target: string, private onFind: Call1<number>) {
	}

	search() {

		let cache = null


		const getKeyCache = (target: string) => {
			const map = new Map()
			if (target.length === 1) {
				return map.set(target, 1)
			}
			for (let i = 1; i < target.length; i++) {
				let newTarget=
				getToCompareSubString(target.slice(),target)
			}
			return map
		}
		const useCacheCompare = (cache, toCompareSubString, onUseCacheCompareFinish) => {
			Object.entries(cache).forEach(([key, value]) => {

			})
		}
		const compare = (toCompareSubString, target: string, onSuccess) => {
			if (cache === null) {
				cache = getKeyCache(target)
			}
			const onUseCacheCompareFinish = (result: {
				state?: boolean,
				findIndex: number,
				stepIndex: number
			}) => {
				if (result.state) {
					onSuccess()
				} else {

				}
			}
			useCacheCompare(cache, toCompareSubString, onUseCacheCompareFinish)

		}
		const onGetToCompareSubString = (toCompareSubString, target, index) => {
			compare(toCompareSubString, target, (subString) => {
				this.onFind(subString)
			})
		}
		const getToCompareSubString = (src: string, target: string,
			onGetToCompareSubString: Call3<string, string, number>) => {
			const targetLength = target.length
			for (let i = 0; i < src.length; i++) {
				const subString = src.slice(i, i + targetLength)
				onGetToCompareSubString(subString, target, i)
			}
		}
		getToCompareSubString(this.src, this.target, onGetToCompareSubString)

	}
}
