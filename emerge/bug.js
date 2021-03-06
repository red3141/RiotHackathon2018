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
var nameToIDData;

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

fs.readFile('./nameToId.json', 'utf-8', (err, data) => {
  if (!err) {
    nameToIDData = JSON.parse(data);
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


var counters;

(function() {
  var x = new XMLHttpRequest();
  x.onreadystatechange = function() { if (this.readyState == 4 && this.status == 200) {
      counters = JSON.parse(x.response);
      counters = counters[0].counterlose; 
      //console.log(counters);
    }
  }
  x.open("POST", "http://builds.lol/hack/counters.json");
  x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  x.send();
})();

var counterID = new Object();

// function findCounters(){
//   for (k = 1; k <=5; k ++){
//     if (!chosen[k]) {
//       continue;4
//     }
//     if (!counterID[chosen[k]]) {
//       counterID[chosen[k]] = new Set();
//     }
    
//     for (i = 6; i <=10; i ++) {
//       for (j = 0; j < 8; j ++){
//         if(chosen[i] == parseInt(nameToIDData[counters[chosen[k]][j][0]])){
//           counterID[chosen[k]].add(chosen[i]);
//           console.log(counterID[chosen[k]], chosen[i]);
//         }
//       }
//     }
//   }
// }

var counterList = [];
function findCounters(){
  counterList.length = 0;
  for (k = 1; k <=5; k ++){
    if (!chosen[k]) {
      continue;
    }
    if (!counterID[chosen[k]]) {
      counterID[chosen[k]] = new Set();
    }
    
    for (i = 6; i <=10; i ++) {
      for (j = 0; j < 8; j ++){
        if(chosen[i] == parseInt(nameToIDData[counters[chosen[k]][j][0]])){
          if (!counterList[k]) {
            counterList[k] = [];
          }
          counterList[k].push({'champ':chosen[i],'threatlevel':j.toString()});
        }
      }
    }
  }
}

function getPatchNotesForChampionIdAndAbility(championId, ability) {
	data = championData[championId];
	if (!data) {
		return ["none", ""];
	}
	
	if (ability == "baseStats") {
		data = data["patches"];
		if (data.length > 0) {
			return [data[0].type, '<div class="name" style="color:' + getColorForChangeType(data[0].type) + '"><span class="patchheader"> Patch ' + data[0].version.toFixed(2) + getTextForChangeType(data[0].type) + '</span></div>' + '<div class="information">' + data[0].changes + '</div>'];
		} else {
			return ["none", ""];
		}
	} else {
		data = data[ability]["patches"];
		if (data.length > 0) {
			return [data[0].type, '<br /><div class="name" style="color:' + getColorForChangeType(data[0].type) + '"><span class="patchheader"> Patch ' + data[0].version.toFixed(2) + getTextForChangeType(data[0].type) + '</span></div>' + '<div class="information">' + data[0].changes + '</div>'];
		} else {
			return ["none", ""];
		}
	}
}

function getColorForChangeType(changeType) {
	if (changeType == "other") {
		return "orange";
	}
	if (changeType == "buff") {
		return "green";
	}
	if (changeType == "nerf") {
		return "red";
	}
	return "#282828";
}

function getTextForChangeType(changeType) {
	if (changeType == "other") {
		return " - Change";
	}
	if (changeType == "buff") {
		return " - Buff";
	}
	if (changeType == "nerf") {
		return " - Nerf";
	}
	return "";
}

var picks;
//In a 5v5
//0-4 player team
//5-9 opponent team
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

    findCounters();
    var cHTML = '';
    for (i = 1; i <= 5; i++){
      cHTML = '<img src="resources/warning2.png" id="counter" alt="counter" class="image" />';
      
      if (counterList[i] && counterList[i].length > 0) {
        cHTML += '<div class="mouse popup"></div>';
        $("#warning"+i).css('visibility', 'visible');
      } else {
        $("#warning"+i).css('visibility', 'hidden');
      }
      $("#warning"+i).html(cHTML);
      if (counterList[i] && counterList[i].length > 0) {
        //console.log(chosen, counterID);
        var champImages = "";
        //console.log(counterList[i]);
        $.each(counterList[i], function(index,c) {
          console.log(arguments);
          champ = c.champ;
          threat = c['threatlevel'];
          console.log('info',champ,threat);
          var key = static.champion.id[champ].key;
          var tooltip = "";
          if (threat == 1 || threat == 2) {
            tooltip = "is a hard counter!";
          }
          if (threat == 3 || threat == 4 || threat == 5) {
            tooltip = "is a medium counter!";
          }
          if (threat == 6 || threat == 7 || threat == 8) {
            tooltip = "is a lower counter!";
          }
          champImages+="<div class='champ-counter level"+threat+"' title='"+tooltip+"'>"+'<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/champion/'+key+'.png" />'+"</div>";
        });
       cHTML = '<div class="champion-counter-container"><div class="title">Countered By</div>' + champImages + "</div>";
       //console.log(JSON.stringify(cHTML));
       $("#warning"+i).find('.popup').html(cHTML);
      }
    }

//    Object.keys(chosen).forEach(function(key) {
    for (var i=1; i<=10; i++) {
      var player = document.getElementById('player'+i);
      if (typeof chosen[i] != 'undefined') {
        var id = chosen[i];
//        console.log(i+' '+id);
        if (id) {
          var key = static.champion.id[id].key;
          //static.skills.Annie.P.image
		  var baseStatsPatchNotes = getPatchNotesForChampionIdAndAbility(id, "baseStats");
		  var changeType = baseStatsPatchNotes[0];
		  baseStatsPatchNotes = baseStatsPatchNotes[1];
		  var color = getColorForChangeType(changeType);
          var pHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/champion/'+key+'.png" style="border:3px solid ' + color + '">';
      
      if (baseStatsPatchNotes.length > 0) {
		    pHTML += '<div class="mouse popup"></div>';
			$(player).css('visibility', 'visible');
		  } else {
			  $(player).css('visibility', 'hidden');
		  }
		  
          //player.innerHTML = pHTML;
      $(player).html(pHTML);
		  if (baseStatsPatchNotes.length > 0) {
			 pHTML = baseStatsPatchNotes;
			 $(player).find('.popup').html(pHTML);
		  }

          //var playerP = document.getElementById('player'+i+'p');
          //console.log("testing...", static.skills[key].P.image);
		  var pPatchNotes = getPatchNotesForChampionIdAndAbility(id, "P");
		  changeType = pPatchNotes[0];
		  pPatchNotes = pPatchNotes[1];
		  color = getColorForChangeType(changeType);
          pHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/passive/'+static.skills[key].P.image+'" style="border:3px solid ' + color + '">';
          pHTML += '<div class="mouse popup"></div>';
          $(player).siblings('.p').html(pHTML);
          pHTML = '<div class="name"><span class="keybind">Passive -</span> '+static.skills[key].P.name+'</div>';
          pHTML+= '<div class="information">'+static.skills[key].P.description+'</div>';
		  if (pPatchNotes.length > 0) {
			  pHTML += pPatchNotes;
		  }
          $(player).siblings('.p').find('.popup').html(pHTML);

          //var playerQ = document.getElementById('player'+i+'q');
		  var qPatchNotes = getPatchNotesForChampionIdAndAbility(id, "Q");
		  changeType = qPatchNotes[0];
		  qPatchNotes = qPatchNotes[1];
		  color = getColorForChangeType(changeType);
          qHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/spell/'+static.skills[key].Q.image+'" style="border:3px solid ' + color + '">';
          qHTML += '<div class="mouse popup"></div>';
          //playerQ.html(qHTML);
          $(player).siblings('.q').html(qHTML);
          qHTML = '<div class="name"><span class="keybind">Q -</span> '+static.skills[key].Q.name+'</div>';
          qHTML+= '<div class="information"><span class="cooldown">Cooldown: </span>'+static.skills[key].Q.cooldown+' seconds</div>';
          qHTML+= '<div class="information">'+static.skills[key].Q.description+'</div>';
		  if (qPatchNotes.length > 0) {
			  qHTML += qPatchNotes;
		  }
		  $(player).siblings('.q').find('.popup').html(qHTML);

          //var playerW = document.getElementById('player'+i+'w');
		  var wPatchNotes = getPatchNotesForChampionIdAndAbility(id, "W");
		  changeType = wPatchNotes[0];
		  wPatchNotes = wPatchNotes[1];
		  color = getColorForChangeType(changeType);
          wHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/spell/'+static.skills[key].W.image+'" style="border:3px solid ' + color + '">';
          wHTML += '<div class="mouse popup"></div>';
          // playerW.html(wHTML);
          $(player).siblings('.w').html(wHTML);
          wHTML = '<div class="name"><span class="keybind">W -</span> '+static.skills[key].W.name+'</div>';
          wHTML+= '<div class="information"><span class="cooldown">Cooldown: </span>'+static.skills[key].W.cooldown+' seconds</div>';
          wHTML+= '<div class="information">'+static.skills[key].W.description+'</div>';
		  if (wPatchNotes.length > 0) {
			  wHTML += wPatchNotes;
		  }
		  $(player).siblings('.w').find('.popup').html(wHTML);

          //var playerE = document.getElementById('player'+i+'e');
		  var ePatchNotes = getPatchNotesForChampionIdAndAbility(id, "E");
		  changeType = ePatchNotes[0];
		  ePatchNotes = ePatchNotes[1];
		  color = getColorForChangeType(changeType);
          eHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/spell/'+static.skills[key].E.image+'" style="border:3px solid ' + color + '">';
          eHTML += '<div class="mouse popup"></div>';
          // playerE.html(eHTML);
          $(player).siblings('.e').html(eHTML);
          eHTML = '<div class="name"><span class="keybind">E -</span> '+static.skills[key].E.name+'</div>';
          eHTML+= '<div class="information"><span class="cooldown">Cooldown: </span>'+static.skills[key].E.cooldown+' seconds</div>';
          eHTML+= '<div class="information">'+static.skills[key].E.description+'</div>';
		  if (ePatchNotes.length > 0) {
			  eHTML += ePatchNotes;
		  }
		  $(player).siblings('.e').find('.popup').html(eHTML);

          //var playerR = document.getElementById('player'+i+'r');
		  var rPatchNotes = getPatchNotesForChampionIdAndAbility(id, "R");
		  changeType = rPatchNotes[0];
		  rPatchNotes = rPatchNotes[1];
		  color = getColorForChangeType(changeType);
          rHTML = '<img src="http://ddragon.leagueoflegends.com/cdn/8.22.1/img/spell/'+static.skills[key].R.image+'" style="border:3px solid ' + color + '">';
          rHTML += '<div class="mouse popup"></div>';
          // playerR.html(rHTML);
          $(player).siblings('.r').html(rHTML);
          rHTML = '<div class="name"><span class="keybind">R -</span> '+static.skills[key].R.name+'</div>';
          rHTML+= '<div class="information"><span class="cooldown">Cooldown: </span>'+static.skills[key].R.cooldown+' seconds</div>';
          rHTML+= '<div class="information">'+static.skills[key].R.description+'</div>';
		  if (rPatchNotes.length > 0) {
			  rHTML += rPatchNotes;
		  }
		  $(player).siblings('.r').find('.popup').html(rHTML);
      
          

if (this.readyState == 4 && this.status === 404) {
          //console.log('Not in Champion Select');
          $('#patch-notes-container').removeClass('show-pregame');
          $('[id^=player]').css('visibility', 'hidden');
          $('[id^=warning]').css('visibility', 'hidden');
          $('.toggle-button').hide();
    } else {
      $('#patch-notes-container').addClass('show-pregame');
      $('.toggle-button').show();

    }
//http://ddragon.leagueoflegends.com/cdn/8.22.1/img/spell/AatroxE.png


        }
      } else {
        // player.innerHTML = 'P'+i+' 404';
        player.innerHTML = '';
      }
    }
    //console.log(chosen);
    }
    if (this.readyState == 4 && this.status === 404) {
          //console.log('Not in Champion Select');
          $('#patch-notes-container').removeClass('show-pregame');
          $('[id^=player]').css('visibility', 'hidden');
          $('[id^=warning]').css('visibility', 'hidden');
          $('.toggle-button').hide();
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

globalInterval = setInterval(function(){ 
  readPicks(); 
  //console.log(chosen);
}, 1000);

});



function onMouseMove ( event ) {
  let el = event.target

  if (el.classList.contains('mouse') || el.classList.contains('window-handle')) {
    //log(false, 'setIgnoreMouseEvents(false)')
    browserWindow.setIgnoreMouseEvents(false)
    // ^ manually calling this DOES work (previously thought it didn't)
  } else {
    //log(true, 'setIgnoreMouseEvents(true, {forward: true})')
    browserWindow.setIgnoreMouseEvents(true, {forward: true})
    // ^ this function stops forwarding after a refresh (CTRL+R)
  }
}

window.addEventListener('mousemove', onMouseMove)
window.addEventListener(
  'beforeunload',
  event => window.removeEventListener('mousemove', onMouseMove)
)

window.addEventListener('click', onToggleClicked)
window.addEventListener(
  'beforeunload',
  event => window.removeEventListener('click', onToggleClicked)
)

function onToggleClicked ( event ) {
  let el = event.target
  if (el.classList.contains('toggle-button')) {
      //console.log('clicked');
    $('#toggle-container').toggle();
  } else {
  }
}//////////////////////////////////////////////////////////////////////////

// Logging with visual feedback
// - does not affect functionality or bug
console.log('browserWindow:', browserWindow)
function log ( color, text ) {
  let state = document.querySelector('.state')
  state.className = color ? 'state ignoring' : 'state'
  state.innerText = text
  console.log(text)
}
