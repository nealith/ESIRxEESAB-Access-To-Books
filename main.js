const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const {ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win


const fs = require('fs')
const klaw = require('klaw')
const through2 = require('through2')
const sharp = require('sharp')

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
global.books = JSON.parse(fs.readFileSync(CONFIG.books.index))
global.montages = JSON.parse(fs.readFileSync(CONFIG.montages.index))
global.books_path = CONFIG.books.path
global.montages_path = CONFIG.montages.path

function saveBooksIndex(){
  if (global.books != undefined) {
    console.log('saveBooksIndex');
    var jsonData = JSON.stringify(global.books);
    if(jsonData.length != 0 && jsonData != '' && jsonData != ' ' && jsonData[0] == '[' && jsonData[jsonData.length-1] == ']'){
      console.log("test");
      fs.writeFile(CONFIG.books.index, jsonData, function(err) {
          if(err) {
              return console.log(err);
          }
      });
    }
  }

}

function saveMontagesIndex(){
  if (global.montages != undefined) {
    console.log('saveMontagesIndex');
    var jsonData = JSON.stringify(global.montages);
    if (jsonData.length != 0 && jsonData != '' && jsonData != ' ' && jsonData[0] == '[' && jsonData[jsonData.length-1] == ']') {
      fs.writeFile(CONFIG.montages.index, jsonData, function(err) {
          if(err) {
              return console.log(err);
          }
      });
    }
  }
}

//----------------------------------------------------------------------
// Librairy building
//----------------------------------------------------------------------

var book = {}

const Exts = [
  '.jpeg',
  '.jpg',
  '.png',
  '.webp',
  '.tif',
  '.tiff',
  '.gif',
  '.svg'
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
  console.log("addPage called");
  console.log(item);
  console.log(!item.stats.isDirectory());
  console.log(path.extname(item.path));
  if (!item.stats.isDirectory() && checkExt(path.extname(item.path))) {
    this.push(item)

    var page = {
      originalPath:item.path,
      description:path.basename(item.path),//'page n°'+book.pages.length,
      id:book.name+'_'+path.basename(item.path),//book.name+'_'+//book.pages.length,
      thumbnail:book.path+'thumbnail/'+path.basename(item.path)+'.png',//'page_'+book.pages.length+'.png',
      dzi:book.path+'dzi/'+path.basename(item.path)+'.dzi'//'page_'+book.pages.length+'.dz'
    }

    console.log('adding page....');
    console.log(page);

    book.pages[page.id] = page

     sharp(item.path)
     .resize(560, 360, {
       kernel: sharp.kernel.lanczos3
     })
     .max()
     .toFile(page.thumbnail,function(err){
       if (err === undefined || err == null) {
         sharp(item.path)
         .png()
        .tile()
         .toFile(page.dzi,function(err){
           if (err === undefined || err == null) {
             book.pages.push(page);
           } else {
             console.log(err)
             page.err = err
             book.pages.push(page);
           }
           next()
         })
       } else {
         console.log(err)
         page.err = err
         book.pages.push(page);
         next()
       }
     })
  } else {
    next()
  }
})

ipcMain.on('sortBooks',(event,arg) => {

  for (var i = 0; i < books.length; i++) {
    books[i].pages.sort(function(a,b){
      if (a.id.length == b.id.length) {
        if(a.id <= b.id){
          return -1;
        } else {
          return 1;
        }
      } else {
        return a.id.length - b.id.length
      }
    });
  }

  books.sort(function(a,b){
    return a.name < b.name
  })

  event.sender.send('sync_books',null)


})

ipcMain.on('saveBooks',(event,arg) => {

  saveBooksIndex();


})

