import * as $ from 'jquery'

$(() => {
	const width = 10;
	const height = 10;
	const grid = new Grid(width, height)
	grid.forEach(box => {
		if (box.w === 5 && box.h === 5) {
			box.setState(false)
		}
	})
	const fathList = grid.findPath(new Position(2, 2), new Position(5, 5))
	fathList.forEach(it => {
		console.log(it.w, it.h)
	})
})

class CustomMap<K, V> extends Map<K, V>{
	constructor(private equals: (o1: K, o2: K) => boolean) {
		super()
	}
	set(key, value): this {
		const rawKey = this.findRawKey(key) || key
		super.set(rawKey, value)
		return this
	}
	has(key): boolean {
		const rawKey = this.findRawKey(key)
		return rawKey !== null
	}
	delete(key: K): boolean {
		const rawKey = this.findRawKey(key)
		return super.delete(rawKey)
	}

	private findRawKey(key: K): K {
		let find: K = null
		this.forEach((value, _key) => {
			if (!find) {
				if (this.equals(key, _key)) {
					find = _key
				}
			}
		})
		return find
	}
}
class AStar {
	private find: boolean = false
	private finish: boolean = false
	private paths: Position[] = []
	private positionValueMap: CustomMap<Position, Position[]> =
	new CustomMap<Position, Position[]>((key1: Position, key2: Position) => {
		return Position.equals(key1, key2)
	})
	constructor(private grid: Grid, private src: Position, private dist: Position,
		private valuate: (src: Position, dist: Position) => number) {

	}

	getPaths() {
		return this.paths
	}
	private search(previous: number, src: Position) {
		const children = this.getNeighbor(src)
	}
	private getNeighbor(src: Position): Position[] {
		return []
	}

}


class Grid {
	private boxList: Box[] = []
	constructor(private width: number, private height: number) {
		const total = this.width * this.height
		this.boxList = new Box[total]
		for (let i = 0; i < total; i++) {
			const h = i / this.width
			const w = i % this.width
			this.boxList[i] = new Box(w, h)
		}
	}
	forEach(callback: (box: Box) => void) {
		this.boxList.forEach(callback)
	}
	getBox(position: Position) {
		const index = position.h * this.width + position.w
		return this.boxList[index]
	}
	findPath(src: Position, dist: Position): Position[] {
		const paths: Position[] = new AStar(this, src, dist).getPaths()
		return paths
	}
}
class Box {
	private state: boolean
	constructor(public readonly w: number, public readonly h: number) {

	}
	setState(state: boolean) {
		this.state = state
	}
	getPostion() {
		return Position.of(this.w, this.h)
	}
}
class Position {
	constructor(public readonly w: number, public readonly h: number) {

	}
	public static equals(position1: Position, position2: Position) {
		return position1 !== null && position1.equals(position2)
	}
	equals(position: Position) {
		return this.w === position.w && this.h === position.h
	}
	public static of(x: number, y: number): Position {
		return new Position(x, y)
	}
}