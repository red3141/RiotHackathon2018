const electron = require('electron')

let browserWindow = electron.remote.getCurrentWindow()

var fs = require('fs');

var port;
var password;
var lockfile;
var filepath = "/Applications/League of Legends.app/Contents/LoL/lockfile";
fs.readFile(filepath, 'utf-8', (err, data) => {
    if(err){
        alert("An error ocurred reading the file :" + err.message);
        return;
    }
    lockfile = data;
    processFile();
  }
);




function processFile() {
    var res = lockfile.split(":");
    port = res[2];
    password = res[3];
/*
    (function() {
     	var x = new XMLHttpRequest();
   //  	var recent = document.getElementById('recent');
     	x.onreadystatechange = function() { if (this.readyState == 4 && this.status == 200)
   //       recent.innerHTML = x.response;
           console.log('request');
          console.log(x.response);
        }
     	x.open("GET", "https://127.0.0.1:"+port+"/lol-champ-select/v1/session");
     	x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
       x.setRequestHeader("Authorization", "Basic " + btoa("riot:"+password));
       x.setRequestHeader("Accept", "application/json");
       console.log('requeststart');
 //      console.log(x);
     	x.send();
     })();
*/
}

var static;

(function() {
  var x = new XMLHttpRequest();
  x.onreadystatechange = function() { if (this.readyState == 4 && this.status == 200) {
      static = JSON.parse(x.response);
    }
  }
  x.open("POST", "json/full.json");
  x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  x.send();
})();



var picks;
var chosen = new Object();
function readPicks() {
  var x = new XMLHttpRequest();
  x.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
//      console.log(x.response);
    picks = JSON.parse(x.response);
    Object.keys(picks.actions[0]).forEach(function(key) {
      if (picks.actions[0][key].type == 'pick') chosen[picks.actions[0][key].actorCellId] = picks.actions[0][key].championId;
    });
//    Object.keys(chosen).forEach(function(key) {
    for (var i=0; i<10; i++) {
      var player = document.getElementById('player'+i);
      if (typeof chosen[i] != 'undefined') {
        var id = chosen[i];
        console.log(i+' '+id);
        if (id) player.innerHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/champion/'+static.champion.id[id].key+'.png">';
      } else {
        player.innerHTML = 'P'+i+' 404';
      }
    }
    console.log(chosen);
    }
    if (this.readyState == 4 && this.status === 404) {
          console.log('Not in Champion Select');
    }
  }
  x.open("GET", "https://127.0.0.1:"+port+"/lol-champ-select/v1/session");
  x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   x.setRequestHeader("Authorization", "Basic " + btoa("riot:"+password));
   x.setRequestHeader("Accept", "application/json");
  /*
  x.open("POST", "http://app/pick.php?"+Math.random());
  x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); */
  x.send();
};

setInterval(function(){ readPicks(); }, 1000);

/*



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
*/
