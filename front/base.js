const {ipcRenderer} = require('electron');
const {remote} = require('electron');

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
