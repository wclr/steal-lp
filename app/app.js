import module1 from './module1/'
import module2 from './module2/'
import './app.css'

console.log('app loaded')

function render () {
  document.body.innerHTML += `
  <h3>This is a demo app for Steal-LP (Language/Label/Lemming packs).</h3>
  <p>Choose the language and lookup in console network<br> to see how language files are loaded on demand.</p>
`
  module1()
  module2()
}

document.body
  ? render()
  : window.onload = () => render()
