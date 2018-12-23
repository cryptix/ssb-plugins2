#! /usr/bin/env node

var path = require('path')
var fs = require('fs')

if (process.argv.length !== 3) {
  console.error(`usage: ${process.argv[1]} pluginPath`)
  process.exit(1)
}

const pluginPath = process.argv[2]
try {
  fs.statSync(pluginPath)
} catch (e) {
  console.error('could not locate specified pluginPath')
  console.warn('exception:', e)
  process.exit(1)
}

function localStub(type, name, args) {
  console.log('CALLED', type, name, args)
  var cb = args.pop()
  cb(null, { okay: true })
}

var {child, manifest} = require('./run')(pluginPath, localStub)
var api = require('muxrpc/api')({}, manifest, child)

api.callback('bob', function (err, value) {
  if (err) throw err
  console.log('from cb', value)
  api.hello('DARRYL', function (err, value) {
    if (err) throw err
    console.log('from hello', value)
    process.exit()
  })
})
