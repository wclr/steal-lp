import module1 from './module1/'
import module2 from  './module2/'

console.log('app loaded')

function render() {
  document.body.innerHTML += `
  <p>Choose the language and lookup in console network<br> to see how language files are loaded on demand.</p>
`

  module1()
  module2()
}

document.body
  ? render()
  : window.onload = () => render()