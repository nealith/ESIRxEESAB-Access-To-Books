const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const {ipcMain} = require('electron')


const fs = require('fs')
const klaw = require('klaw')
const through2 = require('through2')

const CONFIG = require('./config.json')
var BOOKS_INDEX = require(CONFIG.books.index)
var MONTAGES_INDEX = require(CONFIG.montages.index)
const BOOKS_PATH = CONFIG.books.path
const MONTAGES_PATH = CONFIG.montages.path

function saveLibrairy(){
  var jsonData = JSON.stringify(BOOKS_INDEX);
  fs.writeFile("BOOKS_INDEX.json", jsonData, function(err) {
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

    sharp(item.path)
    .resize(560, 360, {
      kernel: sharp.kernel.lanczos3
    })
    .max()
    .toFile(book.path+"page_"+book.page.length+".png",function(err){
      if (err === undefined) {
        book.pages.push({
          originalPath:item.path,
          description:"page "+book.page.length,
          src:book.path+"page_"+book.page.length+".png",
          id:book.name+'_'+book.page.length
        })
        next()
      } else {
        console.log(err)
      }
    })
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
      BOOKS_INDEX.books.push(book)
      saveLibrairy()
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

ipcMain.on('getLibrary',(event,arg) => {

  console.log('ask for Librairy');
  event.sender.send('receiveLibrary',BOOKS_INDEX)

})


//----------------------------------------------------------------------
// window
//----------------------------------------------------------------------

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

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
  // win.webContents.openDevTools()

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
