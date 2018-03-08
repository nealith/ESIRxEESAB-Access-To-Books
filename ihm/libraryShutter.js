// ---------------------------------
// LibraryShutter
// ---------------------------------

let pressTimer;

const pagePadding = 0.05;

var books = remote.getGlobal('books');
var booksLength = books.length;

libraryShutter = new Vue({
  el: '#libraryShutter',
  data:{
    div:document.getElementById('libraryShutter'),
    books:books,
    style:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      right : '0px',
      width : '0px',
      overflow: 'hidden'
    },
    styleBook:{
      height:(frame.h/booksLength)+14+'px',
      width:'auto',
      overflow:'hidden'
    },
    stylePage:{
      display:'inline-block',
      height:(frame.h/booksLength)+'px',
      width:(frame.h/booksLength)/Math.sqrt(2)+'px',
      padding: pagePadding*(frame.h/booksLength)+'px '+pagePadding*(frame.h/booksLength)+'px '+pagePadding*(frame.h/booksLength)+'px '+pagePadding*(frame.h/booksLength)+'px'
    },
    styleImage:{
      display:'block',
      height:(frame.h/booksLength - 2*pagePadding*(frame.h/booksLength))+'px',
      //width:(frame.h/booksLength - 2*pagePadding*(frame.h/booksLength))/Math.sqrt(2)+'px',
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
      //this.styleImage.width = (pageHeight - 2*pagePadding*(pageHeight))/Math.sqrt(2)+'px';

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
      pressTimer = window.setTimeout(function() { libraryShutter.down = false;},200);
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

        pressTimer = window.setTimeout(function() { libraryShutter.down = false;},200);
      }
    },
    dragPage:function(e){
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
    }
  }
});

libraryShutter.styleBook['white-space'] = 'nowrap';
