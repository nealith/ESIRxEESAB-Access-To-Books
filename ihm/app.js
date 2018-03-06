const {ipcRenderer} = require('electron');
const {remote} = require('electron');


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
