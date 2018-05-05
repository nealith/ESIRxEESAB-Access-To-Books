// ---------------------------------
// LibraryShutter
// ---------------------------------

let pressTimer;


libraryShutter = new Vue({
  el: '#libraryShutter',
  data:{
    div:document.getElementById('libraryShutter'),
    books:books,
    bonus:bonus,
    doubleTap:false,
    style:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      right : '0px',
      width : '0px',
      overflow: 'hidden',
      display:'block'
    },
    styleBook:{
      height:(frame.h/numberOfBooksVisible)+'px',
      width:'auto',
      overflow:'hidden'
    },
    stylePage:{
      display:'inline-block',
      height:(frame.h/numberOfBooksVisible)+'px',
      width:(frame.h/numberOfBooksVisible)/Math.sqrt(2)+'px',
      padding: pagePadding*(frame.h/numberOfBooksVisible)+'px '+pagePadding*(frame.h/numberOfBooksVisible)+'px '+pagePadding*(frame.h/numberOfBooksVisible)+'px '+pagePadding*(frame.h/numberOfBooksVisible)+'px'
    },
    styleImage:{
      display:'block',
      height:(frame.h/numberOfBooksVisible - 2*pagePadding*(frame.h/numberOfBooksVisible))+'px',
      //width:(frame.h/numberOfBooksVisible - 2*pagePadding*(frame.h/numberOfBooksVisible))/Math.sqrt(2)+'px',
      overflow:'hidden'
    }
  },
  methods:{
    resize:function(){
      this.style.height = frame.h+'px';
      this.style.width = frame.w - (strToFloat(libraryStrip.style.left)+strToFloat(libraryStrip.style.width))+'px';

      this.styleBook.height = (frame.h/numberOfBooksVisible)+'px';
      //this.styleBook.width = this.style.width;

      var pageHeight = frame.h/numberOfBooksVisible;
      this.stylePage.height = pageHeight+'px';
      this.stylePage.width = pageHeight/Math.sqrt(2)+'px';
      this.stylePage.padding = pagePadding*pageHeight+'px '+pagePadding*pageHeight+'px '+pagePadding*pageHeight+'px '+pagePadding*pageHeight+'px';

      this.styleImage.height = (pageHeight - 2*pagePadding*(pageHeight))+'px';
      //this.styleImage.width = (pageHeight - 2*pagePadding*(pageHeight))/Math.sqrt(2)+'px';

    },
    wheelOnBooks:function(e){
      if ( Math.abs(e.deltaY) > Math.abs(e.deltaX) ) {
        var delta = Math.max(-1, Math.min(1, e.deltaY));
        document.getElementById("libraryShutter").scrollTop += (delta*40); // Multiplied by 40
        document.getElementById("libraryStrip").scrollTop += (delta*40); // Multiplied by 40
        e.preventDefault();
      }
    },
    startOnBooks:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseDownBooks');
      this.down = true;
    },
    endOnBooks:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseUpBooks');
      this.down = false;
    },
    moveOnBooks:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseMoveBooks');
      e.movementY = e.movementY || e.deltaY;
      if (this.down == true) {
        var delta = Math.max(-1, Math.min(1, e.movementY));
        document.getElementById("libraryShutter").scrollTop -= (delta*10); // Multiplied by 40
        document.getElementById("libraryStrip").scrollTop -= (delta*10); // Multiplied by 40
        e.preventDefault();
        //DEBUG
        //console.log('libraryShutter:mouseMove:true');

      }
    },
    wheelOnBook:function(e){
      if ( Math.abs(e.deltaY) < Math.abs(e.deltaX) ) {
        var delta = Math.max(-1, Math.min(1, e.deltaY));
        document.getElementById(e.currentTarget.id).scrollLeft += (delta*40); // Multiplied by 40
        e.preventDefault();
      }
    },
    startOnBook:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseDownBooks');
      this.down = true;
    },
    endOnBook:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseUpBooks');
      this.down = false;
    },
    moveOnBook:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseMoveBooks');
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
      e.movementX = e.movementX || e.deltaX;
      if (this.down == true) {
        var delta = Math.max(-1, Math.min(1, e.movementX));
        document.getElementById(e.currentTarget.id).scrollLeft -= (delta*10); // Multiplied by 40
        e.preventDefault();
        //DEBUG
        //console.log('libraryShutter:mouseMove:true');

      }
    },
    mouseDownPage:function(e){
      this.down = true;
      pressTimer = window.setTimeout(function() { libraryShutter.down = false;},200);
    },
    touchPage:function(e){
      if (e.type = 'touchstart') {

        pressTimer = window.setTimeout(function() { libraryShutter.down = false;},200);
      }
    },
    longTap:function(e){

      var rect = e.target.getBoundingClientRect();
      dataTransfer.data = {
        offsetx: e.clientX - rect.left,
        offsety: e.clientY - rect.top,
        width: e.target.width,
        height: e.target.height,
        src: e.srcElement.currentSrc
      }
      dataTransfer.ready = true;


    },
    zoom:function(e){
      //var dziSrc = e.target.src.replace("thumbnail","dzi");
      //dziSrc = dziSrc.replace("png","dzi.dzi");
      for (var i = 0; i < this.books.length; i++) {
        bookName = this.books[i].name;
        if (e.target.id.includes(bookName)) {
          for (var j = 0; j < this.books[i].pages.length; j++) {
            var page = this.books[i].pages[j]
            if (e.target.id == page.id) {
              zoom.toggle(page);
              return;
            }
          }
        }

      }


      //zoom.toggle({dzi:dziSrc});
    },
    dragPage:function(e){
      // DEBUG:
      console.log("start drag on page");
      var src = '';
      for (var i = 0; i < books.length; i++) {
        for (var j = 0; j < books[i].pages.length; j++) {
          if (books[i].pages[j].id == e.currentTarget.id) {
            src = books[i].pages[j].src;
            break;
          }
        }
      }
      var rect = e.currentTarget.getBoundingClientRect();
      var data = {
        offsetx: e.clientX - rect.left,
        offsety: e.clientY - rect.top,
        width: e.currentTarget.width,
        height: e.currentTarget.height,
        src: src
      }

      //e.dataTransfer.setData('text',src);
      e.dataTransfer.setData('text',JSON.stringify(data));
      e.dataTransfer.setDragImage(e.currentTarget, data.offsetx, data.offsety);
      console.log(data);
      //e.dataTransfer.setData('text',JSON.stringify(data));
    },
    tap:function(e){
      if (this.doubleTap) { // double-tap event with alloy_finger is not handle...
        this.doubleTap = false;
        this.zoom(e);
      } else {
        this.doubleTap = true;
        window.setTimeout(function() { libraryShutter.doubleTap = false;},150);
      }
    }
  }
});

function sortBooks(){
  ipcRenderer.send('sortBooks',null);
}

function saveBooks(){
  ipcRenderer.send('saveBooks',null);
}

ipcRenderer.on('sync_books', (event, arg) => {
  books = remote.getGlobal('books');
  libraryShutter.books = books;
  libraryStrip.books = books;
});

ipcRenderer.on('sync_bonus', (event, arg) => {
  bonus = remote.getGlobal('bonus');
  libraryShutter.bonus = bonus;
  libraryStrip.bonus = bonus;
});




libraryShutter.styleBook['white-space'] = 'nowrap';
