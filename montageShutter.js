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
    style:{
      height : frame.h+'px',
      background : 'orange',
      position : 'absolute',
      top : '0px',
      left : (sizePourcent*frame.w*2)+'px',
      width : (frame.w - sizePourcent*frame.w*3)+'px',
      overflow : 'hidden'
    },
    styleMontages:{
      width : (frame.w - sizePourcent*frame.w*3)+'px'
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

      this.styleMontages = (strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))) + 'px';

      size = Math.min(frame.h*0.8,(strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left)))*0.8);

      this.styleMontage.height = size+'px';
      this.styleMontage.width = size+'px';

      this.styleMontages['padding-left'] = 'auto';
      this.styleMontages['padding-right'] = 'auto';

      this.styleMontage.margin = size/8.0+'px auto '+size/8.0+'px auto';



    },
    onWheel:function(e){
      var delta = Math.max(-1, Math.min(1, e.deltaY));
      document.getElementById(e.currentTarget.id).scrollTop += (delta*40); // Multiplied by 40
      e.preventDefault();
    }
  }
});

montageShutter.styleMontages['padding-left'] = 'auto';
montageShutter.styleMontages['padding-right'] = 'auto';
montageShutter.styleMontages['overflow-y'] = 'scroll';
montageShutter.styleMontages['overflow-x'] = 'hidden';
montageShutter.styleMontages['margin-right'] = '-14px';
montageShutter.styleMontages['white-space'] = 'nowrap';
