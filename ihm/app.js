const {ipcRenderer} = require('electron');
const {remote} = require('electron');
const path = require('path');
const yazl = require("yazl");
const fs = require('fs');

Vue.use(VueSimpleGesture);
Vue.use(VueSizeChanged);
Vue.use(VueSlides);
Vue.use(AlloyFingerVue);
Vue.use(VueDraggable);

//shorcut
function byId(id){
  return document.getElementById(id);
}

function byTag(tag){
  return document.getElementsByTagName(tag)
}

function byClass(clas){
  return document.getElementsByClassName(clas);
}

function rect(el){
  return el.getBoundingClientRect();
}





function newBook(name,path){
  ipcRenderer.send('walkonBook',{
    name:name,
    path:path
  })
}

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

function strToFloat(s){
  ss = s.substr(0,s.length-2);
  return parseFloat(ss);
}

var rotationButtons;
var keyboard;
var dialogue;
var mainStrip;
var montageStrip;
var libraryStrip;
var montageShutter;
var libraryShutter;
var zoom;
var splash;

window.onresize = function(e){
    frame.oldH = frame.h;
    frame.oldW = frame.w;
    frame.h = window.innerHeight;
    frame.w = window.innerWidth;
/*    mainStrip.resize();
    montageStrip.resize();
    libraryStrip.resize();
    montageShutter.resize();
    libraryShutter.resize();
    keyboard.resize();
    montageDialogue.resize();
    rotationButtons.resize();
    zoom.resize();
    splash.resize();
*/}

shutterController = {
  onLibraryStripMove:function(x){
    libraryShutter.style.width  = (strToFloat(libraryShutter.style.width) - x ) + 'px';
    montageShutter.style.width  = (strToFloat(montageShutter.style.width) + x ) + 'px';
    zoom.style.width = montageShutter.style.width;
    zoom.styleReduced.width = montageShutter.style.width;
  }
}

// SYNC DATA

var montages = remote.getGlobal('montages');
var books = remote.getGlobal('books');
var bonus = remote.getGlobal('bonus');


//----------------------------------------------------------------------
// ipc
//----------------------------------------------------------------------
