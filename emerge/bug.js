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



var fs = require('fs');

var port;
var password;
var lockfile;
var filepath = "C:/Riot Games/League of Legends/lockfile";
var championData;

fs.readFile(filepath, 'utf-8', (err, data) => {
    if(err){
      console.log("Windows Path Error :" + err.message);
      var filepath = "/Applications/League of Legends.app/Contents/LoL/lockfile";
      fs.readFile(filepath, 'utf-8', (err, data) => {
          if(err){
              console.log("Mac Path Error :" + err.message);
              return;
          }
          lockfile = data;
          processFile();
        }
      );
      return;
    }
    lockfile = data;
    processFile();
  }
);

fs.readFile('./PatchesByChamp.json', 'utf-8', (err, data) => {
	if (!err) {
		championData = JSON.parse(data);
	}
});


function processFile() {
    var res = lockfile.split(":");
    port = res[2];
    password = res[3];
}

var static;

(function() {
  var x = new XMLHttpRequest();
  x.onreadystatechange = function() { if (this.readyState == 4 && this.status == 200) {
      static = JSON.parse(x.response);
    }
  }
  x.open("POST", "http://builds.lol/hack/full.json");
  x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  x.send();
})();

function getPatchNotesForChampionIdAndAbility(championId, ability) {
	data = championData[championId];
	if (!data) {
		return "";
	}
	
	if (ability == "baseStats") {
		data = data["patches"];
		if (data.length > 0) {
			return '<br /><div class="name">' + data[0].version + '</div>' + '<div class="information">' + data[0].changes + '</div>';
		} else {
			return "";
		}
	} else {
		data = data[ability]["patches"];
		if (data.length > 0) {
			return '<br /><div class="name">' + data[0].version + '</div>' + '<div class="information">' + data[0].changes + '</div>';
		} else {
			return "";
		}
	}
}

var picks;
var chosen = new Object();
function readPicks() {
//  console.log(static);

  var x = new XMLHttpRequest();
  x.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    picks = JSON.parse(x.response);
    Object.keys(picks.actions).forEach(function(x) {
      Object.keys(picks.actions[x]).forEach(function(y) {
//      console.log(x+' '+y+ ' '+picks.actions[x][y].type+' '+ picks.actions[x][y].championId);
//      var pid = key+1;
      if (picks.actions[x][y].type == 'pick') chosen[parseInt(picks.actions[x][y].actorCellId)+1] = picks.actions[x][y].championId;
      });
    });
//    Object.keys(chosen).forEach(function(key) {
    for (var i=1; i<=10; i++) {
      var player = document.getElementById('player'+i);
      if (typeof chosen[i] != 'undefined') {
        var id = chosen[i];
//        console.log(i+' '+id);
        if (id) {
          var key = static.champion.id[id].key;
          //static.skills.Annie.P.image
          var pHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/champion/'+key+'.png">';

          //player.innerHTML = pHTML;
          $(player).html(pHTML);
		  var baseStatsPatchNotes = getPatchNotesForChampionIdAndAbility(id, "baseStats");
		  if (baseStatsPatchNotes.length > 0) {
			pHTML = baseStatsPatchNotes;
			$(player).find('.popup').html(pHTML);
		  }

          //var playerP = document.getElementById('player'+i+'p');
          //console.log("testing...", static.skills[key].P.image);
          pHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/passive/'+static.skills[key].P.image+'">';
          pHTML += '<div class="mouse popup">Test Tooltip</div>';
          $(player).siblings('.p').html(pHTML);
          pHTML = '<div class="name">'+static.skills[key].P.name+'</div>';
          pHTML+= '<div class="information">'+static.skills[key].P.description+'</div>';
		  var pPatchNotes = getPatchNotesForChampionIdAndAbility(id, "P");
		  if (pPatchNotes.length > 0) {
			  pHTML += pPatchNotes;
		  }
          $(player).siblings('.p').find('.popup').html(pHTML);

          //var playerQ = document.getElementById('player'+i+'q');
          qHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/spell/'+static.skills[key].Q.image+'">';
          qHTML += '<div class="mouse popup">Test Tooltip</div>';
          //playerQ.html(qHTML);
          $(player).siblings('.q').html(qHTML);
          qHTML = '<div class="name">'+static.skills[key].Q.name+'</div>';
          qHTML+= '<div class="information">'+static.skills[key].Q.description+'</div>';
          var qPatchNotes = getPatchNotesForChampionIdAndAbility(id, "Q");
		  if (qPatchNotes.length > 0) {
			  qHTML += qPatchNotes;
		  }
		  $(player).siblings('.q').find('.popup').html(qHTML);

          //var playerW = document.getElementById('player'+i+'w');
          wHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/spell/'+static.skills[key].W.image+'">';
          wHTML += '<div class="mouse popup">Test Tooltip</div>';
          // playerW.html(wHTML);
          $(player).siblings('.w').html(wHTML);
          wHTML = '<div class="name">'+static.skills[key].W.name+'</div>';
          wHTML+= '<div class="information">'+static.skills[key].W.description+'</div>';
          var wPatchNotes = getPatchNotesForChampionIdAndAbility(id, "W");
		  if (wPatchNotes.length > 0) {
			  wHTML += wPatchNotes;
		  }
		  $(player).siblings('.w').find('.popup').html(wHTML);

          //var playerE = document.getElementById('player'+i+'e');
          eHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/spell/'+static.skills[key].E.image+'">';
          eHTML += '<div class="mouse popup">Test Tooltip</div>';
          // playerE.html(eHTML);
          $(player).siblings('.e').html(eHTML);
          eHTML = '<div class="name">'+static.skills[key].E.name+'</div>';
          eHTML+= '<div class="information">'+static.skills[key].E.description+'</div>';
          var ePatchNotes = getPatchNotesForChampionIdAndAbility(id, "E");
		  if (ePatchNotes.length > 0) {
			  eHTML += ePatchNotes;
		  }
		  $(player).siblings('.e').find('.popup').html(eHTML);

          //var playerR = document.getElementById('player'+i+'r');
          rHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/spell/'+static.skills[key].R.image+'">';
          rHTML += '<div class="mouse popup">Test Tooltip</div>';
          // playerR.html(rHTML);
          $(player).siblings('.r').html(rHTML);
          rHTML = '<div class="name">'+static.skills[key].R.name+'</div>';
          rHTML+= '<div class="information">'+static.skills[key].R.description+'</div>';
          var rPatchNotes = getPatchNotesForChampionIdAndAbility(id, "R");
		  if (rPatchNotes.length > 0) {
			  rHTML += rPatchNotes;
		  }
		  $(player).siblings('.r').find('.popup').html(rHTML);
          


//http://ddragon.leagueoflegends.com/cdn/8.22.1/img/spell/AatroxE.png


        }
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

jQuery(document).ready(function($){
  //your code here

setInterval(function(){ 
  readPicks(); 
  console.log(chosen);
}, 1000);

});



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
