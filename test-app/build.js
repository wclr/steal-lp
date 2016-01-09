var stealTools = require('steal-tools')

stealTools.build({
    main: 'app',
    config: 'package.json!npm',
    bundlesPath: 'dist'
  },
  {
    minify: false,
    bundleSteal: true
  })
  .then(function(){
    console.log('Build finished.')
  })