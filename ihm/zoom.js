zoom = new Vue({
  el: '#zoom',
  data:{
    down:false,
    inTheForeground:false
    style:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      left : (sizePourcent*frame.w*2)+'px',
      width : (frame.w - sizePourcent*frame.w*3)+'px',
      display: 'none'
    },
    styleReduced:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      left : (sizePourcent*frame.w*2)+'px',
      width : (frame.w - sizePourcent*frame.w*3)+'px',
      display: 'none'
    },
    styleInTheForeground:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      left : '0px',
      width : frame.w+'px',
      display: 'none'
    },
    view:null,
    currentZoomFactor:1,
    center:null,

  },
  methods:{
    resize:function(){
      styleReduced.width = montageShutter.width;
      styleReduced.height = montageShutter.height;
      styleReduced.top = montageShutter.top;
      styleReduced.left = montageShutter.left;

      styleInTheForeground.width = frame.w+'px';
      styleInTheForeground.height = frame.h+'px';

      if (this.inTheForeground) {
        style = styleInTheForeground;
      } else {
        style = styleReduced;
      }
    },
    zoom:function(e){
      this.currentZoomFactor += e.deltaY || e.zoom;
      if (this.view != null) {
        view.zoomBy(this.currentZoomFactor);
      }
    },
    start:function(e){
      if (this.view != null) {
        this.center = view.getCenter();
      }
    },
    end:function(e){
      if (this.center != null) {
        this.center = null;
      }
    },
    move:function(e){
      if (this.center != null) {

        e.movementY = e.movementY || e.deltaY;
        e.movementX = e.movementX || e.deltaX;
        var newPoint = new Point(this.center.x + e.movementX,this.center.y + e.movementY);
        this.view.panTo(newPoint);
        this.center = newPoint;
      }
    },
    rotate:function(e){
      if (this.view != null) {
        this.view.setRotation(this.view.getRotation() + e.angle);
      }
    },
    toggle:function(data){
      if (data == null) {
        this.style.display = 'none';
        this.styleReduced.display = 'none';
        this.styleInTheForeground.display = 'none';
        this.view = null;
      } else {
        this.style.display = 'block';
        this.styleReduced.display = 'block';
        this.styleInTheForeground.display = 'block';
        this.view = OpenSeadragon({
          id:'zoom',
          prefixUrl: '',
          tileSource:data.dzi
        });
      }
    }
    toggleForeground:function(e){
      if (this.inTheForeground) {
        this.inTheForeground = false;
        this.style = this.styleReduced;
      } else {
        this.inTheForeground = true;
        this.style = this.styleInTheForeground;
      }
    }

  }
});

zoom.style['z-index'] = 10;
zoom.styleReduced['z-index'] = 10;
zoom.styleInTheForeground['z-index'] = 10;
