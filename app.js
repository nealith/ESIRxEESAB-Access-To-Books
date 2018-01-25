
///DEBUG
//console.log('app:launch');

var frame = {
  h:window.innerHeight,
  w:window.innerWidth
}

window.onresize = function(e){
    //DEBUG
    //console.log('screen:resize');
    frame.h = window.innerHeight;
    frame.w = window.innerWidth;
}

function strToInt(s){
  ss = s.substr(0,s.length-2);
  return parseFloat(ss);
}

var mainStrip;
var montageStrip;
var libraryStrip;
var montageShutter;
var libraryShutter;

shutterController = {
  onLibraryStripMove:function(x){
    //DEBUG
    console.log('shutterController:onLibraryStripMove:'+x);
    libraryShutter.style.width  = (strToInt(libraryShutter.style.width) - x ) + 'px';
    montageShutter.style.width  = (strToInt(montageShutter.style.width) + x ) + 'px';
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
      width : '50px'
    }
  },
  methods:{
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
      left : '50px',
      width : '50px'
    }
  },
  methods:{
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
      left : '1550px',
      width : '50px'
    }

  },
  methods:{
    click:function(e){
      ///DEBUG
      //console.log('libraryStrip:click');
    },
    mouseDown:function(e){
      ///DEBUG
      //console.log('libraryStrip:mouseDown');
      this.offsetX = strToInt(this.style.left) - e.clientX;
      ///DEBUG
      //console.log('libraryStrip:mouseMove:new offsetX:'+this.offsetX);
      this.down = true;
    },
    mouseUp:function(e){
      ///DEBUG
      console.log('libraryStrip:mouseUp');
      this.down = false;
    },
    mouseMove:function(e){
      ///DEBUG
      //console.log('libraryStrip:mouseMove:'+e.clientX);
      if (this.down == true) {
        shutterController.onLibraryStripMove(e.movementX);
        this.style.left  = (strToInt(this.style.left) + e.movementX) + 'px';
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
      left : '100px',
      width : '1450px'
    }
  },
  methods:{
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
  }
});


///DEBUG
//console.log('app:init');
