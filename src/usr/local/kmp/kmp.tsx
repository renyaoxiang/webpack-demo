import * as $ from 'jquery'
import { Call, Call1, Call3 } from '../../../lib/index'
const kmp = require('kmp-matcher')
const algorithms = require('algorithms')
$(() => {
	const button = $(`<button type='button'>run</button>`).appendTo(document.body)
	const text = 'abcdefadacdeffadsdfcdeffasdf'
	const pattern = 'dedededdedede'
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
			const getTextPrefixList = (pattern: string): number[] => {
				let prefixIndexList: number[] = [0]
				for (let start = 1; start < pattern.length;) {
					let maxSuffixLength = -1
					for (let suffixLength = start - 1; suffixLength > 0;) {
						const prefixString = pattern.substring(0, suffixLength)
						const suffixString = pattern.substring(start + 1 - suffixLength, start + 1)
						if (prefixString === suffixString) {
							maxSuffixLength = suffixLength
						} else {
							suffixLength--
						}
					}
					prefixIndexList.push(maxSuffixLength)
				}
				return prefixIndexList
			}
			const prefixIndexList: number[] = getTextPrefixList(pattern)

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
					textCharIndex = textCharIndex + failPatternIndex - prefixIndexList[failPatternIndex]
					subTextCharIndex = prefixIndexList[failPatternIndex]
				}
				const matchSubText = (subText: string, pattern: string, subTextCharIndex: number,
					onSuccess, onFail) => {
					for (; subTextCharIndex < pattern.length; subTextCharIndex++) {
						if (subText.charAt(subTextCharIndex) === pattern.charAt(subTextCharIndex)) {
							if (subTextCharIndex === pattern.length) {
								onSuccess()
								break
							}
						} else {
							onFail(subTextCharIndex)
							break
						}
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
