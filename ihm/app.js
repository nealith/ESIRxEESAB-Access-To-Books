const path = require('path');
const yazl = require("yazl");
const fs = require('fs');

Vue.use(VueSimpleGesture);
Vue.use(VueSizeChanged);
Vue.use(VueSlides);
Vue.use(AlloyFingerVue);
Vue.use(VueDraggable);

window.onerror = function (msg, url, lineNo, columnNo, error) {
  // ... handle error ...
  console.log(msg);
  console.log(url);

  return false;
}

function newBook(name,path){
  ipcRenderer.send('walkonBook',{
    name:name,
    path:path
  })
}

function walkon(path){
  ipcRenderer.send('walkon',path);
}

ipcRenderer.on('receiveDirList', (event, arg) => {
  console.log(arg);
});

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

var alert;
var rotationButtons;
var keyboard;
var dialogue;
var mainStrip;
var montageStrip;
var libraryStrip;
var montageShutter;
var libraryShutter;
var zoom;


// SYNC DATA

var montages = remote.getGlobal('montages');
var books = remote.getGlobal('books');
var bonus = remote.getGlobal('bonus');


//----------------------------------------------------------------------
// ipc
//----------------------------------------------------------------------
