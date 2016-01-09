##Language packs for StealJS apps.

Loads language (locales) dictionary as function that takes language and returns promise to fulfil with dictionary data.

##How to use

Dictionaries are stored as separate CJS modules for every language usually per component:

`my-component/dict/en.js:`
```javascript
module.exports = {
  name: 'name'
}
```

`my-component/dict/es.js:`
```javascript
module.exports = {
  name: 'nombre'
}
```

Plain use in code:
```javascript
import dict from './dict!lp'

dict('es').then(esDictData => {
  console.log(esDictData.name) // -> nombre
})
```
Just install it from npm `npm install steal-lp` (when published) and for simple use map in system config:
```json
"map": {
  `"./lp": "steal-lp"`
}
```
If install from repo you may need to map `"./lp": "./node_modules/steal-lp/lp"` (StealJS bug) 

While build `steal-tools` will create language-packs with `*.en.lp` extension (for every language) per bundle. 
So particular language bundle loads in production when it is only needed.

##Example app
 
Can be found in `test-app` folder
- pull the repo
- npm install
- run server to serve assets (*!NB in steal-lp root - otherwise dev version may not load*)
- check test-app/index.html - dev version
- node build.js - built (dist) version
- check test-app/index.dist.html


