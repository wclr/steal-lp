// Browser loader that will load !lp module as function that returns Promise
var getWindowLoader = function(name, address, load){
  return `
    /** @hot-deps **/
    module.exports = function(lang){
      if (typeof lang !== 'string'){
        console.warn('[steal-lp] illegal lang value for module ${name}:', lang)
        return new Promise.resolve({})
      }
      var moduleName = "${name}" + "/" + lang + ".js!" + lang + ".lp"
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
// it uses defaultLang and fallbackLang options from System.lp config
var getNodeLoader = function(name, address, load){
  var fs = require('fs')
  var langs = fs.readdirSync(address).map((f) => f.split('.')[0])

  load.metadata.deps = langs.map((lang) =>
    name + '/' + lang + '.js!' + lang + '.lp'
  )
  var lpConfig = System.lp || {},
    defaultLang = lpConfig.defaultLang || '',
    fallback = !!lpConfig.fallbackLang

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
      return System.import("${name}" + "/" + lang + ".js!" + lang + ".lp")
    }
    `
}

var matchLangPlugin = function(address){
  var match = address.match(/([\w\d-]+)\.lp\.js$/i)
  return match && match[1]
}

// Should use @loader in steal build process, not System
import loader from '@loader'

var oldFetch = loader.fetch;

loader.fetch = function(load) {
  var lang = matchLangPlugin(load.address)
  if (lang){
    // for steal build return plugin code for loading lang modules
    if (typeof window === 'undefined'){
      return `
        export function translate(load) {
          return 'define("' + load.name + '", function(require, exports, module){' +
          '' + load.source + '});'
        }
        export let buildType = '${lang}.lp'
        `
    } else {
      // for browser return empty plugin, with hot-reload support
      return '/** @hot-deps **/'
    }
  } else {
    return oldFetch.call(this, load)
  }
}

export function fetch(load) {
  // clean up everything before # and after !
  let name = load.name.replace(/!.*$/, '').replace(/.*#/, '')
  let address = load.address.replace(/^file:/, '').replace(/\\/g, '/')

  if (typeof window === 'undefined'){
    return getNodeLoader(name, address, load)
  } else {
    return getWindowLoader(name, address, load)
  }
}