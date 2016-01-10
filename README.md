##L-packs for StealJS apps.

L is for Language, Locale, Label, Lemming, Lenin, etc... 

Loads L-dictionary as function that takes L-name and returns promise to fulfil with dictionary data.

##How to use

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

Plain use in code:
```javascript
import dict from './dict!lp'

dict('es').then(esDictData => {
  console.log(esDictData.name) // -> nombre
})
```
Just install it from npm `npm install steal-lp` (if available) or install from this repo for now and for simple use map in system config:
```json
"map": {
  "./lp": "steal-lp"
}
```
 
If you want to use another type just map it (and use for import):
```json
"map": {
  "./language.pack": "steal-lp"
}
```
While build `steal-tools` will create language-packs with (for example) `app-bundle.en-us.language.pack` extension (for every L-name) per bundle. 
So particular language bundle loads in production when it is only needed.

##Example app
 
Can be found in `test-app` folder
- pull the repo
- npm install
- run server to serve assets (*!NB in steal-lp root - otherwise dev version may not load*)
- check test-app/index.html - dev version
- node build.js - built (dist) version
- check test-app/index.dist.html