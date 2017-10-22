import * as _ from 'lodash'
import * as $ from 'jquery'
import { Call1, Call2 } from '../../../lib/index';
import { Fun1 } from '../../../lib/functions';

$(() => {

	const src = 'abcdefadacdfasdfcdfasdf'
	const subStr = 'cdf'
	const onFind = (index) => {
		console.log(index)
	}
	new KMP(src, subStr, onFind).search()
})


class KMP {
	constructor(private src: string, private target: string, private onFind: Call1<number>) {

	}

	search() {

		const getSubString = (src: string, onGetSubString: Call2<number, string>) => {

		}

		getSubString(this.src, onGetSubString(index) => {
			const onSuccess= (subString)=>{
				
			}
			const compare = (subStr, this.target, onSuccess) => {
				if (subStr === this.target) {
					onSuccess(index)
				}
			}
		})

	}
}
