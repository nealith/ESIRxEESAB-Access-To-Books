libraryStrip = new Vue({
  el: '#libraryStrip',
  data:{
    offsetX:0,
    down:false,
    div:document.getElementById('libraryStrip'),
    style:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      left : (frame.w-sizePourcent*frame.w)+'px',
      width : (sizePourcent*frame.w)+'px'
    }

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
    },
    click:function(e){
      ///DEBUG
      //console.log('libraryStrip:click');
    },
    mouseDown:function(e){
      ///DEBUG
      //console.log('libraryStrip:mouseDown');
      this.offsetX = strToFloat(this.style.left) - e.clientX;
      ///DEBUG
      //console.log('libraryStrip:mouseMove:new offsetX:'+this.offsetX);
      this.down = true;
    },
    mouseUp:function(e){
      ///DEBUG
      //console.log('libraryStrip:mouseUp');
      this.down = false;
    },
    mouseMove:function(e){
      ///DEBUG
      //console.log('libraryStrip:mouseMove:'+e.clientX);
      if (this.down == true &&
        strToFloat(this.style.left) + strToFloat(this.style.width) + e.movementX <= frame.w &&
        strToFloat(this.style.left) + e.movementX >= strToFloat(montageStrip.style.left) + strToFloat(montageStrip.style.width)) {
        shutterController.onLibraryStripMove(e.movementX);
        this.style.left  = (strToFloat(this.style.left) + e.movementX) + 'px';
        ///DEBUG
        //console.log('libraryStrip:mouseMove:new position:'+this.style.left);

      }
    },
    touch:function(e){
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
            ///DEBUG
            //console.log('libraryStrip:touchmove:new position:'+this.style.left);

          }
          break;
        case "touchend":
          //DEBUG
          //console.log('libraryStrip:touchend');
          this.down = false;
          break;
      }
    }

  }
});
