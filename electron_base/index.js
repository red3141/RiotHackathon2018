const {app, BrowserWindow} = require('electron')

app.on('ready', ()=>{
  let browser = new BrowserWindow({
    width: 1280,
    height: 720,
    transparent: true,
    frame: false,
    alwaysOnTop: true
  })
  
  browser.loadFile(`${__dirname}/bug.htm`)

  browser.webContents.openDevTools({mode: 'detach'})
})