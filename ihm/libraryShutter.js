// ---------------------------------
// LibraryShutter
// ---------------------------------


libraryShutter = new Vue({
  el: '#libraryShutter',
  data:{
    books:books,
    bonus:bonus,
    selectedBonusId:'',
    selectedBonusDescription:'',
    selectedIndex:{},
  },
  created:function(){
    for (var i = 0; i < this.books.length; i++) {
      this.selectedIndex[this.books[i].name] = 0;
      this.books[i].selectedDescription = this.books[i].pages[0].description;
      //byId(this.books[i].name+'_page_description').innerHTML = this.books[i].selectedDescription;
    }
    this.selectedIndex['bonus'] = 0;

    if (this.bonus.length > 0) {
      this.selectedBonusId = this.bonus[0].id;
      this.selectedBonusDescription = this.bonus[0].description;
    }

  },
  methods:{
    checkBonusExist:function(value){
      for (var i = 0; i < this.bonus.length; i++) {
        if(this.bonus[i].id == value){
          return true;
        }
      }
      return false;
    },
    updateDescription:function(e){
      this.selectedIndex[e.id] = e.selected;

      if (e.id == 'bonus') {
        this.selectedBonusId = this.bonus[e.selected].id;
        this.selectedBonusDescription = this.bonus[e.selected].description;
      } else {
        for (var i = 0; i < this.books.length; i++) {
          if(this.books[i].name == e.id){
            this.books[i].selectedDescription = this.books[i].pages[e.selected].description;
            byId(this.books[i].name+'_page_description').innerHTML = this.books[i].selectedDescription;
            break;
          }
        }
      }

    },
    selectedBookChanged:function(e){
      libraryStrip.$refs.libraryStripSlides.updateSelected(e.selected)
    },
    toMontage:function(e){
      montageShutter.pushImage(e.data);
    },
    zoom:function(e){
      console.log(e);
      for (var i = 0; i < this.books.length; i++) {
        bookName = this.books[i].name;
        if (e.data.id.includes(bookName)) {
          for (var j = 0; j < this.books[i].pages.length; j++) {
            var page = this.books[i].pages[j]
            if (e.data.id == page.id) {
              zoom.toggle(page);
              return;
            }
          }
        }
      }
      for (var j = 0; j < this.bonus.length; j++) {
        var page = this.bonus[j];
        if (e.data.id == page.id) {
          zoom.toggle(page);
          return;
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
  let succes = (bonus.length != libraryShutter.bonus.length);
  libraryShutter.bonus = bonus;
  libraryStrip.bonus = bonus;

  if (succes) {
    discretAlert.alert({msg:'bonus '+libraryShutter.bonus[libraryShutter.bonus.length-1].id+' created (:',succes:true});
  }
});
