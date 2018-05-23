var books = remote.getGlobal('books');
var bonus = remote.getGlobal('bonus');
const pagePadding = 0.05;


const numberOfBooksVisible = 3;

libraryStrip = new Vue({
  el: '#libraryStrip',
  data:{
    moveX:0,
    offsetX:0,
    down:false,
    div:document.getElementById('libraryStrip'),
    style:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      left : (frame.w-sizePourcent*frame.w)+'px',
      width : (sizePourcent*frame.w)+'px',
      overflow : 'hidden'
    },
    bookNameStyle:{
      height : frame.h/numberOfBooksVisible+'px',
      color: "white",
      padding: '0px 0px 0px 0px',
      margin: '0px 0px',
      position: 'relative',
      left: '0%'
    },
    books:books

  },
  methods:{
    resize:function(){
      var oldLeft = strToFloat(this.style.left);
      var oldWidth = frame.oldW*sizePourcent;
      var newWidth = frame.w*sizePourcent;
      var realOldFrameWidth = frame.oldW - 2*oldWidth;
      var realNewFrameWidth = frame.w - 2*newWidth;
      var realOldLeft = oldLeft-oldWidth;
      var realNewLeft = realNewFrameWidth * realOldLeft / realOldFrameWidth;
      var newLeft = realNewLeft + newWidth;

      this.style.left =   newLeft+'px';
      this.style.height = frame.h+'px';
      this.style.width = newWidth+'px';

      this.bookNameStyle.height = frame.h/numberOfBooksVisible+'px';
    },
    start:function(e){
      //DEBUG
      //console.log('libraryStrip:start');
      this.down = true;
    },
    end:function(e){
      //DEBUG
      //console.log('libraryStrip:end');
      this.down = false;
      shutterController.onLibraryStripMove(this.moveX);
      this.moveX = 0;
    },
    move:function(e){
      //DEBUG
      //console.log('libraryStrip:move');

      e.movementX = e.movementX || e.deltaX;
      if (this.down == true &&
        strToFloat(this.style.left) + strToFloat(this.style.width) + e.movementX <= frame.w &&
        strToFloat(this.style.left) + e.movementX >= strToFloat(montageStrip.style.left) + strToFloat(montageStrip.style.width)) {

        this.style.left  = (strToFloat(this.style.left) + e.movementX) + 'px';
        this.moveX += e.movementX;

        //DEBUG
        //console.log('libraryStrip:move:new position:'+this.style.left);
      }
    }
  }
});
libraryStrip.style['z-index'] = 50;
libraryStrip.style['line-height'] = 1;
libraryStrip.bookNameStyle['line-height'] = 1;
