import * as $ from 'jquery'
import * as _ from 'lodash'
import { table } from 'table'



$(() => {
	const wall: Position[] = [Position.of(3, 0), Position.of(3, 1), Position.of(3, 2), Position.of(3, 3)]
	const width = 5;
	const height = 5;
	const grid = new Grid(width, height)
	grid.forEach(box => {
		wall.forEach(it => {
			if (it.equals(box.getPostion())) {
				box.isEmpty = false
			}
		})
	})
	grid.print()

	const start = Position.of(0, 0);
	const end = Position.of(4, 4);
	let shortest: Box[] = new Array(width * height);
	const onFinish = (paths: Box[]) => {
		shortest = paths
	}
	new AStar(grid, start, end, onFinish).search()
	grid.print(shortest)
	shortest.forEach(it => console.log(it))
})


class AStar {
	constructor(public readonly grid: Grid, public readonly src: Position,
		public readonly dist: Position, private readonly onFinish: (paths: Box[]) => void) {
	}
	public search() {
		const srcBox = this.grid.getBox(this.src)
		const distBox = this.grid.getBox(this.dist)
		new AStarSupport(this.grid, srcBox, distBox, (paths: Box[]) => {
			this.onFinish([...paths])
		}).search()
	}
}


class Grid {
	private boxList: Box[] = []
	constructor(public readonly width: number, public readonly height: number) {
		this.boxList = new Array(width * height)
		for (let h = 0; h < height; h++) {
			for (let w = 0; w < width; w++) {
				this.boxList[h * width + w] = new Box(w, h, this)
			}
		}
	}

	forEach(callback: (box: Box) => void) {
		this.boxList.forEach(callback)
	}
	print(paths: Box[] = []) {
		const data = _.chunk(this.boxList.map(it => {
			if (paths.includes(it)) {
				return paths.indexOf(it)
			} else if (!it.isEmpty) {
				return '|'
			} else {
				return ' '
			}
		}), this.width)
		console.log(table(data))
	}
	getBox(position: Position) {
		const index = position.h * this.width + position.w
		return this.boxList[index]
	}
}

class Box {
	public usable: boolean = true
	constructor(public readonly w: number, public readonly h: number,
		public readonly grid: Grid, public isEmpty: boolean = true) {
	}
	getPostion() {
		return Position.of(this.w, this.h)
	}
	getNeighbour() {
		return this.getNeighbourPosition(this.getPostion())
			.map(it => this.grid.getBox(it)).filter(it => it.isEmpty).filter(it => it.usable)
	}
	toString() {
		return JSON.stringify({
			w: this.w,
			h: this.h
		})
	}
	private getNeighbourPosition(position: Position): Position[] {
		if (!position) {
			return []
		}
		const subPosition1 = [(position.w - 1), (position.w + 1)].map(it => new Position(it, position.h))
		const subPosition2 = [(position.h - 1), (position.h + 1)].map(it => new Position(position.w, it))
		const subPosition3 = [(position.w - 1), (position.w + 1)].map(it => new Position(it, position.h + 1))
		const subPosition4 = [(position.w - 1), (position.w + 1)].map(it => new Position(it, position.h - 1))
		return [...subPosition1, ...subPosition2, ...subPosition3, ...subPosition4].filter(it => {
			return it.w >= 0 && it.h >= 0 && it.w < this.grid.width && it.h < this.grid.height
		})
	}
	public equals(other: Box) {
		return other != null && this.getPostion().equals(other.getPostion())
	}
}

class AStarSupport {
	constructor(public readonly grid: Grid, public readonly src: Box, public readonly dist: Box,
		private readonly onFinish: (paths: Box[]) => void) {
	}
	public search() {
		this.src.usable = false
		if (this.src.equals(this.dist)) {
			this.onFinish([this.src])
		} else {
			const subList = this.src.getNeighbour()
			let resultPaths = null
			for (let sub of subList) {
				new AStarSupport(this.grid, sub, this.dist, (paths) => {
					if (resultPaths != null) {
						resultPaths = paths
					} else {
						if (resultPaths.length > paths.length) {
							resultPaths = paths
						}
					}
				}).search()
			}
			if (resultPaths !== null) {
				this.onFinish([this.src, ...resultPaths])
			}
		}
		this.src.usable = true
	}

}

class Position {
	constructor(public readonly w: number, public readonly h: number) {
	}
	public toString() {
		return JSON.stringify({
			w: this.w,
			h: this.h
		})
	}
	public static equals(position1: Position, position2: Position) {
		return position1 !== null && position1.equals(position2)
	}
	public equals(position: Position) {
		return this.w === position.w && this.h === position.h
	}
	public static of(x: number, y: number): Position {
		return new Position(x, y)
	}
	public static clone(other: Position): Position {
		return new Position(other.w, other.h)
	}
}
