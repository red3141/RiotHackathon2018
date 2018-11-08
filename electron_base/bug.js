/*///////////////////////////////////////////////////////////////////////////////


  Extra information:
  ------------------
  - also affects browserWindow.reload()
  - addEventListener {passive: true}: no effect
  - addEventListener {capture: true}: no effect
  - electron.remote.getCurrentWindow() instead of browserwindow: no effect
  - browserWindow: {
      transparent: no effect
      frame: no effect
      alwaysOnTop: no effect
    }
  - BrowserWindow.getAllWindows()[0] === initialBrowserWindow: true
      (there is no window[1] after a reload)
      

///////////////////////////////////////////////////////////////////////////////*/
// BUGGED SECTION                                                              //
/////////////////////////////////////////////////////////////////////////////////


const electron = require('electron')
let browserWindow = electron.remote.getCurrentWindow()

function onMouseMove ( event ) {
  let el = event.target

  if (el.classList.contains('mouse') || el.classList.contains('window-handle')) {
    log(false, 'setIgnoreMouseEvents(false)')
    browserWindow.setIgnoreMouseEvents(false)
    // ^ manually calling this DOES work (previously thought it didn't)
  } else {
    log(true, 'setIgnoreMouseEvents(true, {forward: true})') 
    browserWindow.setIgnoreMouseEvents(true, {forward: true})
    // ^ this function stops forwarding after a refresh (CTRL+R)
  }
}

window.addEventListener('mousemove', onMouseMove)
window.addEventListener(
  'beforeunload', 
  event => window.removeEventListener('mousemove', onMouseMove)
)

/////////////////////////////////////////////////////////////////////////////////

// Logging with visual feedback
// - does not affect functionality or bug
console.log('browserWindow:', browserWindow)
function log ( color, text ) {
  let state = document.querySelector('.state')
  state.className = color ? 'state ignoring' : 'state'
  state.innerText = text
  console.log(text)
}