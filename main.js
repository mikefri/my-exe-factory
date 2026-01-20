const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({ width: 1000, height: 800 })
  win.loadFile('src/index.html') // Ton site extrait du ZIP
}

app.whenReady().then(createWindow)
