
///DEBUG
//console.log('app:launch');

var frame = {
  h:window.innerHeight,
  w:window.innerWidth,
  oldH:0,
  oldW:0

}

const sizePourcent = 0.03125;



function strToFloat(s){
  //DEBUG
  //console.log('strToFloat:'+s);
  ss = s.substr(0,s.length-2);
  return parseFloat(ss);
}

var mainStrip;
var montageStrip;
var libraryStrip;
var montageShutter;
var libraryShutter;

window.onresize = function(e){
    //DEBUG
    //console.log('screen:resize');
    frame.oldH = frame.h;
    frame.oldW = frame.w;
    frame.h = window.innerHeight;
    frame.w = window.innerWidth;
    mainStrip.resize();
    montageStrip.resize();
    libraryStrip.resize();
    montageShutter.resize();
    libraryShutter.resize();
}

shutterController = {
  onLibraryStripMove:function(x){
    //DEBUG
    //console.log('shutterController:onLibraryStripMove:'+x);
    libraryShutter.style.width  = (strToFloat(libraryShutter.style.width) - x ) + 'px';
    montageShutter.style.width  = (strToFloat(montageShutter.style.width) + x ) + 'px';
  }
}

mainStrip = new Vue({
  el: '#mainStrip',
  data:{
    div:document.getElementById('mainStrip'),
    style:{
      height : frame.h+'px',
      background : 'green',
      position : 'absolute',
      top : '0px',
      left : '0px',
      width : (sizePourcent*frame.w)+'px'
    }
  },
  methods:{
    resize:function(){
      this.style.height = frame.h+'px';
      this.style.width = frame.w * sizePourcent+'px';
      this.style.left = '0px';
    }
  }
})

montageStrip = new Vue({
  el: '#montageStrip',
  data:{
    div:document.getElementById('montageStrip'),
    style:{
      height : frame.h+'px',
      background : 'red',
      position : 'absolute',
      top : '0px',
      left : (sizePourcent*frame.w)+'px',
      width : (sizePourcent*frame.w)+'px'
    }
  },
  methods:{
    resize:function(){
      var oldLeft = strToFloat(this.style.left);
      var oldWidth = frame.oldW*sizePourcent;
      var newWidth = frame.w*sizePourcent;
      var realOldFrameWidth = frame.oldW - 3*oldWidth;
      var realNewFrameWidth = frame.w - 3*newWidth;
      var realOldLeft = oldLeft-oldWidth;
      var realNewLeft = realNewFrameWidth * realOldLeft / realOldFrameWidth;
      var newLeft = realNewLeft + newWidth;


      this.style.left =   newLeft+'px';
      this.style.height = frame.h+'px';
      this.style.width = newWidth+'px';
    }
  }
})

libraryStrip = new Vue({
  el: '#libraryStrip',
  data:{
    offsetX:0,
    down:false,
    div:document.getElementById('libraryStrip'),
    style:{
      height : frame.h+'px',
      background : 'blue',
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
    }
  }
})

montageShutter = new Vue({
  el: '#montageShutter',
  data:{
    div:document.getElementById('montageShutter'),
    style:{
      height : frame.h+'px',
      background : 'orange',
      position : 'absolute',
      top : '0px',
      left : (sizePourcent*frame.w*2)+'px',
      width : (frame.w - sizePourcent*frame.w*3)+'px'
    }
  },
  methods:{
    resize:function(){
      this.style.left = (strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))+'px';
      this.style.height = frame.h+'px';
      this.style.width = (strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))) +'px';

    }
  }
});

libraryShutter = new Vue({
  el: '#libraryShutter',
  data:{
    div:document.getElementById('libraryShutter'),
    style:{
      height : frame.h+'px',
      background : 'purple',
      position : 'absolute',
      top : '0px',
      right : '0px',
      width : '0px'
    }
  },
  methods:{
    resize:function(){
      this.style.height = frame.h+'px';
      this.style.width = frame.w - (strToFloat(libraryStrip.style.left)+strToFloat(libraryStrip.style.width))+'px';
    }
  }
});


//DEBUG
//console.log('app:init');
