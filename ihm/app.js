const {ipcRenderer} = require('electron');
const {remote} = require('electron');
const path = require('path');
var fs = require('fs');

// closed

function beforeClosing(){
  var toCall = function() {};
  for (var i = 0; i < close.length; i++) {
    toCall = onClosed[i];
    toCall();
  }
}

var onClosed = [];

ipcRenderer.on('unload', (event, arg) => {
    beforeClosing()
    ipcRenderer.send('closed',null);
});

remote.getCurrentWindow().on('close', () => {
  beforeClosing()
})

/*window.addEventListener('unload', function(event) {
  beforeClosing()
})

window.addEventListener('beforeunload', function(event) {
  beforeClosing()
})

window.addEventListener('close', function(event) {
  beforeClosing()
})

window.addEventListener('closed', function(event) {
  beforeClosing()
})*/

///DEBUG
//console.log('app:launch');

var frame = {
  h:window.innerHeight,
  w:window.innerWidth,
  oldH:0,
  oldW:0

}

const sizePourcent = 0.03125;

var mouseCoord = {
  x:0,
  y:0
}

window.addEventListener('mousemove',function(e){
  mouseCoord.x = e.clientX;
  mouseCoord.y = e.clientY;
});

function strToFloat(s){
  //DEBUG
  //console.log('strToFloat:'+s);
  ss = s.substr(0,s.length-2);
  return parseFloat(ss);
}

var keyboard;
var montageDialogue;
var mainStrip;
var montageStrip;
var libraryStrip;
var montageShutter;
var libraryShutter;

window.onresize = function(e){
    //DEBUG
    //console.log('screen:resize');
    frame.oldH = frame.h;
    frame.oldW = frame.w;
    frame.h = window.innerHeight;
    frame.w = window.innerWidth;
    mainStrip.resize();
    montageStrip.resize();
    libraryStrip.resize();
    montageShutter.resize();
    libraryShutter.resize();
}

shutterController = {
  onLibraryStripMove:function(x){
    //DEBUG
    //console.log('shutterController:onLibraryStripMove:'+x);
    libraryShutter.style.width  = (strToFloat(libraryShutter.style.width) - x ) + 'px';
    montageShutter.style.width  = (strToFloat(montageShutter.style.width) + x ) + 'px';

    //ipcRenderer.send('stripMoved',{libraryShutterWidth:libraryShutter.style.width,montageShutterWidth:montageShutter.style.width});
  }
}

//----------------------------------------------------------------------
// ipc
//----------------------------------------------------------------------
