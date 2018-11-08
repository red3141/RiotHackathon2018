const {app, BrowserWindow} = require('electron')

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
      // On certificate error we disable default behaviour (stop loading the page)
      // and we then say "it is all fine - true" to the callback
      event.preventDefault();
      callback(true);
  });

app.on('ready', ()=>{
  let browser = new BrowserWindow({
    width: 500,
    height: 500,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  })

  app.commandLine.appendSwitch('ignore-certificate-errors', 'true');


  browser.loadFile(`${__dirname}/bug.htm`)

  browser.webContents.openDevTools({mode: 'detach'})
})
