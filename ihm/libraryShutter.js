// ---------------------------------
// LibraryShutter
// ---------------------------------

// Init active

function jq( myid ) {

    return "#" + myid.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );

}

var active = {};

for (var i = 0; i < books.length; i++) {
  active[books[i].name] = 0;
}

active.bonus = 0;

libraryShutter = new Vue({
  el: '#libraryShutter',
  data:{
    books:books,
    bonus:bonus,
    active:active,
    doubleTap:false,
    longClick:false,
    dragBook:false
  },
  methods:{
    scrollBook:function(e){

      if(library_scroll_active){

        idElem = e.currentTarget.id;
        var nextActive = this.active[idElem];
        if(e.deltaY>0){
          nextActive++;
          if (nextActive >= e.currentTarget.numberPages) {
            nextActive = e.currentTarget.numberPages-1;
          }
        }else {
          nextActive--;
          if (nextActive < 0) {
            nextActive = 0;
          }
        }

        var from;
        var to;


        if (idElem == 'bonus') {
          from = $('#'+this.bonus[this.active.bonus].id);
          to = $('#'+this.bonus[nextActive].id);
        } else {
          for (var i = 0; i < books.length; i++) {
            if(this.books[i].name == idElem) {
              console.log(this.books[i].pages[this.active[idElem]].id);
              console.log(this.books[i].pages[nextActive].id);
              from = $(document.getElementById(this.books[i].pages[this.active[idElem]].id));
              to = $(document.getElementById(this.books[i].pages[nextActive].id));
              break;
            }
          }
        }

        from.removeAttr("active");
        to.attr("active", "");

        this.active[idElem] = nextActive;


        var $activePage = $(document.getElementById(idElem)).children(".library_page[active]");
        var widthActivePage = $activePage.width();
        var widthLibrary = $(document.getElementById(idElem)).parent().width();

        library_scroll_active = false; // Prevent separator moving from triggering scroll event on libraries

        $(document.getElementById(idElem)).scrollTo($activePage, 300, {
          offset: -(widthLibrary/2)+(widthActivePage/2),
          onAfter: function() {
            setTimeout(function() {
              library_scroll_active = true;
            }, 350); // Wait until animation ends to activate scroll detection
          }
        });
      }
    },
    wheelOnBook:function(e){
      this.scrollBook(e);
    },
    swipeOnBook:function(e){
      //console.log("swipe" + e.direction);
      var fe = {
        currentTarget:e.target,
        deltaY:10
      }
      if (e.direction=="swipeLeft") {
        fe.deltaY=-10;
      }

      if (e.target.tagName == "IMG") {
        fe.currentTarget = e.target.parentElement;
      }
      console.log(fe);
      this.scrollBook(fe);
    },
    startOnBook:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseDownBooks');
      this.dragBook = true;
    },
    endOnBook:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseUpBooks');
      this.dragBook = false;
    },
    moveOnBook:function(e){
      //DEBUG
      //console.log('libraryShutter:mouseMoveBooks');
      e.deltaY = e.movementX || e.deltaX;
      if (this.dragBook == true) {
        this.scrollBook(e);
      }
    },
    startOnPage:function(e){
      pressTimer = window.setTimeout(function() {
        if (libraryShutter.longClick) {
          longTap(e);
        }
      },200);
    },
    endOnPage:function(e){
      libraryShutter.longClick = false
    },
    moveOnPage:function(e){
      libraryShutter.longClick = false
    },
    longTap:function(e){
      montageShutter.pushImage(e.target);
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

for (var i = 0; i < books.length; i++) {
  $('#'+libraryShutter.books[i].pages[libraryShutter.active[books[i].name]].id).attr("active", "");
}

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
  active[books[books.length-1].name] = 0;

  $('#'+libraryShutter.books[books.length-1].pages[libraryShutter.active[books[books.length-1].name]].id).attr("active", "");
});

ipcRenderer.on('sync_bonus', (event, arg) => {
  bonus = remote.getGlobal('bonus');
  libraryShutter.bonus = bonus;
  libraryStrip.bonus = bonus;
});
