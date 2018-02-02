import * as table from "table";

enum DiffType {
	NONE,
	FIRST_LOST,
	SECOND_LOST,
	UNMATCH
}
interface Diff {
	position: number;
	first: string;
	second: string;
	type: DiffType;
}
class Mutation {
	constructor(public readonly diffList: Diff[] = []) {}
	print(): void {
		this.diffList.forEach(it => {
			console.log();
		});
	}
	append(diff: Diff) {
		this.diffList.push(diff);
	}
}
class Blast {
	private mutation: Mutation;
	constructor(private str1: string, private str2: string) {}
	analysis() {}
	getResult(): Mutation {
		return null;
	}
}
const blast = new Blast("abc", "ddd");
blast.analysis();
const mutation = blast.getResult();
