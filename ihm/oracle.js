oracle = new Vue({
  el: '#oracle',
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
      height : frame.h+'px'
    }
  },
  methods:{
    resize:function(){
      this.style.height = frame.h+'px';
      this.style.width = frame.w+'px';
    },
    listen:function(e){
      if (this.time < 10) {
        coord = JSON.stringify({
          x:e.screenX,
          y:e.screenY
        });

        if (!this.mapCoord[coord]) {
          this.mapCoord[coord] = true;
        }
      }
    },
    pass:function(e){
      coord = JSON.stringify({
        x:e.screenX,
        y:e.screenY
      });

      if (this.mapCoord[coord]) {
        return false;
      }

      return true;
    }
  }
});


function wait(){
  oracle.time+=1;
  oracle.wait+='.';
  if (oracle.time < 10) {
    window.setTimeout(wait,1000);
  } else {
    oracle.style.display = 'none';
  }
}

oracle.style['z-index'] = 100;
window.setTimeout(wait,1000);
