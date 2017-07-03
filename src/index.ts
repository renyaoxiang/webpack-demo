
document.addEventListener('DOMContentLoaded', () => {
    const div = document.createElement('div')
    div.innerHTML = `
        <ul>
            <li><a href='/'>index</a></li>
            <li><a href='/todo.html'>todo</a></li>
        </ul>
    `
    document.body.appendChild(div)
})