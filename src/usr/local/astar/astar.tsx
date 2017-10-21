import * as $ from 'jquery'
import * as _ from 'lodash'
import { table } from 'table'
import { Stat1, Store, } from '../../../lib/functions';



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

	const startPosition = Position.of(0, 0);
	const endPosition = Position.of(4, 4);

	const onFinish: Stat1<Box[]> = (path: Box[]) => {
		if (path !== null) {
			grid.print(path)
		} else {
			console.log('not find')
		}
	}
	const start: Box = grid.getBox(startPosition)
	const end: Box = grid.getBox(endPosition)
	start.getPath(end, onFinish)
})



class Grid {
	private boxList: Box[] = []
	compare(o1: Box, o2: Box, dist: Box): any {
		const p0 = dist.getPostion()
		const p1 = o1.getPostion()
		const p2 = o2.getPostion()
		return Math.pow(p0.w - p1.w, 2) + Math.pow(p0.h - p1.h, 2) - Math.pow(p0.w - p2.w, 2) - Math.pow(p0.h - p2.h, 2)
	}
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
	print(path: Box[] = []) {
		const data = _.chunk(this.boxList.map(it => {
			if (path.includes(it)) {
				return path.indexOf(it)
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

	private pathCache: Store<Box[]> = new Store<Box[]>()
	private findPath(dist: Box, onFind: Stat1<Box[]>): void {
		const result = new Store<Box[]>()
		if (this.equals(dist)) {
			result.data = [this]
		} else {
			const neighbour = this.getNeighbour()
			const children = neighbour.sort((o1, o2) => this.grid.compare(o1, o2, dist))
			const childrenResult = children.map(it => {
				let _path = null
				it.getPath(dist, (path) => { _path = path })
				return _path
			})
			const shortestPath = childrenResult.reduce(this.getShorterPath, null)
			result.data = shortestPath === null ? null : [this, ...shortestPath]
		}
		onFind(result.data)
	}
	private getShorterPath(o1: Box[], o2: Box[]): any {
		if (o1 === null || o2 === null) {
			return o1 || o2
		} else {
			return o1.length < o2.length ? o1 : o2
		}
	}


	getPath(dist: Box, onFinish: Stat1<Box[]>): any {
		if (this.pathCache.state) {
		} else {
			this.usable = false
			this.findPath(dist, (path: Box[]) => {
				this.usable = true
				this.pathCache.data = path
			})
		}
		onFinish(this.pathCache.data)

	}
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
