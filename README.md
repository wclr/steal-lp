#L-packs for StealJS apps.

L is for Language, Locale, Label, Lemming, Lenin, etc... 

Loads L-dictionary as function that takes L-name and returns promise to fulfil with dictionary data.

##When you need this

Well for example if your project needs **i18n, l10n** and you want to have simple, flexible and frictionless 
language packs configuration and **loading on demand at runtime** as in development and production.
Other use cases possible if you have some message/labels/entries dictionaries and you need to load them dynamically.  

##Usage

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
Just install it from npm `npm install steal-lp` for simple use map in system `config`:
```json
"map": {
  "./lp": "steal-lp"
}
```
 
If you want to use another `type` name just map it (and use for import):
```json
"map": {
  "./language.pack": "steal-lp"
}
```
While build `steal-tools` will create language-packs with (for example) `app-bundle.en-us.lp` extension (for every L-name) per bundle. 
So particular language bundle loads in production when it is only needed.

##Try the demo app
 
```bash
git clone http://github.com/whitecolor/steal-lp
npm install
npm build
npm app (or on other port than 7000: npm run app -- --port 9876)
```
Open in your browser `http://localhost:7000`
And you will see demo app.
**Open the console with network** to see how files are loading, then change languages.

To see how it works with dist (built) version open your browser `http://localhost:7000/dist`

Demo app's code be found in repo's `app` folder.