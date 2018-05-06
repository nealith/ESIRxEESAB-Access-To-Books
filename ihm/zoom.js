zoom = new Vue({
  el: '#zoom',
  data:{
    down:false,
    downMarker1:false,
    downMarker2:false,
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
    styleMarker1:{
      position:'absolute',
      top:'0px',
      left:'0px',
      width: sizePourcent*frame.w+'px',
      height : sizePourcent*frame.w+'px'
    },
    styleMarker2:{
      position:'absolute',
      bottom:'0px',
      right:'0px',
      width: sizePourcent*frame.w+'px',
      height : sizePourcent*frame.w+'px'
    },
    view:null,
    currentZoomFactor:1,
    center:null,
    doubleTap:false,
    currentZoomLevel:0,
    incZoom:0.1,
    imgInfos:null

  },
  methods:{
    resize:function(){
      this.styleReduced.width = (frame.w - sizePourcent*frame.w*3)+'px';
      this.styleReduced.height = frame.h+'px';
      this.styleReduced.left = (sizePourcent*frame.w*2)+'px';

      this.styleInTheForeground.width = frame.w+'px';
      this.styleInTheForeground.height = frame.h+'px';

      this.styleMarker1.width = sizePourcent*frame.w+'px';
      this.styleMarker1.height = sizePourcent*frame.w+'px';
      this.styleMarker2.width = sizePourcent*frame.w+'px';
      this.styleMarker2.height = sizePourcent*frame.w+'px';

      this.styleMarker1.top = '0px';
      this.styleMarker1.left = '0px';
      this.styleMarker2.bottom = '0px';
      this.styleMarker2.right = '0px';

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
      if (!oracle.pass(e)) {
        return;
      }
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
      if (!oracle.pass(e)) {
        return;
      }
      id = e.target.id || e.currentTarget.id;
      if (id != 'marker1' && id != 'marker2' ) {
        if (this.doubleTap) { // double-tap event with alloy_finger is not handle...
          this.doubleTap = false;
          this.toggleForeground();
        } else if (this.view != null) {
          this.center = this.view.viewport.getCenter();
          this.doubleTap = true;
          window.setTimeout(function() { this.doubleTap = false;},150);
        }
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
    rotate:function(e){ // rotate by 90deg (or -90deg) !!!
      if (!oracle.pass(e)) {
        return;
      }
      if (this.view != null) {
        r = 1;
        if (e.angle < 0) {
          r = -1;
        }
        this.view.viewport.setRotation(this.view.viewport.getRotation() + r*90);
      }
    },
    toggle:function(data){
      if (data == null) {
        this.style.display = 'none';
        this.styleReduced.display = 'none';
        this.styleInTheForeground.display = 'none';
        this.view.destroy();
        this.view = null;
        this.imgInfos = null;
      } else {
        this.style.display = 'block';
        this.styleReduced.display = 'block';
        this.styleInTheForeground.display = 'block';
        //if (fs.existsSync(data.dzi)) {
          this.view = OpenSeadragon({
            id:'zoom',
            prefixUrl: './libs/openseadragon/images/',
            tileSources:data.dzi+'.dzi',
            showNavigationControl:false
          });
          this.currentZoomLevel = this.view.viewport.getMinZoom();
          this.imgInfos = data;
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
      this.styleMarker1.top = '0px';
      this.styleMarker1.left = '0px';
      this.styleMarker2.bottom = '0px';
      this.styleMarker2.right = '0px';
    },
    startOnMarker1:function(e){
      if (!oracle.pass(e)) {
        return;
      }
      this.downMarker1 = true;
    },
    endOnMarker1:function(e){
      this.downMarker1 = false;
    },
    moveOnMarker1:function(e){
      e.movementY = e.movementY || e.deltaY;
      e.movementX = e.movementX || e.deltaX;
      if (this.downMarker1 &&
          strToFloat(this.styleMarker1.top) + e.movementY >= 0 &&
          strToFloat(this.styleMarker1.top) + e.movementY + strToFloat(this.styleMarker1.height) < strToFloat(this.style.height)  &&
          strToFloat(this.styleMarker1.left) + e.movementX >= 0 &&
          strToFloat(this.styleMarker1.left) + e.movementX + strToFloat(this.styleMarker1.width) < strToFloat(this.style.width)) {

        this.styleMarker1.top = strToFloat(this.styleMarker1.top) + e.movementY +'px';
        this.styleMarker1.left = strToFloat(this.styleMarker1.left) + e.movementX +'px';
      }
    },
    startOnMarker2:function(e){
      if (!oracle.pass(e)) {
        return;
      }
      this.downMarker2 = true;
    },
    endOnMarker2:function(e){
      this.downMarker2 = false;
    },
    moveOnMarker2:function(e){
      e.movementY = e.movementY || e.deltaY;
      e.movementX = e.movementX || e.deltaX;
      if (this.downMarker2 &&
        strToFloat(this.styleMarker2.bottom) - e.movementY >= 0 &&
        strToFloat(this.styleMarker2.bottom) - e.movementY + strToFloat(this.styleMarker2.height) < strToFloat(this.style.height)  &&
        strToFloat(this.styleMarker2.right) - e.movementX >= 0 &&
        strToFloat(this.styleMarker2.right) - e.movementX + strToFloat(this.styleMarker2.width) < strToFloat(this.style.width)) {

        this.styleMarker2.bottom = strToFloat(this.styleMarker2.bottom) - e.movementY +'px';
        this.styleMarker2.right = strToFloat(this.styleMarker2.right) - e.movementX +'px';
      }
    },
    longTap:function(e){
      if (!oracle.pass(e)) {
        return;
      }
      leftMarker1 = strToFloat(this.styleMarker1.left);

      topMarker1 = strToFloat(this.styleMarker1.top);

      rightMarker2 = strToFloat(this.style.width) - strToFloat(this.styleMarker2.right);

      bottomMarker2 = strToFloat(this.style.height) - strToFloat(this.styleMarker2.bottom);


      if (leftMarker1 < rightMarker2 && topMarker1 < bottomMarker2) {

        topleft =  this.view.viewport.viewportToImageCoordinates(this.view.viewport.pointFromPixelNoRotate(new OpenSeadragon.Point(leftMarker1,topMarker1),true)) ;
        bottomright = this.view.viewport.viewportToImageCoordinates(this.view.viewport.pointFromPixelNoRotate(new OpenSeadragon.Point(rightMarker2,bottomMarker2),true)) ;

        arg = {
          name:'bonus'+libraryShutter.bonus.length,
          left:topleft.x,
          top:topleft.y,
          width:bottomright.x - topleft.x,
          height:bottomright.y - topleft.y,
          original:this.imgInfos,
          angle:this.view.viewport.getRotation()
        }
        console.log(arg);
        ipcRenderer.send('addBonus',arg);
      }
      this.toggle(null);
    }

  }
});

zoom.style['z-index'] = 10;
zoom.styleReduced['z-index'] = 10;
zoom.styleInTheForeground['z-index'] = 90;

zoom.styleMarker1['z-index'] = 30;
zoom.styleMarker2['z-index'] = 30;
