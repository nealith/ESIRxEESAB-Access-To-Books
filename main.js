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
const sizeOf = require('image-size');

/*
 * MQTT Communications
 *
 */

 const mqtt = require('mqtt')
 const client = mqtt.connect('mqtt://192.168.38.1')

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

//----------------------------------------------------------------------
// CONFIG AND DATA FILES
//----------------------------------------------------------------------

const CONFIG = require('./config.json')

if (fs.existsSync(CONFIG.books.index)){
  global.books = JSON.parse(fs.readFileSync(CONFIG.books.index))
} else {
  global.books = []
}

if (fs.existsSync(CONFIG.bonus.index)){
  global.bonus = JSON.parse(fs.readFileSync(CONFIG.bonus.index))
} else {
  global.bonus = []
}

if (fs.existsSync(CONFIG.montages.index)){
  global.montages = JSON.parse(fs.readFileSync(CONFIG.montages.index))
} else {
  global.montages = []
}



global.books_path = CONFIG.books.path
global.bonus_path = CONFIG.bonus.path
global.montages_path = CONFIG.montages.path
global.user = CONFIG.user
global.path_media = CONFIG.pathMedia
global.debug = CONFIG.debug
global.enableTuio = CONFIG.enableTuio
global.tuioData = CONFIG.tuioData
global.eventToPrint = CONFIG.eventToPrint

if (!fs.existsSync(global.books_path)){
  fs.mkdirSync(global.books_path);
}

if (!fs.existsSync(global.bonus_path)){
  fs.mkdirSync(global.bonus_path);
}

if (!fs.existsSync(global.montages_path)){
  fs.mkdirSync(global.montages_path);
}


function saveBooksIndex(){
  if (global.books != undefined) {
    console.log('saveBooksIndex...');
    var jsonData = JSON.stringify(global.books);
    if(jsonData.length != 0 && jsonData != '' && jsonData != ' ' && jsonData[0] == '[' && jsonData[jsonData.length-1] == ']'){
      fs.writeFile(CONFIG.books.index, jsonData, function(err) {
          if(err) {
              return console.log(err);
          } else {
            console.log("Books saved :)");
          }
      });
    }
  }

}


function saveBonusIndex(){
  if (global.bonus != undefined) {
    console.log('saveBooksIndex...');
    var jsonData = JSON.stringify(global.bonus);
    if(jsonData.length != 0 && jsonData != '' && jsonData != ' ' && jsonData[0] == '[' && jsonData[jsonData.length-1] == ']'){
      fs.writeFile(CONFIG.bonus.index, jsonData, function(err) {
          if(err) {
              return console.log(err);
          } else {
            console.log("Bonus saved :)");
          }
      });
    }
  }

}

function saveMontagesIndex(){
  if (global.montages != undefined) {
    console.log('saveMontagesIndex...');
    var jsonData = JSON.stringify(global.montages);
    if (jsonData.length != 0 && jsonData != '' && jsonData != ' ' && jsonData[0] == '[' && jsonData[jsonData.length-1] == ']') {
      fs.writeFile(CONFIG.montages.index, jsonData, function(err) {
          if(err) {
              return console.log(err);
          } else {
            console.log("Montages saved :)");
          }
      });
    }
  }
}


ipcMain.on('copyFileSync',(event,arg) => {

  //fs.copyFileSync(arg.path,arg.dest)
  fs.createReadStream(arg.path).pipe(fs.createWriteStream(arg.dest));
  return
})

//----------------------------------------------------------------------
// Bonus building
//----------------------------------------------------------------------

ipcMain.on('addBonus',(event,arg) => {

  original = arg.original.dzi
  if (fs.existsSync(arg.original.originalPath)) {
    original = arg.original.originalPath
  }
  image = {
    id : arg.name,
    original : arg.original,
    originalPath : global.bonus_path+'tiff/'+arg.name+'.tiff',
    thumbnail : global.bonus_path+'thumbnail/'+arg.name+'.png',
    dzi : global.bonus_path+'dzi/'+arg.name+'.dzi',
    description : arg.description
  }

  if (!fs.existsSync(bonus_path+'tiff/')){
    fs.mkdirSync(bonus_path+'tiff/');
  }

  if (!fs.existsSync(bonus_path+'dzi/')){
    fs.mkdirSync(bonus_path+'dzi/');
  }

  if (!fs.existsSync(bonus_path+'thumbnail/')){
    fs.mkdirSync(bonus_path+'thumbnail/');
  }

  console.log('test');
  console.log(arg);

  rect={
    left:Number.parseInt(arg.left,10),
    top:Number.parseInt(arg.top,10),
    width:Number.parseInt(arg.width,10),
    height:Number.parseInt(arg.height,10)
  }

  image.originalWidth = rect.width;
  image.originalHeight = rect.height;

  console.log(rect);

  sharp(original)
  .rotate(arg.angle)
  .extract(rect)
  .toFile(image.originalPath,function(err){
    if (err === undefined || err == null) {
      sharp(image.originalPath)
      .resize(560, 360, {
        kernel: sharp.kernel.lanczos3
      })
      .max()
      .toFile(image.thumbnail,function(err){
        if (err === undefined || err == null) {
          sharp(image.originalPath)
          .png()
         .tile()
          .toFile(image.dzi,function(err){
            if (err === undefined || err == null) {
              bonus.push(image)
              saveBonusIndex()
              event.sender.send('sync_bonus',null)
            } else {
              console.log(err)
            }
          })
        } else {
          console.log(err)
        }
      })
    } else {
      console.log(err)
    }


  })
})

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
      description:path.basename(item.path,path.extname(item.path)),//'page n°'+book.pages.length,
      id:book.name+'_'+path.basename(item.path,path.extname(item.path)),//book.name+'_'+//book.pages.length,
      thumbnail:book.path+'thumbnail/'+path.basename(item.path,path.extname(item.path))+'.png',//'page_'+book.pages.length+'.png',
      dzi:book.path+'dzi/'+path.basename(item.path,path.extname(item.path))+'.dzi'//'page_'+book.pages.length+'.dz'
    }

    console.log('adding page....');
    console.log(page);

    book.pages[page.id] = page

    var dimensions = sizeOf(item.path);
    page.originalWidth = dimensions.width;
    page.originalHeight = dimensions.height;

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

