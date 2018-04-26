const {ipcRenderer} = require('electron');
const {remote} = require('electron');
const path = require('path');
var fs = require('fs');

Vue.use(AlloyFingerVue);

/*
var socket = io('http://localhost:3000');
socket.on('connect', function(){});
socket.on('test', function(data){console.log(data);});
socket.on('disconnect', function(){});
socket.emit('test',{msg:'test'});*/ // USED TO TEST SOCKETIO



window.client = new Caress.Client({
    host: 'localhost',
    port: 5000
});
client.connect();


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
  ss = s.substr(0,s.length-2);
  return parseFloat(ss);
}

var rotationButtons;
var keyboard;
var montageDialogue;
var mainStrip;
var montageStrip;
var libraryStrip;
var montageShutter;
var libraryShutter;

window.onresize = function(e){
    frame.oldH = frame.h;
    frame.oldW = frame.w;
    frame.h = window.innerHeight;
    frame.w = window.innerWidth;
    mainStrip.resize();
    montageStrip.resize();
    libraryStrip.resize();
    montageShutter.resize();
    libraryShutter.resize();
    keyboard.resize();
    montageDialogue.resize();
    rotationButtons.resize();
}

shutterController = {
  onLibraryStripMove:function(x){
    libraryShutter.style.width  = (strToFloat(libraryShutter.style.width) - x ) + 'px';
    montageShutter.style.width  = (strToFloat(montageShutter.style.width) + x ) + 'px';
  }
}

//----------------------------------------------------------------------
// ipc
//----------------------------------------------------------------------
