import * as $ from "jquery";
import * as _ from "lodash";
import { table } from "table";
import { Call1, Call3 } from "../../../lib/functions";
import { Pair, Store } from "../../../lib/index";

$(() => {
	const wall: Position[] = [Position.of(3, 0), Position.of(3, 1), Position.of(3, 2), Position.of(3, 3)];
	const width = 5;
	const height = 5;
	const grid = new Grid(width, height);
	wall.forEach(it => {
		const box = grid.getBox(it);
		grid.addWall(box);
	});
	grid.print();

	const startPosition = Position.of(0, 0);
	const endPosition = Position.of(4, 0);

	const onFind: Call1<Box[]> = (path: Box[]) => {
		grid.print(path);
	};
	const start: Box = grid.getBox(startPosition);
	const end: Box = grid.getBox(endPosition);

	new AStar(grid, start, end, onFind).search();
});

class AStar {
	private shortestPath: Store<Box[]>[] = [];
	constructor(private grid: Grid, private start: Box, private end: Box, private onFind: Call1<Box[]>) {
		this.grid.forEach(it => {
			this.shortestPath.push(new Store<Box[]>());
		});
	}
	compare(o1: Box, o2: Box, dist: Box): number {
		const p0 = dist.getPostion();
		const p1 = o1.getPostion();
		const p2 = o2.getPostion();
		return (
			Math.pow(p0.w - p1.w, 2) + Math.pow(p0.h - p1.h, 2) - Math.pow(p0.w - p2.w, 2) - Math.pow(p0.h - p2.h, 2)
		);
	}
	lockingBoxList: Box[] = [];
	isLocking(box: Box) {
		return this.lockingBoxList.includes(box);
	}
	lockBox(box: Box) {
		return this.lockingBoxList.push(box);
	}
	unLockBox(box: Box) {
		if (this.lockingBoxList.includes(box)) {
			this.lockingBoxList.splice(this.lockingBoxList.indexOf(box));
		}
	}
	action(box: Box, action: () => void) {
		this.lockBox(box);
		action();
		this.unLockBox(box);
	}
	search() {
		const getConnector: Call3<Box, Box, Call1<Pair<Box, Box>>> = (
			start: Box,
			end: Box,
			onGetConnector: Call1<Pair<Box, Box>>
		) => {
			this.lockBox(start);
			const neighbours = this.grid.getNeighbours(start).filter(it => !this.isLocking(it));
			neighbours.forEach(it => {
				onGetConnector(new Pair(start, it));
			});
			this.unLockBox(start);
		};
		const cartesianProduct = (path1: Box[][], path2: Box[][], onGetCartesianProduct: Call1<Box[]>) => {
			const getMinPath = (paths: Box[][]): Store<Box[]> => {
				const result = new Store<Box[]>();
				paths.forEach(it => {
					if (result.state) {
						result.data = it.length < result.data.length ? it : result.data;
					} else {
						result.data = it;
					}
				});
				return result;
			};
			const store1 = getMinPath(path1);
			const store2 = getMinPath(path2);
			if (store1.state && store2.state) {
				onGetCartesianProduct([...store1.data, ...store2.data]);
			}
		};

		const getAllPath = (
			start: Box,
			end: Box,
			getConnector: Call3<Box, Box, Call1<Pair<Box, Box>>>,
			onGetPath: Call1<Box[]>
		) => {
			if (start.equals(end)) {
				onGetPath([end]);
			} else {
				const onGetConnector = connectPair => {
					const getSubResult = (start, end) => {
						let result: Box[][] = [];
						getAllPath(start, end, getConnector, path => {
							result.push(path);
						});
						return result;
					};
					const sub1 = getSubResult(start, connectPair.first);
					const sub2 = getSubResult(connectPair.second, end);
					if (sub1.length > 0 && sub2.length > 0) {
						cartesianProduct(sub1, sub2, path => {
							onGetPath(path);
						});
					}
				};
				getConnector(start, end, onGetConnector);
			}
		};
		// const getShortestPath = (allPaths: Box[][], onGet: Stat1<Box[]>) => {
		// 	if (allPaths.length > 0) {
		// 		let result = allPaths.reduce((prev: Box[], curr: Box[]) => {
		// 			let result = null
		// 			if (prev == null) {
		// 				result = curr
		// 			} else {
		// 				prev = prev.length < curr.length ? prev : curr
		// 			}
		// 			return result
		// 		}, null)
		// 		onGet(result)
		// 	}
		// }
		getAllPath(this.start, this.end, getConnector, path => {
			this.grid.print(path);
			this.onFind;
		});
	}
}

class Grid {
	getNeighbours(box: Box) {
		return this.getNeighbourPosition(box.getPostion())
			.map(it => this.getBox(it))
			.filter(it => !this.isWall(it));
	}
	private wallBoxList: Box[] = [];
	isWall(box: Box) {
		return this.wallBoxList.includes(box);
	}
	addWall(box: Box) {
		this.wallBoxList.push(box);
	}

	private getNeighbourPosition(position: Position): Position[] {
		const subPosition1 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h));
		const subPosition2 = [position.h - 1, position.h + 1].map(it => new Position(position.w, it));
		const subPosition3 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h + 1));
		const subPosition4 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h - 1));
		return _.flatMap([subPosition1, subPosition2, subPosition3, subPosition4]).filter(it => {
			return it.w >= 0 && it.h >= 0 && it.w < this.width && it.h < this.height;
		});
	}
	private boxList: Box[] = [];
	constructor(public readonly width: number, public readonly height: number) {
		this.boxList = new Array(width * height);
		for (let h = 0; h < height; h++) {
			for (let w = 0; w < width; w++) {
				this.boxList[h * width + w] = new Box(w, h, this);
			}
		}
	}

	forEach(callback: (box: Box) => void) {
		this.boxList.forEach(callback);
	}
	print(path: Box[] = []) {
		path = path || [];
		const data = _.chunk(
			this.boxList.map(it => {
				if (path.includes(it)) {
					return path.indexOf(it);
				} else if (this.isWall(it)) {
					return "|";
				} else {
					const position = it.getPostion();
					return path.length === 0 ? `${position.w}${position.h}` : " ";
				}
			}),
			this.width
		);
		console.log(table(data));
	}
	printPath(path: Box[] = []) {
		path = path || [];
		const tableData = path.map(it => {
			const p = it.getPostion();
			return `${p.w}${p.h}`;
		});
		if (tableData.length > 0) {
			console.log(table([tableData]));
		}
	}
	getBox(position: Position) {
		const index = position.h * this.width + position.w;
		return this.boxList[index];
	}
}

class Box {
	constructor(public readonly w: number, public readonly h: number, public readonly grid: Grid) {}
	getPostion() {
		return Position.of(this.w, this.h);
	}
	public equals(other: Box) {
		return other != null && this.getPostion().equals(other.getPostion());
	}
}

class Position {
	constructor(public readonly w: number, public readonly h: number) {}
	public toString() {
		return JSON.stringify({
			w: this.w,
			h: this.h
		});
	}
	public equals(position: Position) {
		return this.w === position.w && this.h === position.h;
	}
	public static of(x: number, y: number): Position {
		return new Position(x, y);
	}
}
