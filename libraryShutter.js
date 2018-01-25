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
