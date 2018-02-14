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
});
