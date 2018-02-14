// ---------------------------------
// LibraryShutter
// ---------------------------------

let books;

let pressTimer;

const pagePadding = 0.05;
var booksLength = 0;

function renderLibrary(library){

  books = library.books;
  booksLength = books.length;

  libraryShutter = new Vue({
    el: '#libraryShutter',
    data:{
      div:document.getElementById('libraryShutter'),
      books:books,
      style:{
        height : frame.h+'px',
        background : 'purple',
        position : 'absolute',
        top : '0px',
        right : '0px',
        width : '0px',
        overflow: 'hidden'
      },
      styleBook:{
        height:(frame.h/booksLength)+14+'px',
        width:'auto',
        background:'black',
        overflow:'hidden'
      },
      stylePage:{
        display:'inline-block',
        height:(frame.h/booksLength)+'px',
        width:(frame.h/booksLength)/Math.sqrt(2)+'px',
        padding: pagePadding*(frame.h/booksLength)+'px '+pagePadding*(frame.h/booksLength)+'px '+pagePadding*(frame.h/booksLength)+'px '+pagePadding*(frame.h/booksLength)+'px'
      },
      styleImage:{
        background:'pink',
        display:'block',
        height:(frame.h/booksLength - 2*pagePadding*(frame.h/booksLength))+'px',
        width:(frame.h/booksLength - 2*pagePadding*(frame.h/booksLength))/Math.sqrt(2)+'px',
        overflow:'hidden'
      }
    },
    methods:{
      resize:function(){
        this.style.height = frame.h+'px';
        this.style.width = frame.w - (strToFloat(libraryStrip.style.left)+strToFloat(libraryStrip.style.width))+'px';

        this.styleBook.height = (frame.h/booksLength)+14+'px';
        //this.styleBook.width = this.style.width;

        var pageHeight = frame.h/booksLength;
        this.stylePage.height = pageHeight+'px';
        this.stylePage.width = pageHeight/Math.sqrt(2);
        this.stylePage.padding = pagePadding*pageHeight+'px '+pagePadding*pageHeight+'px '+pagePadding*pageHeight+'px '+pagePadding*pageHeight+'px';

        this.styleImage.height = (pageHeight - 2*pagePadding*(pageHeight))+'px';
        this.styleImage.width = (pageHeight - 2*pagePadding*(pageHeight))/Math.sqrt(2)+'px';

      },
      onWheel:function(e){
        var delta = Math.max(-1, Math.min(1, e.deltaY));
        document.getElementById(e.currentTarget.id).scrollLeft += (delta*40); // Multiplied by 40
        e.preventDefault();
      },
      mouseDown:function(e){
        //DEBUG
        //console.log('libraryShutter:mouseDown');
        this.down = true;
      },
      mouseDownPage:function(e){
        this.down = true;
        pressTimer = window.setTimeout(function() { libraryShutter.down = false;},1000);
      },
      mouseUp:function(e){
        //DEBUG
        //console.log('libraryShutter:mouseUp');
        this.down = false;
      },
      mouseMove:function(e){
        //DEBUG
        //console.log('libraryShutter:mouseMove');
        if (pressTimer) {
          clearTimeout(pressTimer);
        }
        if (this.down == true) {
          var delta = Math.max(-1, Math.min(1, e.movementX));
          console.log(e.movementY);
          document.getElementById(e.currentTarget.id).scrollLeft -= (delta*10); // Multiplied by 40
          var t = document.getElementById(e.currentTarget.id);
          e.preventDefault();
          //DEBUG
          //console.log('libraryShutter:mouseMove:true');

        }
      },
      touch:function(e){
        switch (e.type) {
          case "touchstart":
            //DEBUG
            //console.log('libraryShutter:touchstart');
            this.down = true;
            break;
          case "touchmove":
            //DEBUG
            //console.log('libraryShutter:touchmove');
            if (pressTimer) {
              clearTimeout(pressTimer);
            }
            if (this.down == true) {
              var delta = Math.max(-1, Math.min(1, e.movementX));
              console.log(e.movementY);
              document.getElementById(e.currentTarget.id).scrollLeft -= (delta*10); // Multiplied by 40
              var t = document.getElementById(e.currentTarget.id);
              e.preventDefault();
              //DEBUG
              //console.log('libraryShutter:touchmove:true');

            }
            break;
          case "touchend":
            //DEBUG
            //console.log('libraryShutter:touchend');
            this.down = false;
            break;
        }
      },
      touchPage:function(e){
        if (e.type = 'touchstart') {

          pressTimer = window.setTimeout(function() { libraryShutter.down = false;},1000);
        }
      }
    }
  });

  libraryShutter.styleBook['white-space'] = 'nowrap';
}

// ---------------------------------
// IPC
// ---------------------------------

ipcRenderer.on('receiveLibrary', (event, arg) => {
  console.log(arg)
  renderLibrary(arg);
})

/*

var books = []

function createFakeBook(){
  book = {};
  book.name = books.length+'n';
  book.pages = [];
  var n = Math.random()*30;
  for (var i = 0; i < n; i++) {
    book.pages.push({
      description:'description'+i+', page n°'+i,
      src:null
    });
  }
  books.push(book);
}

function randomColor(){

  var r = Math.random()*255;
  var g = Math.random()*255;
  var b = Math.random()*255;
  return 'rgb('+r+','+g+','+b+')';
}

createFakeBook();
createFakeBook();
createFakeBook();

*/


ipcRenderer.send('getLibrary',null);
