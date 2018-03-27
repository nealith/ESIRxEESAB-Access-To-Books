const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const {ipcMain} = require('electron') 


const fs = require('fs')
const klaw = require('klaw')
const through2 = require('through2')

const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://192.168.38.1')

/*
 * MQTT Communications
 *
 */

const voicepi_status = 'voicepi/status';
const voicepi_mic0_status = 'voicepi/0/status';
const voicepi_mic0_message = 'voicepi/0/message';

client.on('connect', () => {
  client.subscribe(voicepi_status)
  client.subscribe(voicepi_mic0_status)
  client.subscribe(voicepi_mic0_message)
})

client.on('message', (topic, message) => {
  switch (topic) {
    case voicepi_status:
      return processVoiceStatus(message)
    case voicepi_mic0_status:
      return processNewMic(message)
    case voicepi_mic0_message:
      return processVoiceMessage(message)
  }
  console.log('No handler for topic %s', topic)
})

function processVoiceStatus (message) {
    console.log('Voice connected status %s', message)
    data = JSON.parse(message)
}
function processNewMic (message) {
  console.log('Mic connected status %s', message)
    data = JSON.parse(message)
}
function processVoiceMessage (message) {
    console.log('New voice message %s', message)
    data = JSON.parse(message)
}

const CONFIG = require('./config.json')
global.books = require(CONFIG.books.index)
global.montages = require(CONFIG.montages.index)
global.books_path = CONFIG.montages.path
global.montages_path = CONFIG.montages.path

function saveBooksIndex(){
  var jsonData = JSON.stringify(global.books);
  fs.writeFile(CONFIG.books.index, jsonData, function(err) {
      if(err) {
          return console.log(err);
      }
  });
}

function saveMontagesIndex(){
  var jsonData = JSON.stringify(global.montages);
  fs.writeFile(CONFIG.montages.index, jsonData, function(err) {
      if(err) {
          return console.log(err);
      }
  });
}

//----------------------------------------------------------------------
// Librairy building
//----------------------------------------------------------------------

var book = {}

const Exts = [
  "jpeg",
  "jpg",
  "png",
  "webp",
  "tiff",
  "gif",
  "svg"
]

function checkExt(ext){
  for (var i = 0; i < Exts.length; i++) {
    if(Exts[i].toUpperCase() === ext.toUpperCase()){
      return true
    }
  }
  return false
}

const addPage = through2.obj(function (item, enc, next) {
  if (!item.stats.isDirectory() && checkExt(path.extname(item.path))) {
    this.push(item)

//     sharp(item.path)
//     .resize(560, 360, {
//       kernel: sharp.kernel.lanczos3
//     })
//     .max()
//     .toFile(book.path+"page_"+book.page.length+".png",function(err){
//       if (err === undefined) {
//         book.pages.push({
//           originalPath:item.path,
//           description:"page "+book.page.length,
//           src:book.path+"page_"+book.page.length+".png",
//           id:book.name+'_'+book.page.length
//         })
//         next()
//       } else {
//         console.log(err)
//       }
//     })
  } else {
    next()
  }
})


ipcMain.on('walkonBook',(event,arg) => {

  book={
    name:arg.name,
    path:BOOKS_PATH+arg.name+'/',
    originalPath: arg.path,
    pages:[

    ]
  }

  var pages = []

  klaw(arg.path)
    .pipe(addPage)
    .on('error', err => event.sender.send('errorWhileWalkinOnBook',err))
    .on('data', item => {
      if (!item.deleted) return
      pages.push(item.path)
    })
    .on('end', () => {
      console.dir(pages)
      global.books.push(book)
      saveBooksIndex()
      event.sender.send('receiveNewBook',null)
    })

})

//----------------------------------------------------------------------
// Rerpertory walking
//----------------------------------------------------------------------

var dirs = []

const onlyDir = through2.obj(function (item, enc, next) {
  if (item.stats.isDirectory()) {
    this.push(item)
    dirs.push({
      name:path.basename(item),
      path:item.path
    })
  }
  next()
})

var items = [] // files, directories, symlinks, etc

ipcMain.on('walkon',(event,arg) => {

  klaw(arg)
    .pipe(onlyDir)
    .on('data', item => items.push(item.path))
    .on('end', () => {
      console.dir(items)
      event.sender.send('receiveDirList',dirs)
    })

})

//----------------------------------------------------------------------
// ipc
//----------------------------------------------------------------------

ipcMain.on('stripMoved',(event,arg) => {
  console.log(arg)
})

ipcMain.on('test',(event,arg) => {
  console.log(global.montages)
})

ipcMain.on('new_montage',(event,arg) => {
  global.montages.push(arg)
  //event.sender.send('sync_montages',null)
  event.sender.send('new_montage_added',arg)
})

//----------------------------------------------------------------------
// window
//----------------------------------------------------------------------

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

ipcMain.on('closed',(event,arg) => {
  win = null
})

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({fullscreen:true,autoHideMenuBar:true})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))




  // Open the DevTools.
  win.webContents.openDevTools()

  win.on('close', () => {
    //event.preventDefault()
    saveBooksIndex()
    saveMontagesIndex()
    //win.webContents.send('unload', null);
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
