// ---------------------------------
// LibraryShutter
// ---------------------------------


libraryShutter = new Vue({
  el: '#libraryShutter',
  data:{
    books:books,
    bonus:bonus,
    selectedIndex:{}
  },
  created:function(){
    for (var i = 0; i < this.books.length; i++) {
      this.selectedIndex[books[i].name] = 0;
    }
    this.selectedIndex['bonus'] = 0;
  },
  methods:{
    updateDescription:function(e){
      this.selectedIndex[e.id] = e.selected;
    },
    selectedBookChanged:function(e){
      libraryStrip.$refs.libraryStripSlides.updateSelected(e.selected)
    },
    toMontage:function(e){
      montageShutter.pushImage(e.data);
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

  for (var i = 0; i < this.books.length; i++) {
    if (libraryShutter.selectedIndex[books[i].name] === undefined) {
      libraryShutter.selectedIndex[books[i].name] = 0;
    }
  }

  libraryShutter.books = books;
  libraryStrip.books = books;
});

ipcRenderer.on('sync_bonus', (event, arg) => {
  bonus = remote.getGlobal('bonus');
  libraryShutter.bonus = bonus;
  libraryStrip.bonus = bonus;
});
