class Sequence {
	constructor(private value: string) {}
}
class BlastResult {
	sequence1: Sequence;
	sequence2: Sequence;
	similarity: number;
}
interface OnGetDistance {
	(result: number): void;
}
class Blast {
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
			if (str1.substring(0, 1) === str2.substring(0, 1)) {
				this.getDistance(
					str1.substring(1),
					str2.substring(1),
					onGetDistance
				);
			} else {
				const subResult: number[] = [];
				this.getDistance(str1.substring(1), str2, dist => {
					subResult.push(dist);
				});
				this.getDistance(str1, str2.substring(1), dist => {
					subResult.push(dist);
				});
				const result = Math.min(...subResult);
				onGetDistance(result + 1);
			}
		}
	}
}

function main() {
	const seq1 = "sfeq21";
	const seq2 = "fseq21";
	const blast = new Blast();
	blast.getDistance(seq1, seq2, result => {
		console.log(result);
		console.log(1 - result / Math.max(seq1.length, seq2.length));
	});
}
main();
