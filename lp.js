// Browser loader that will load !lp module as function that returns Promise
var getWindowLoader = function(name, address, load, lpType){
  return `
    /** @hot-deps **/
    module.exports = function(lang){
      if (typeof lang !== 'string'){
        console.warn('[steal-lp] illegal lang value for module ${name}:', lang)
        return new Promise.resolve({})
      }
      var moduleName = "${name}" + "/" + lang + ".js!" + lang + ".${lpType}"
      var loaded = System.import(moduleName)
      // modify System._traceData for System.getDependants to work
      System._traceData && loaded.then(function(){
        if (System._traceData.parentMap){
          System._traceData.parentMap[moduleName] = {}
          System._traceData.parentMap[moduleName]['${load.name}'] = true
          var loads = (System.loads || System._traceData.loads)
          loads && loads[moduleName] && (loads[moduleName].hotDeps = true)
        }
      })
      return loaded
    }
    `
}

// Node loader that will load !lp module as function that returns Promise
// it uses `default` and `fallback` options from System.lp config
var getNodeLoader = function(name, address, load, lpType){
  var fs = require('fs')
  var langs = fs.readdirSync(address).map((f) => f.split('.')[0])

  load.metadata.deps = langs.map((lang) =>
    name + '/' + lang + '.js!' + lang + '.' + lpType
  )
  var lpConfig = (System.lp && System.lp[lpType]) || System.lp || {},
    defaultLang = lpConfig.default || '',
    fallback = !!lpConfig.fallback

  langs = langs.map((lang) => '"' + lang + '"').join()

  return `
    module.exports = function(lang){
      var langs = [${langs}]
      var defaultLang = "${defaultLang}"
      if ([langs].indexOf(lang) < 0){
        if (defaultLang && langs.indexOf(defaultLang) < 0){
          if (${fallback} && langs.length){
            lang = lang[0]
          } else {
            return Promise.resolve({})
          }
        }
      }
      return System.import("${name}" + "/" + lang + ".js!" + lang + ".${lpType}")
    }
    `
}

var lpTypes = {}
var lpMatchRegExp

var addLpType = function(lpType){
  if (lpTypes[lpType]) return
  lpTypes[lpType] = true
  var types = Object.keys(lpTypes).join('|')
  lpMatchRegExp = new RegExp(`([\\w\\d-]+)\\.(${types})\\.js$`, 'i')
}

var matchLangPlugin = function(address){

  var match = lpMatchRegExp && address.match(lpMatchRegExp)
  match && match.shift()
  return match
}

// Should use @loader in steal build process, not System
import loader from '@loader'

var _fetch = loader.fetch;

loader.fetch = function(load) {
  var match = matchLangPlugin(load.address)
  if (match){
    // for steal build return plugin code for loading lang modules
    if (typeof window === 'undefined'){
      return `
        export function translate(load) {
          return 'define("' + load.name + '", function(require, exports, module){' +
          '' + load.source + '});'
        }
        export let buildType = '${match[0]}.${match[1]}'
        `
    } else {
      // for browser return empty plugin, with hot-reload support
      return '/** @hot-deps **/'
    }
  } else {
    return _fetch.apply(this, arguments)
  }
}

export function fetch(load) {
  // clean up everything before # and after !
  let name = load.name.replace(/!.*$/, '').replace(/.*#/, '')
  let address = load.address.replace(/^file:/, '').replace(/\\/g, '/')

  let lpType = 'lp'
  // In node loader.getDependants returns empty result, while System works
  if (System.getDependants){
    var loads = System.loads || (System._traceData && System._traceData.loads)
    var parent = System.getDependants(load.name)[0]
    var meta = loads && parent && loads[parent] && loads[parent].metadata
    var dep = meta && meta.deps[meta.dependencies.indexOf(load.name)]
    dep && (lpType =  dep.match(/!(.*)$/)[1])
  }
  addLpType(lpType)

  if (typeof window === 'undefined'){
    return getNodeLoader(name, address, load, lpType)
  } else {
    return getWindowLoader(name, address, load, lpType)
  }
}