function sortBooks(){
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
}

ipcMain.on('sortBooks',(event,arg) => {
  sortBooks();
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
      global.books.push(book)
      sortBooks()
      saveBooksIndex()
      event.sender.send('sync_books',null)
    })

})

//----------------------------------------------------------------------
// Rerpertory walking
//----------------------------------------------------------------------

ipcMain.on('walkon',(event,arg) => {

  var dirs = []

  var items = [] // files, directories, symlinks, etc

  var onlyDir = through2.obj(function (item, enc, next) {
    if (item.stats.isDirectory()) {
      this.push(item)
      dirs.push({
        name:path.basename(item.path),
        path:item.path
      })
    }
    next()
  })

  klaw(arg.path,{depthLimit:0})
    .pipe(onlyDir)
    .on('data', item => items.push(item.path))
    .on('end', () => {
      event.sender.send(arg.callback,dirs)
    })

})

//----------------------------------------------------------------------
// SplashScreen
//----------------------------------------------------------------------

var transfer = false
var time = 0

function wait(){
  time+=1;
  if (time < 10) {
    setTimeout(wait,1000);
    win.webContents.send('splash_update', null)
  } else {
    transfer = true
    win.webContents.send('splash_hide', null)
    console.log(badEvent);
  }
}

if (global.enableTuio == true) {

  //----------------------------------------------------------------------
  // tuio - oracle
  //----------------------------------------------------------------------

  var badEvent = {}

  function isBadEvent(id,coordonates){
    return (!(badEvent[id] === undefined && badEvent[JSON.stringify({x:coordonates.x,y:coordonates.y})] === undefined))
  }

  function saveBadEvent(id,coordonates,evt){
    if (badEvent[id] === undefined) {
      badEvent[id] = []
    }
    badEvent[id].push(evt);
    badEvent[JSON.stringify({x:coordonates.x,y:coordonates.y})]=evt
  }

  //----------------------------------------------------------------------
  // tuio - Flash XML parser
  //----------------------------------------------------------------------

  var xmlParser = require('xml2js').parseString

  function parseTUIOFromXMLString(str,callback){
    objFromXML = xmlParser(str, function(err,result){
      if (err && err != null) {
        //console.log(err)
      } else {
        tuioBundle = {
          bundle:true,
          messages:[],
          duplicate:false
        }

        var type = ''

        for (var i = 0; i < result.OSCPACKET.MESSAGE.length; i++) {
          //tuioBundle.messages.push(result.OSCPACKET.MESSAGE[i].ARGUMENT)

          type = result.OSCPACKET.MESSAGE[i].$.NAME

          if (result.OSCPACKET.MESSAGE[i].ARGUMENT[0].$.VALUE === "fseq") {
            //console.log("fseq entry");

            tuioBundle.messages.push({ profile: type,
              type: 'fseq',
              frameID:  parseFloat(result.OSCPACKET.MESSAGE[i].ARGUMENT[1].$.VALUE)})
          } else if (result.OSCPACKET.MESSAGE[i].ARGUMENT[0].$.VALUE === "alive") {
            //console.log("alive entry");

            ids = []

            for (var j = 1; j < result.OSCPACKET.MESSAGE[i].ARGUMENT.length; j++) {
              ids.push(parseFloat(result.OSCPACKET.MESSAGE[i].ARGUMENT[j].$.VALUE))
            }

            tuioBundle.messages.push({ profile: type,
              type: 'alive',
              sessionIds:  ids})
          } else {
            //console.log("set entry");
            var set;
            try {
              set = {
                profile:type,
                type:'set',
                sessionId: parseFloat(result.OSCPACKET.MESSAGE[i].ARGUMENT[1].$.VALUE),
                xPosition: parseFloat(result.OSCPACKET.MESSAGE[i].ARGUMENT[2].$.VALUE),
                yPosition: parseFloat(result.OSCPACKET.MESSAGE[i].ARGUMENT[3].$.VALUE),
                xVelocity: parseFloat(result.OSCPACKET.MESSAGE[i].ARGUMENT[4].$.VALUE),
                yVelocity: parseFloat(result.OSCPACKET.MESSAGE[i].ARGUMENT[5].$.VALUE),
                motionAcceleration: parseFloat(result.OSCPACKET.MESSAGE[i].ARGUMENT[6].$.VALUE)
              }
            } catch (e) {
              //console.log(JSON.stringify(result.OSCPACKET.MESSAGE[i]));
            }

            tuioBundle.messages.push(set)

          }
        }
        //console.log(JSON.stringify(tuioBundle));

        var alive
        var messages=[]
        var fseq

        for (var i = 0; i < tuioBundle.messages.length; i++) {
          if (tuioBundle.messages[i].type == 'alive') {
            alive = tuioBundle.messages[i]
          } else if (tuioBundle.messages[i].type == 'fseq') {
            fseq = tuioBundle.messages[i]
          } else {
            messages.push(tuioBundle.messages[i])
          }
        }

        messages.unshift(alive)
        messages.push(fseq)

        tuioBundle.messages = messages


        callback(tuioBundle)
      }

    })
  }

  //----------------------------------------------------------------------
  // tuio - dgram UDP / Flash XML
  //----------------------------------------------------------------------

  var serverUDP = null;
  if (global.tuioData == 'xml') {

    var PORT = 3333;
    var HOST = '127.0.0.1';

    var dgram = require('dgram');
    serverUDP = dgram.createSocket('udp4');

    serverUDP.on('listening', function () {
        var address = serverUDP.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    serverUDP.bind(PORT, HOST);
  }


  //----------------------------------------------------------------------
  // tuio - CaressServer
  //----------------------------------------------------------------------

  var CaressServer = require('caress-server');
  var caressServer = null;
  if (global.tuioData == 'json') {
    caressServer = new CaressServer('0.0.0.0', 3333, {json: false});
  }

  //----------------------------------------------------------------------
  // tuio - SocketIO -> Caress Client (match with both data type)
  //----------------------------------------------------------------------

  var ioServer = require('http').createServer();
  var io = require('socket.io')(ioServer);

  io.sockets.on("connection", function(socket){
    console.log("Socket.io Client Connected");

    function oracle(msgObj){
      if (transfer) {
        var k = 0
        var removed = []
        while (k < msgObj.messages.length) {
          e= msgObj.messages[k]
          if (e.type != 'alive' && e.type != 'fseq') {
            if(isBadEvent(e.sessionId,{x:e.xPosition,y:e.yPosition}) ){
              msgObj.messages.splice(k,1);
              removed.push(e);
              k--
            }
          } else if (e.type == 'alive') {
            ids = []
            if (e.sessionIds != undefined) {
              for (var l = 0; l < e.sessionIds.length; l++) {
                if (!isBadEvent(e.sessionIds[l],{x:-1,y:-1})) {
                  ids.push(e.sessionIds[l])
                }
              }
              msgObj.messages[k].sessionIds = ids
            }

          }
          k++
        }
        if (msgObj.messages.length > 2) {
          if (global.debug) {
            console.log('time :'+new Date().getTime())
            if (global.eventToPrint == 'removed') {
              console.log(JSON.stringify(removed))
            } else if (global.eventToPrint == 'accepted') {
              console.log(JSON.stringify(msgObj))
            } else if (global.eventToPrint == 'both') {
              console.log('removed :: ')
              console.log(JSON.stringify(removed))
              console.log('accepted :: ')
              console.log(JSON.stringify(msgObj))
            }

          }
          socket.emit('tuio', msgObj)
        }
      } else {
        var k = 0
        while (k < msgObj.messages.length) {
          e= msgObj.messages[k]
          if (e.type != 'alive' && e.type != 'fseq') {
            saveBadEvent(e.sessionId,{x:e.xPosition,y:e.yPosition},e)
          }
          k++
        }
      }
    }

    if (global.tuioData == 'json') {
      caressServer.on('tuio', oracle);
    } else if (global.tuioData == 'xml') {
      messageXML = ''
      serverUDP.on('message', function (message, remote) {
        messageXML+=message
        if (message.includes('</OSCPACKET>')) {
          parseTUIOFromXMLString(messageXML.trim(),oracle)
        } else if (message.includes('<OSCPACKET')) {
          messageXML = message +''
        }

      });
    }

    socket.on("disconnect", function(){
      console.log("Socket.io Client Disconnected");
    });

    setTimeout(wait,1000)

  });


  ioServer.listen(5000);

} else {
  setTimeout(wait,1000)
}

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
  saveMontagesIndex()
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
    pathname: path.join(__dirname, 'front/index.html'),
    protocol: 'file:',
    slashes: true
  }))




  // Open the DevTools.
  if (CONFIG.debug) {
    win.webContents.openDevTools()
  }

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
