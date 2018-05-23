splash = new Vue({
  el: '#splash',
  data:{
    mapId:{},
    mapCoord:{},
    time:0,
    wait:'',
    style:{
      position : 'absolute',
      top : '0px',
      left : '0px',
      width : frame.w+'px',
      height : frame.h+'px',
      display : 'block'
    }
  },
  methods:{
    resize:function(){
      this.style.height = frame.h+'px';
      this.style.width = frame.w+'px';
    }
  }
});

splash.style['z-index'] = 100;

ipcRenderer.on('splash_update', (event, arg) => {
  splash.wait += '.';
});

ipcRenderer.on('splash_hide', (event, arg) => {
  console.log("lol");
  splash.style.display='none';
});
