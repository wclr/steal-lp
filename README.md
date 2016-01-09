Language packs for StealJS apps.

It loads language dictionary as function that takes language (locale) and returns promise to fullfil with dictionary data.

Dictionaries are stored as separate CJS modules for every language usually per component:

my-component/dict/en.js:
```javascript
module.exports = {
  name: 'name'
}
```

my-component/dict/es.js:
```javascript
module.exports = {
  name: 'nombre'
}
```

Plain use:
```javascript
import dict from './dict!lp'

dict('es').then(esDictData => {
  console.log(esDictData.name) // -> nombre
})

FJust install it from this repo and for simpler use map in system config:
```json
"map": {
  "./lp": "steal-lp/lp"
}
```


Example app can be found in `test-app` folder
pull the repo
npm install

!NB run http server in steal-lp root (other wise wont work)

check test-app/index.html - steal dev version

To check built (dist) version:
node build.js
check test-app/index.dist.html