ipcMain.on('walkonBook',(event,arg) => {

  book={
    name:arg.name,
    path:global.books_path+arg.name+'/',
    originalPath: arg.path,
    pages:[]
  }

  console.log('adding book....')
  console.log(book);

  var pages = []

  if (!fs.existsSync(book.path)){
    fs.mkdirSync(book.path);
  }

  if (!fs.existsSync(book.path+'dzi/')){
    fs.mkdirSync(book.path+'dzi/');
  }

  if (!fs.existsSync(book.path+'thumbnail/')){
    fs.mkdirSync(book.path+'thumbnail/');
  }

  if (!fs.existsSync(arg.path)){
    console.log(arg.path+" doesn't exist");
  }

  klaw(arg.path,{depthLimit:1})
    .pipe(addPage)
    .on('error', err => {
      event.sender.send('errorWhileWalkinOnBook',err)
      console.log(err)
    })
    .on('data', item => {
      if (!item.deleted) return
      pages.push(item.path)
    })
    .on('end', () => {
      console.dir(pages)
      console.log(book);
      book.pages.sort(function(a,b){

        return (a.id.length < b.id.length || a.id < b.id)
      })
      global.books.push(book)
      console.log(global.books);
      saveBooksIndex()
      event.sender.send('sync_books',null)
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
// tuio - CaressServer
//----------------------------------------------------------------------

var server = require('http').createServer();
var io = require('socket.io')(server);
var CaressServer = require('caress-server');
var caress = new CaressServer('0.0.0.0', 3333, {json: true});

caress.on('tuio', function(msg){
  console.log(msg);
});

/*io.enable("browser client minification");
io.enable("browser client etag");
io.enable("browser client gzip");
io.set("log level", 1);
io.set("transports", [
    "websocket",
    "flashsocket",
    "htmlfile",
    "xhr-polling",
    "jsonp-polling"
]);*/
io.sockets.on("connection", onSocketConnect);

function onSocketConnect(socket) {
    console.log("Socket.io Client Connected");

    caress.on('tuio', function(msg){
      socket.emit('tuio', msg);
    });

    socket.on("disconnect", function(){
      console.log("Socket.io Client Disconnected");
    });
}


server.listen(5000);

/*
//----------------------------------------------------------------------
// tuio
//----------------------------------------------------------------------

var Tuio = require('tuio-nw');
var tuioClient = new Tuio.Client({
  host: '127.0.0.1',
  port: 3333
});

var onAddTuioCursor = function (addCursor) {
  console.log(addCursor);
  //win.webContents.send('addTuioCursor' ,addCursor);
},

onUpdateTuioCursor = function (updateCursor) {
  console.log(updateCursor);
  //win.webContents.send('updateTuioCursor' ,updateCursor);
},

onRemoveTuioCursor = function (removeCursor) {
  console.log(removeCursor);
  //win.webContents.send('removeTuioCursor' ,removeCursor);
},

onAddTuioObject = function (addObject) {
  console.log(addObject);
  //win.webContents.send('addTuioObject' ,addObject);
},

onUpdateTuioObject = function (updateObject) {
  console.log(updateObject);
  //win.webContents.send('updateTuioObject' ,updateObject);
},

onRemoveTuioObject = function (removeObject) {
  console.log(removeObject);
  //win.webContents.send('removeTuioObject' ,removeObject);
},

onRefresh = function (time) {
  console.log(time);
  //win.webContents.send('refresh' ,time);
};

tuioClient.on('addTuioCursor', onAddTuioCursor);
tuioClient.on('updateTuioCursor', onUpdateTuioCursor);
tuioClient.on('removeTuioCursor', onRemoveTuioCursor);
tuioClient.on('addTuioObject', onAddTuioObject);
tuioClient.on('updateTuioObject', onUpdateTuioObject);
tuioClient.on('removeTuioObject', onRemoveTuioObject);
tuioClient.on('refresh', onRefresh);

tuioClient.listen();*/

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
  date = new Date();
  arg.day = date.getDate();
  arg.month = date.getMonth()+1;
  arg.year = date.getFullYear();

  pushed = false;
  for (var i = 0; i < global.montages.length; i++) {
    it = global.montages[i]
    if (it.year >= arg.year && it.month >= arg.month && it.day >= arg.day && it.name >= arg.name) {
      global.montages.splice(i,0,arg);
      pushed = true;
      break;
    }
  }
  if (!pushed) {
      global.montages.push(arg)
  }

  console.log('add montage : ')
  console.log(arg);

  //event.sender.send('sync_montages',null)
  event.sender.send('new_montage_added',arg)
})

//----------------------------------------------------------------------
// window
//----------------------------------------------------------------------

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
    //saveBooksIndex()
    //saveMontagesIndex()
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
