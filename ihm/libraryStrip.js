var books = remote.getGlobal('books');
var booksLength = books.length;
const pagePadding = 0.05;

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
      width : (sizePourcent*frame.w)+'px'
    },
    bookNameStyle:{
      height : frame.h/booksLength+'px',
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

      this.bookNameStyle.height = frame.h/booksLength+'px';
    },
    click:function(e){
      //DEBUG
      //console.log('libraryStrip:click');
    },
    mouseDown:function(e){
      //DEBUG
      //console.log('libraryStrip:mouseDown');
      this.offsetX = strToFloat(this.style.left) - e.clientX;
      //DEBUG
      //console.log('libraryStrip:mouseMove:new offsetX:'+this.offsetX);
      this.down = true;
      //montageShutter.style.display='none';
      //libraryShutter.style.display='none';
    },
    mouseUp:function(e){
      //DEBUG
      //console.log('libraryStrip:mouseUp');
      this.down = false;
      shutterController.onLibraryStripMove(this.moveX);
      this.moveX = 0;
      //montageShutter.style.display='block';
      //libraryShutter.style.display='block';
    },
    mouseMove:function(e){
      //DEBUG
      //console.log('libraryStrip:mouseMove:'+e.clientX);
      if (this.down == true &&
        strToFloat(this.style.left) + strToFloat(this.style.width) + e.movementX <= frame.w &&
        strToFloat(this.style.left) + e.movementX >= strToFloat(montageStrip.style.left) + strToFloat(montageStrip.style.width)) {

        this.style.left  = (strToFloat(this.style.left) + e.movementX) + 'px';
        this.moveX += e.movementX;

        //DEBUG
        //console.log('libraryStrip:mouseMove:new position:'+this.style.left);

      }
    },
    tap:function(e){
      console.log("tesstttteeee1");
    },
    tap2:function(e){
      console.log("tesstttteeee2");
    },
    swipe:function(e){
      console.log('swipe');
      console.log(e);
    },
    touchStart:function(e){
      this.down = true;
    },
    pressMove:function(e){
      console.log('pressMove');
      //console.log(e);

      if (this.down == true && strToFloat(this.style.left) + strToFloat(this.style.width) + e.deltaX <= frame.w &&
        strToFloat(this.style.left) + e.deltaX >= strToFloat(montageStrip.style.left) + strToFloat(montageStrip.style.width)) {
        //shutterController.onLibraryStripMove(e.deltaX);
        this.style.left  = (strToFloat(this.style.left) + e.deltaX) + 'px';
        //DEBUG
        //console.log('libraryStrip:touchmove:new position:'+this.style.left);
        this.moveX += e.deltaX;
      }
    },
    touch:function(e){
      /*console.log("teeeeeeee");
      switch (e.type) {
        case "touchstart":
          //DEBUG
          //console.log('libraryStrip:touchstart');
          this.offsetX = strToFloat(this.style.left) - e.clientX;
          //DEBUG
          //console.log('libraryStrip:touchstart:new offsetX:'+this.offsetX);
          this.down = true;
          break;
        case "touchmove":
          //DEBUG
          //console.log('libraryStrip:touchmove:'+e.clientX);
          if (this.down == true &&
            strToFloat(this.style.left) + strToFloat(this.style.width) + e.movementX <= frame.w &&
            strToFloat(this.style.left) + e.movementX >= strToFloat(montageStrip.style.left) + strToFloat(montageStrip.style.width)) {
            shutterController.onLibraryStripMove(e.movementX);
            this.style.left  = (strToFloat(this.style.left) + e.movementX) + 'px';
            //DEBUG
            //console.log('libraryStrip:touchmove:new position:'+this.style.left);

          }
          break;
        case "touchend":
          //DEBUG
          //console.log('libraryStrip:touchend');
          this.down = false;
          break;
      }*/
    }

  }
});
libraryStrip.style['z-index'] = 2;
libraryStrip.style['line-height'] = 1;
libraryStrip.bookNameStyle['line-height'] = 1;
