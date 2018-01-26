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

    }    ,
    onScroll:function(){
      console.log("scroll");
      //console.log(e.id);
      //var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      //document.getElementById('yourDiv').scrollLeft -= (delta*40); // Multiplied by 40
      e.preventDefault();
    }
  }
});
