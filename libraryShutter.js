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

const padding = 0.05;
var booksLength = books.length;

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
      background:'black'
    },
    stylePage:{
      display:'inline-block',
      height:(frame.h/booksLength)+'px',
      width:(frame.h/booksLength)/Math.sqrt(2)+'px',
      padding: padding*(frame.h/booksLength)+'px '+padding*(frame.h/booksLength)+'px '+padding*(frame.h/booksLength)+'px '+padding*(frame.h/booksLength)+'px'
    },
    styleImage:{
      background:'pink',
      display:'block',
      height:(frame.h/booksLength - 2*padding*(frame.h/booksLength))+'px',
      width:(frame.h/booksLength - 2*padding*(frame.h/booksLength))/Math.sqrt(2)+'px',
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
      this.stylePage.padding = padding*pageHeight+'px '+padding*pageHeight+'px '+padding*pageHeight+'px '+padding*pageHeight+'px';

      this.styleImage.height = (pageHeight - 2*padding*(pageHeight))+'px';
      this.styleImage.width = (pageHeight - 2*padding*(pageHeight))/Math.sqrt(2)+'px';

    },
    onWheel:function(e){
      var delta = Math.max(-1, Math.min(1, e.deltaY));
      document.getElementById(e.currentTarget.id).scrollLeft += (delta*40); // Multiplied by 40
      e.preventDefault();
    }
  }
});

libraryShutter.styleBook['overflow-x'] = 'scroll';
libraryShutter.styleBook['overflow-y'] = 'hidden';
libraryShutter.styleBook['margin-bottom'] = '-14px';
//libraryShutter.styleBook['overflow-y'] = 'hidden';
libraryShutter.styleBook['white-space'] = 'nowrap';

//window.addEventListener('scroll',libraryShutter.onScroll);