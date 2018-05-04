zoom = new Vue({
  el: '#zoom',
  data:{
    down:false,
    inTheForeground:false,
    style:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      left : (sizePourcent*frame.w*2)+'px',
      width : (frame.w - sizePourcent*frame.w*3)+'px',
      display:'none'
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
    doubleTap:false,
    currentZoomLevel:0,
    incZoom:0.1

  },
  methods:{
    resize:function(){
      this.styleReduced.width = (frame.w - sizePourcent*frame.w*3)+'px';
      this.styleReduced.height = frame.h+'px';
      this.styleReduced.left = (sizePourcent*frame.w*2)+'px';

      this.styleInTheForeground.width = frame.w+'px';
      this.styleInTheForeground.height = frame.h+'px';

      if (this.inTheForeground) {
        this.style = this.styleInTheForeground;
      } else {
        this.style = this.styleReduced;
      }
    },
    zoom:function(e){
      this.currentZoomFactor += e.deltaY || e.zoom;
      if (this.view != null) {
        this.view.viewport.zoomBy(this.currentZoomFactor);
      }
    },
    tap:function(e){
      console.log("loll");
      this.currentZoomLevel+=this.incZoom;
      console.log(this.currentZoomLevel);
      if (this.currentZoomLevel >= this.view.viewport.getMaxZoom()) {
        this.incZoom = -0.1;
      } else if(this.currentZoomLevel <= this.view.viewport.getMinZoom()) {
        this.incZoom = 0.1;
      }
      console.log(this.view.viewport.getMaxZoom());
      console.log(this.view.viewport.getMinZoom());
      this.view.viewport.zoomTo(this.currentZoomLevel);
      console.log(this.view.viewport.getZoom());
    },
    start:function(e){
      if (this.doubleTap) { // double-tap event with alloy_finger is not handle...
        this.doubleTap = false;
        this.toggleForeground();
      } else if (this.view != null) {
        this.center = this.view.viewport.getCenter();
        zoom.doubleTap = true;
        window.setTimeout(function() { zoom.doubleTap = false;},150);
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
        var newPoint = new OpenSeadragon.Point(this.center.x - e.movementX/1000,this.center.y - e.movementY/1000);
        this.view.viewport.panTo(newPoint);
        this.center = newPoint;
      }
    },
    rotate:function(e){
      if (this.view != null) {
        this.view.viewport.setRotation(this.view.viewport.getRotation() + e.angle);
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
        //if (fs.existsSync(data.dzi)) {
          this.view = OpenSeadragon({
            id:'zoom',
            prefixUrl: './libs/openseadragon/images/',
            tileSources:data.dzi,
            showNavigationControl:false
          });
          this.currentZoomLevel = this.view.viewport.getMinZoom();
        //} else {
        //  console.log("c'est la merdeeeeeee");
        //  console.log(data.dzi);
        //}
      }
    },
    toggleForeground:function(e){
      console.log(e);
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
