import * as $ from "jquery";

class Node {
	left: Node;
	right: Node;
	constructor(public value: string) { }
	equals(other: Node) {
		return this.value === other.value;
	}
}

class TreeParser {

	constructor(private preOrder: string = "", private inOrder: string = "") {
		if (this.inOrder.length !== this.preOrder.length) {
			throw new Error('error')
		}
	}
	process(): Node {

		if (this.inOrder) {
			const root = new Node(this.inOrder[0]);
			const preOrderRootIndex = this.preOrder.indexOf(root.value);
			if (preOrderRootIndex < 0) {
				throw new Error('error');
			}
			const preOrderLeftString = this.preOrder.substring(0, preOrderRootIndex);
			const middleOrderLeftString = this.inOrder.substring(1, preOrderRootIndex + 1);
			root.left = new TreeParser(preOrderLeftString, middleOrderLeftString).process();
			const preOrderRightString = this.preOrder.substring(preOrderRootIndex + 1);
			const middleOrderRightString = this.inOrder.substring(this.inOrder.length - preOrderRightString.length);
			root.right = new TreeParser(preOrderRightString, middleOrderRightString).process();
			return root;
		} else {
			return null;
		}

	}
	process2() {
		const actionList = []
		const metaData = []
		actionList.push({
			type: 'parse',
			preOrder: this.preOrder,
			inOrder: this.inOrder
		})
		while (actionList.length > 0) {
			const action = actionList.pop();
			switch (action.type) {
				case 'parse':
					const preOrder = action.preOrder;
					const inOrder = action.inOrder;
					const rootValue = preOrder[0]
					const root = new Node(rootValue);
					const rootIndexInInOrder = inOrder.indexOf(rootValue);
					if (rootIndexInInOrder < 0) {
						throw new Error('error');
					}
					const preOrderLeftChildString = preOrder.substring(1, rootIndexInInOrder + 1);
					const inOrderLeftChildString = inOrder.substring(0, rootIndexInInOrder);
					const preOrderRightChildString = preOrder.substring(rootIndexInInOrder + 1);
					const inOrderRightChildString = inOrder.substring(rootIndexInInOrder + 1);
					actionList.push({
						type: 'build',
						value: root
					});
					if (root) {
						actionList.push({
							type: 'parse',
							preOrder: preOrderLeftChildString,
							inOrder: inOrderLeftChildString
						});
						actionList.push({
							type: 'parse',
							preOrder: preOrderRightChildString,
							inOrder: inOrderRightChildString
						});
					}
					metaData.push(root);
					break;
				case 'build':
					break;
			}
		}
		return metaData.pop();
	}

	createParseRootAction(pre, middle) {
		return {
			type: 'parseRoot',
			pre: pre,
			middle: middle
		}
	}
}
$(() => {
	const button = $(`<button type='button'>run</button>`).appendTo(document.body);

	button.click(() => {
		const pre = 'cbdafeg';
		const middle = 'abcdefg';
		console.log(new TreeParser(pre, middle).process2());
	});
});
