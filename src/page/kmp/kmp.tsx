import * as $ from "jquery";
import { Call, Call1, Call3 } from "../../shared/lib/index";
import * as _ from "lodash";
import * as math from "mathjs";
const kmp = require("kmp-matcher");
const algorithms = require("algorithms");
$(() => {
	const button = $(`<button type='button'>run</button>`).appendTo(document.body);
	const text = "ABCDAB ABABCDABDCDAABCDABDBC ABCDABCDABDABABCDABDD";
	const pattern = "ABCDABD";
	button.click(() => {
		console.log(kmp.kmp(text, pattern));
		console.log(algorithms.String.knuthMorrisPratt(text, pattern));
		const onFindAll = indexs => {
			console.log(indexs);
		};
		new BF(text, pattern, onFindAll).search();
		new KMP(text, pattern, onFindAll).search();
	});
});

class KMP {
	constructor(private text: string, private pattern: string, private onFind: Call1<number[]>) {}
	getNextList = (pattern: string): number[] => {
		let nextList: number[] = [];
		for (let start = 0; start < pattern.length; start++) {
			let next = 0;
			let prefixStringEnd = start + 1;
			for (let tempNext = 0; tempNext < prefixStringEnd; tempNext++) {
				const prefixString = pattern.substring(0, tempNext);
				const suffixString = pattern.substring(prefixStringEnd - tempNext, prefixStringEnd);
				if (prefixString === suffixString) {
					next = tempNext;
				}
			}
			nextList.push(next);
		}
		return nextList;
	};
	search() {
		const match = (text: string, pattern: string, onMatch: Call1<number>) => {
			const nextList: number[] = this.getNextList(pattern);
			for (
				let textCharIndex = 0, subTextCharIndex = 0, maxTextCharIndex = text.length - pattern.length;
				textCharIndex <= maxTextCharIndex;

			) {
				const subText = text.substr(textCharIndex, pattern.length);
				const onSuccess = () => {
					onMatch(textCharIndex);
					const failPatternIndex = pattern.length;
					const next = nextList[failPatternIndex - 1];
					textCharIndex += failPatternIndex - next;
					subTextCharIndex = next;
				};
				const onFail = failPatternIndex => {
					if (failPatternIndex === 0) {
						textCharIndex++;
						subTextCharIndex = 0;
					} else {
						const next = nextList[failPatternIndex - 1];
						textCharIndex += failPatternIndex - next;
						subTextCharIndex = next;
					}
				};
				const matchSubText = (
					subText: string,
					pattern: string,
					subTextCharIndex: number,
					onSuccess,
					onFail
				) => {
					let state = true;
					for (; subTextCharIndex < pattern.length; subTextCharIndex++) {
						const textChar = subText.charAt(subTextCharIndex);
						const patternChar = pattern.charAt(subTextCharIndex);
						if (textChar !== patternChar) {
							state = false;
							break;
						}
					}
					if (state) {
						onSuccess();
					} else {
						onFail(subTextCharIndex);
					}
				};
				matchSubText(subText, pattern, subTextCharIndex, onSuccess, onFail);
			}
		};
		const findedIndexList: number[] = [];
		const onMatch = index => {
			findedIndexList.push(index);
		};
		match(this.text, this.pattern, onMatch);
		this.onFind(findedIndexList);
	}
}

class BF {
	constructor(private text: string, private pattern: string, private onFind: Call1<number[]>) {}

	search() {
		const match = (text: string, pattern: string, onMatch: Call1<number>) => {
			for (let textCharIndex = 0; textCharIndex <= text.length - pattern.length; ) {
				const subText = text.substr(textCharIndex, pattern.length);
				const onSuccess = () => {
					onMatch(textCharIndex);
					textCharIndex++;
				};
				const onFail = failPatternIndex => {
					textCharIndex++;
				};
				const matchSubText = (subText: string, pattern: string, onSuccess, onFail) => {
					let subTextCharIndex = 0;
					for (subTextCharIndex = 0; subTextCharIndex < pattern.length; subTextCharIndex++) {
						if (subText.charAt(subTextCharIndex) !== pattern.charAt(subTextCharIndex)) {
							break;
						}
					}
					if (subTextCharIndex === pattern.length) {
						onSuccess();
					} else {
						onFail(subTextCharIndex);
					}
				};
				matchSubText(subText, pattern, onSuccess, onFail);
			}
		};
		const findedIndexList: number[] = [];
		const onMatch = index => {
			findedIndexList.push(index);
		};
		match(this.text, this.pattern, onMatch);
		this.onFind(findedIndexList);
	}
}
