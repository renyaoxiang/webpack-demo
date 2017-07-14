import { Dom } from "../lib";
Dom.onReady().then(() => {
	const div = document.createElement("div");
	div.innerHTML = `
			<ul>
				<li><a href='/'>index</a></li>
				<li><a href='/todo.html'>todo</a></li>
				<li><a href='/redux.html'>redux</a></li>
				<li><a href='/reduxTodo.html'>redux</a></li>
			</ul>
		`;
	document.body.appendChild(div);
});
