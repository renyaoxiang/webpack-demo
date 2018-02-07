interface OnGetDistance {
	(result: number): void;
}
class DistanceUtil {
	getDistance(
		str1: string,
		str2: string,
		onGetDistance: OnGetDistance
	): void {
		let result = -1;
		if (str1.length === 0 || str2.length === 0) {
			result = Math.max(str1.length, str2.length);
			onGetDistance(result);
		} else {
			const subResult: number[] = [];
			this.getDistance(str1.substring(1), str2, dist => {
				subResult.push(dist);
			});
			this.getDistance(str1, str2.substring(1), dist => {
				subResult.push(dist);
			});
			this.getDistance(str1.substring(1), str2.substring(1), dist => {
				subResult.push(dist);
			});
			result = Math.min(...subResult);
			if (str1.substring(0, 1) === str2.substring(0, 1)) {
				result += 1;
			}
			onGetDistance(result);
		}
	}
}

function main() {
	const seq1 = "sf";
	const seq2 = "fsf";
	const blast = new DistanceUtil();
	blast.getDistance(seq1, seq2, result => {
		console.log(result);
		console.log(1 - result / Math.max(seq1.length, seq2.length));
	});
}
main();
