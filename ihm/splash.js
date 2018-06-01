splash = new Vue({
  el: '#splash',
  data:{
    mapId:{},
    mapCoord:{},
    time:0,
    wait:'',
    active:true
  },
  methods:{
    resize:function(){
      this.style.height = frame.h+'px';
      this.style.width = frame.w+'px';
    }
  }
});

ipcRenderer.on('splash_update', (event, arg) => {
  splash.wait += '.';
});

ipcRenderer.on('splash_hide', (event, arg) => {
  console.log("lol");
  splash.active = false;
});
