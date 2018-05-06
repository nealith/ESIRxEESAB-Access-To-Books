rotationButtons = new Vue({
  el: '#rotationButtons',
  data:{
    rotated:false,
    style:{
      width:frame.w+'px',
      height:frame.h+'px',
      position:'absolute',
      right:'0px',
      bottom:'0px',
    },
    buttonStyleTopLeft:{
      position:'absolute',
      left:frame.w*sizePourcent+'px',
      top:'0px'
    },
    buttonStyleTopRight:{
      position:'absolute',
      right:'0px',
      top:'0px'
    },
    buttonStyleBottomLeft:{
      position:'absolute',
      left:frame.w*sizePourcent+'px',
      bottom:'0px'
    },
    buttonStyleBottomRight:{
      position:'absolute',
      right:'0px',
      bottom:'0px'
    }
  },
  methods:{
    resize:function(){
      this.style.width = frame.w+'px',
      this.style.height = frame.h+'px';

      this.buttonStyleTopLeft.left = frame.w*sizePourcent+'px';
      this.buttonStyleBottomLeft.left = frame.w*sizePourcent+'px';

      this.buttonStyleTopLeft.width = frame.w*sizePourcent+'px';
      this.buttonStyleTopRight.width = frame.w*sizePourcent+'px';
      this.buttonStyleBottomLeft.width = frame.w*sizePourcent+'px';
      this.buttonStyleBottomRight.width = frame.w*sizePourcent+'px';

      this.buttonStyleTopLeft.height = frame.w*sizePourcent+'px';
      this.buttonStyleTopRight.height = frame.w*sizePourcent+'px';
      this.buttonStyleBottomLeft.height = frame.w*sizePourcent+'px';
      this.buttonStyleBottomRight.height = frame.w*sizePourcent+'px';
    },
    onRotatePressed:function(){
      if (!oracle.pass(e)) {
        return;
      }
      el = document.getElementById("rotationWrap");
      if (this.rotated) {
        el.className = "";
        this.rotated = false;
      } else {
        el.style.height = frame.h+'px';
        el.className = "rotated";
        this.rotated = true;
      }
    }
  }
});
