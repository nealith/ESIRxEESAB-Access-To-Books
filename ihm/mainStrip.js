mainStrip = new Vue({
  el: '#mainStrip',
  data:{
    div:document.getElementById('mainStrip'),
    style:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      left : '0px',
      width : (sizePourcent*frame.w)+'px'
    },
    buttonStyle:{
      width : (sizePourcent*frame.w)+'px',
      height : (sizePourcent*frame.w)+'px'
    },
    whiteSpace:{
      height : frame.h-3*((sizePourcent*frame.w))+'px'
    }
  },
  methods:{
    resize:function(){
      this.style.height = frame.h+'px';
      this.style.width = frame.w * sizePourcent+'px';
      this.style.left = '0px';

      this.buttonStyle.width = frame.w * sizePourcent+'px';
      this.buttonStyle.height = frame.w * sizePourcent+'px';

      this.whiteSpace.height = frame.h-3*((sizePourcent*frame.w))+'px'
    },
    onmontage:function(e){
      console.log('onmontage');
    },
    onnotes:function(e){
      console.log('onnotes');
    },
    onvocal:function(e){
      console.log('onvocal');
    }
  }
});
