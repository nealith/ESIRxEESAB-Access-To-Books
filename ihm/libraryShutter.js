// ---------------------------------
// LibraryShutter
// ---------------------------------


libraryShutter = new Vue({
  el: '#libraryShutter',
  data:{
    books:books,
    bonus:bonus,
  },
  methods:{
    updateDescription:function(e){
      if (e.id == 'bonus') {
        this.bonus.selected = e.selected
      } else {
        for (var i = 0; i < this.books.length; i++) {
          if(this.books[i].name == e.id){
            this.books[i].selected == e.selected;
            break;
          }
        }
      }
    },
    selectedBookChanged:function(e){
      libraryStrip.$refs.libraryStripSlides.updateSelected(e.selected)
    },
    toMontage:function(e){
      montageShutter.pushImage(e.target);
    },
    zoom:function(e){
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
