var montages = [
  {
    name:"montage1"
  },
  {
    name:"montage2"
  },
  {
    name:"montage3"
  },
  {
    name:"montage4"
  },
  {
    name:"montage5"
  }
]

var size = Math.min(frame.h*0.8,(strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left)))*0.8);

montageShutter = new Vue({
  el: '#montageShutter',
  data:{
    div:document.getElementById('montageShutter'),
    montages:montages,
    down:false,
    style:{
      height : frame.h+'px',
      background : 'orange',
      position : 'absolute',
      top : '0px',
      left : (sizePourcent*frame.w*2)+'px',
      width : (frame.w - sizePourcent*frame.w*3)+'px',
      overflow : 'hidden'
    },
    styleMontage:{
      height : size+'px',
      background : 'pink',
      width : size+'px',
      margin : size/8.0+'px auto '+size/8.0+'px auto'
    }
  },
  methods:{
    resize:function(){
      this.style.left = (strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))+'px';
      this.style.height = frame.h+'px';
      this.style.width = (strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))) +'px';

      size = Math.min(frame.h*0.8,(strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left)))*0.8);

      this.styleMontage.height = size+'px';
      this.styleMontage.width = size+'px';

      this.style['padding-left'] = 'auto';
      this.style['padding-right'] = 'auto';

      this.styleMontage.margin = size/8.0+'px auto '+size/8.0+'px auto';



    },
    onWheel:function(e){
      var delta = Math.max(-1, Math.min(1, e.deltaY));
      document.getElementById(e.currentTarget.id).scrollTop += (delta*40); // Multiplied by 40
      var t = document.getElementById(e.currentTarget.id);

      e.preventDefault();
    },
    mouseDown:function(e){
      //DEBUG
      //console.log('libraryStrip:mouseDown');
      this.down = true;
    },
    mouseUp:function(e){
      //DEBUG
      //console.log('libraryStrip:mouseUp');
      this.down = false;
    },
    mouseMove:function(e){
      //DEBUG
      //console.log('libraryStrip:mouseMove');
      if (this.down == true) {
        var delta = Math.max(-1, Math.min(1, e.movementY));
        console.log(e.movementY);
        document.getElementById(e.currentTarget.id).scrollTop -= (delta*40); // Multiplied by 40
        var t = document.getElementById(e.currentTarget.id);
        e.preventDefault();
        //DEBUG
        //console.log('libraryStrip:mouseMove:true');

      }
    }
  }
});

montageShutter.style['padding-left'] = 'auto';
montageShutter.style['padding-right'] = 'auto';
montageShutter.style['overflow-y'] = 'scroll';
montageShutter.style['overflow-x'] = 'hidden';
montageShutter.style['margin-right'] = '-14px';
montageShutter.style['white-space'] = 'nowrap';
