import * as $ from 'jquery'
import { Call, Call1, Call3 } from '../../../lib/index'
const kmp = require('kmp-matcher')
const algorithms = require('algorithms')
$(() => {
	const button = $(`<button type='button'>run</button>`).appendTo(document.body)
	const text = 'abcdefadacdeffadsdfcdeffasdf'
	const pattern = 'de'
	button.click(() => {

		console.log(kmp.kmp(text, pattern))
		console.log(algorithms.String.knuthMorrisPratt(text, pattern))
		const onFindAll = (indexs) => {
			console.log(indexs)
		}
		new KMP(text, pattern, onFindAll).search()
	})
})


class KMP {
	constructor(private text: string, private pattern: string, private onFind: Call1<number[]>) {
	}

	search() {
		const findedIndexList: number[] = []
		const match = (text: string, pattern: string, onMatch: Call1<number>) => {
			const getNextList = (pattern: string): number[] => {
				let nextIndexList: number[] = []
				for (let start = 0; start < pattern.length; start++) {
					let nextIndex = -1
					for (let suffixLength = start; suffixLength >= 1; suffixLength--) {
						const prefixString = pattern.substring(0, suffixLength)
						const suffixString = pattern.substring(start + 1 - suffixLength, start + 1)
						if (prefixString === suffixString) {
							nextIndex = suffixLength - 1
							break;
						}
					}
					nextIndexList.push(nextIndex)
				}
				return nextIndexList
			}
			const nextIndexList: number[] = getNextList(pattern)
			for (let textCharIndex = 0, subTextCharIndex = 0,
				maxTextCharIndex = text.length - pattern.length;
				textCharIndex <= maxTextCharIndex;) {
				const subText = text.substr(textCharIndex, pattern.length)
				const onSuccess = () => {
					onMatch(textCharIndex)
					textCharIndex++
					subTextCharIndex = 0
				}
				const onFail = (failPatternIndex) => {
					if (nextIndexList[failPatternIndex] === -1) {
						textCharIndex++
						subTextCharIndex = 0
					} else {
						textCharIndex = textCharIndex + failPatternIndex - 1 - nextIndexList[failPatternIndex - 1]
						subTextCharIndex = nextIndexList[failPatternIndex]
					}
				}
				const matchSubText = (subText: string, pattern: string, subTextCharIndex: number,
					onSuccess, onFail) => {
					let state = true
					for (; subTextCharIndex < pattern.length; subTextCharIndex++) {
						const textChar = subText.charAt(subTextCharIndex)
						const patternChar = pattern.charAt(subTextCharIndex)
						if (textChar !== patternChar) {
							state = false
							break
						}
					}
					if (state) {
						onSuccess()
					} else {
						onFail(subTextCharIndex)
					}
				}
				matchSubText(subText, pattern, subTextCharIndex, onSuccess, onFail)
			}
		}
		const onMatch = (index) => {
			findedIndexList.push(index)
		}
		match(this.text, this.pattern, onMatch)
		this.onFind(findedIndexList)

	}
}



class BF {
	constructor(private text: string, private pattern: string, private onFind: Call1<number[]>) {
	}

	search() {
		const match = (text: string, pattern: string, onMatch: Call1<number>) => {
			for (let textCharIndex = 0; textCharIndex <= text.length - pattern.length;) {
				const subText = text.substr(textCharIndex, pattern.length)
				const onSuccess = () => {
					onMatch(textCharIndex)
					textCharIndex++;
				}
				const onFail = (failPatternIndex) => {
					textCharIndex++;
				}
				const matchSubText = (subText: string, pattern: string, onSuccess, onFail) => {
					let subTextCharIndex = 0
					for (subTextCharIndex = 0; subTextCharIndex < pattern.length; subTextCharIndex++) {
						if (subText.charAt(subTextCharIndex) !== pattern.charAt(subTextCharIndex)) {
							break
						}
					}
					if (subTextCharIndex === pattern.length) {
						onSuccess()
					} else {
						onFail(subTextCharIndex)
					}
				}
				matchSubText(subText, pattern, onSuccess, onFail)
			}
		}
		const findedIndexList: number[] = []
		const onMatch = (index) => {
			findedIndexList.push(index)
		}
		match(this.text, this.pattern, onMatch)
		this.onFind(findedIndexList)

	}
}
