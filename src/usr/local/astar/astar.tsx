import * as $ from "jquery";
import * as _ from "lodash";
import { table } from "table";
import { Call1, Store, Lock } from "../../../lib/functions";

$(() => {
	const wall: Position[] = [Position.of(3, 0), Position.of(3, 1), Position.of(3, 2), Position.of(3, 3)];
	const width = 5;
	const height = 5;
	const grid = new Grid(width, height);
	grid.forEach(box => {
		wall.forEach(it => {
			if (it.equals(box.getPostion())) {
				box.isEmpty = false;
			}
		});
	});
	grid.print();

	const startPosition = Position.of(2, 0);
	// const endPosition = Position.of(4, 0);

	const onFinish: Call1<Box[]> = (path: Box[]) => {
		if (path !== null) {
			grid.print(path);
		} else {
			console.log("not find");
		}
	};
	const start: Box = grid.getBox(startPosition);
	const box3: Box = grid.getBox(Position.of(2, 3));
	onFinish(start.getPath(box3));
});

class Grid {
	private shortestPathStore: Store<Box[]> = new Store<Box[]>();
	private boxList: Box[] = [];
	constructor(public readonly width: number, public readonly height: number) {
		this.boxList = new Array(width * height);
		for (let h = 0; h < height; h++) {
			for (let w = 0; w < width; w++) {
				this.boxList[h * width + w] = new Box(w, h, this);
			}
		}
	}
	reset() {
		this.shortestPathStore.reset();
		this.boxList.forEach(it => it.reset());
	}
	setShortestPath(path: Box[] = []): void {
		this.shortestPathStore.data = path;
	}
	getShortestPathStore(): Store<Box[]> {
		return this.shortestPathStore;
	}

	compare(o1: Box, o2: Box, dist: Box): number {
		const p0 = dist.getPostion();
		const p1 = o1.getPostion();
		const p2 = o2.getPostion();
		return (
			Math.pow(p0.w - p1.w, 2) + Math.pow(p0.h - p1.h, 2) - Math.pow(p0.w - p2.w, 2) - Math.pow(p0.h - p2.h, 2)
		);
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
				} else if (!it.isEmpty) {
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
	private pathCache: Store<Box[]> = new Store<Box[]>();
	private lock: Lock = new Lock();
	private prePath: Box[] = [];
	constructor(
		public readonly w: number,
		public readonly h: number,
		public readonly grid: Grid,
		public isEmpty: boolean = true
	) {}
	reset() {
		this.pathCache = new Store<Box[]>();
		this.lock = new Lock();
		this.prePath = [];
	}
	updatePath(path: Box[]) {
		this.pathCache.data = path;
	}
	private searchPath(dist: Box): Box[] {
		const result = new Store<Box[]>();
		if (this.equals(dist)) {
			result.data = [this];
			this.updateShortestPath([...this.prePath, this]);
		} else {
			const neighbours = this.getNeighbours();
			const sortedNeighbour = this.evaluateAndSortNeighbours(dist, neighbours);
			const neighbourPaths = sortedNeighbour.map(it => {
				it.prePath = [...this.prePath];
				return it.getPath(dist);
			});
			const shortestPath = neighbourPaths.reduce(this.getShorterPath, null);
			if (shortestPath === null) {
				result.data = null;
			} else {
				result.data = [this, ...shortestPath];
				this.updateShortestPath([...this.prePath, this, ...shortestPath]);
			}
		}
		return result.data;
	}
	private getShorterPath(o1: Box[], o2: Box[]): any {
		if (o1 === null || o2 === null) {
			return o1 || o2;
		} else {
			return o1.length < o2.length ? o1 : o2;
		}
	}

	private updateShortestPath(path: Box[]): void {
		const store = this.grid.getShortestPathStore();
		let shortestPath = store.data;
		if (!store.state) {
			shortestPath = path;
		} else {
			if (shortestPath === null || path === null) {
				shortestPath = shortestPath || path;
			} else {
				shortestPath = path.length < shortestPath.length ? path : shortestPath;
			}
		}
		shortestPath.forEach(it => it.updatePath(path.slice(path.indexOf(it))));
		store.data = shortestPath;
	}
	evaluateAndSortNeighbours(dist: Box, neighbours: Box[]): Box[] {
		return [...neighbours].sort((o1, o2) => this.grid.compare(o1, o2, dist));
	}
	getPath(dist: Box): Box[] {
		if (!this.pathCache.state || this.pathCache.data !== null) {
			this.lock.atom(() => {
				if (this.shouldTry()) {
					this.pathCache.data = this.searchPath(dist);
				} else {
					this.pathCache.data = null;
				}
			});
		}
		return this.pathCache.data;
	}
	shouldTry(): boolean {
		const shortestPathStore = this.grid.getShortestPathStore();
		return !shortestPathStore.state || this.prePath.length < shortestPathStore.data.length;
	}
	getPostion() {
		return Position.of(this.w, this.h);
	}
	getNeighbours() {
		return this.getNeighbourPosition(this.getPostion())
			.map(it => this.grid.getBox(it))
			.filter(it => it.isEmpty)
			.filter(it => it.lock.isFree);
	}
	private getNeighbourPosition(position: Position): Position[] {
		const subPosition1 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h));
		const subPosition2 = [position.h - 1, position.h + 1].map(it => new Position(position.w, it));
		const subPosition3 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h + 1));
		const subPosition4 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h - 1));
		return _.flatMap([subPosition1, subPosition2, subPosition3, subPosition4]).filter(it => {
			return it.w >= 0 && it.h >= 0 && it.w < this.grid.width && it.h < this.grid.height;
		});
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
