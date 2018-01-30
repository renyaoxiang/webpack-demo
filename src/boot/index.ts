import { Dom } from "../lib";
Dom.onReady().then(() => {
	const div = document.createElement("div");
	div.innerHTML = `
			<ul>
				<li><a href='/'>index</a></li>
				<li><a href='/ai.html'>ai</a></li>
				<li><a href='/kmp.html'>kmp</a></li>
				<li><a href='/astar.html'>astar</a></li>
				<li><a href='/todo.html'>todo</a></li>
				<li><a href='/redux.html'>redux</a></li>
				<li><a href='/react-redux.html'>react-redux</a></li>
				<li><a href='/reduxTodo.html'>reduxTodo</a></li>
				<li><a href='/dumplicateSubStr.html'>reduxTodo</a></li>
			</ul>
		`;
	document.body.appendChild(div);
});
