// ---------------------------------
// LibraryShutter
// ---------------------------------

let pressTimer;

var numberOfBooksVisible = 3;

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
      this.stylePage.width = pageHeight/Math.sqrt(2);
      this.stylePage.padding = pagePadding*pageHeight+'px '+pagePadding*pageHeight+'px '+pagePadding*pageHeight+'px '+pagePadding*pageHeight+'px';

      this.styleImage.height = (pageHeight - 2*pagePadding*(pageHeight))+'px';
      //this.styleImage.width = (pageHeight - 2*pagePadding*(pageHeight))/Math.sqrt(2)+'px';

    },
    onWheelBooks:function(e){
      var delta = Math.max(-1, Math.min(1, e.deltaY));
      document.getElementById(e.currentTarget.id).scrollTop += (delta*40); // Multiplied by 40
      e.preventDefault();
    },
    mouseDownBooks:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseDownBooks');
      this.down = true;
    },
    mouseUpBooks:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseUpBooks');
      this.down = false;
    },
    mouseMoveBooks:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseMoveBooks');
      if (this.down == true) {
        var delta = Math.max(-1, Math.min(1, e.movementY));
        document.getElementById(e.currentTarget.id).scrollTop -= (delta*10); // Multiplied by 40
        e.preventDefault();
        //DEBUG
        //console.log('libraryShutter:mouseMove:true');

      }
    },
    onWheelBook:function(e){
      var delta = Math.max(-1, Math.min(1, e.deltaY));
      document.getElementById(e.currentTarget.id).scrollLeft += (delta*40); // Multiplied by 40
      e.preventDefault();
    },
    mouseDownBook:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseDownBooks');
      this.down = true;
    },
    mouseDownPage:function(e){
      this.down = true;
      pressTimer = window.setTimeout(function() { libraryShutter.down = false;},200);
    },
    mouseUpBook:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseUpBooks');
      this.down = false;
    },
    mouseMoveBook:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseMoveBooks');
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
      if (this.down == true) {
        var delta = Math.max(-1, Math.min(1, e.movementX));
        document.getElementById(e.currentTarget.id).scrollLeft -= (delta*10); // Multiplied by 40
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
    }
  }
});

libraryShutter.styleBook['white-space'] = 'nowrap';
