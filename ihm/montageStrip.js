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
});
