"use strict"

let args = require('minimist')(process.argv.slice(2))
const port = args.port || 8080
const express = require('express')
const app = express()
const electron = require('electron-prebuilt')
const proc = require('child_process')
const nwbExpress = require('nwb/express')

app.use(nwbExpress(express, {
  info: false,
  reload: true,
  autoInstall: true
}))

app.use(express.static('public'))

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.error('error starting server:')
    console.error(err.stack)
    process.exit(1)
  }
  console.log('server listening at http://localhost:' + port)

  if (args['run-electron']) {
    console.log('starting electron')
    const child = proc.spawn(electron, ['.', '--enable-logging'], {
      env: {
        DEV: true
      },
      stdio: "inherit"
    })

    child.on('exit', function(code) {
      process.exit()
    });
  }
})
