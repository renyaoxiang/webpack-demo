
import * as _ from 'lodash'
import * as $ from 'jquery'

$(() => {
	let rCache = null
	const r = () => {
		if (!rCache) {
			rCache = new Promise((resolve, reject) => {
				resolve(1)
			})
		}
		return rCache
	}
	Promise.all([r(), r()]).then(_.spread((...args) => {
		console.log(args[0] === args[1])
	}))

})
