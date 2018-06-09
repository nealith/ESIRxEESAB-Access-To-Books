zoom = new Vue({
  el: '#zoom',
  data:{
    active:false,
    down:false,
    downMarker1:false,
    downMarker2:false,
    longClick:false,
    view:null,
    currentZoomFactor:1,
    center:null,
    doubleTap:false,
    currentZoomLevel:0,
    incZoom:0.1,
    imgInfos:null

  },
  methods:{
    zoom:function(e){
      this.currentZoomFactor += e.deltaY || e.zoom;
      if (this.view != null) {
        this.view.viewport.zoomBy(this.currentZoomFactor);
      }
    },
    tap:function(e){

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

      id = e.target.id || e.currentTarget.id;
      if (id != 'marker1' && id != 'marker2' ) {
        if (this.doubleTap) { // double-tap event with alloy_finger is not handle...
          this.doubleTap = false;
          this.toggleForeground();
        } else if (this.view != null) {
          this.center = this.view.viewport.getCenter();
          this.doubleTap = true;
          window.setTimeout(function() { zoom.doubleTap = false;},150);

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
        zoom.longClick = false;
        e.movementY = e.movementY || e.deltaY;
        e.movementX = e.movementX || e.deltaX;
        var newPoint = new OpenSeadragon.Point(this.center.x - e.movementX/1000,this.center.y - e.movementY/1000);
        this.view.viewport.panTo(newPoint);
        this.center = newPoint;
      }
    },
    rotate:function(e){ // rotate by 90deg (or -90deg) !!!

      zoom.longClick = false;
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
        this.view.destroy();
        this.view = null;
        this.imgInfos = null;
        this.active = false;
        byId('marker1').removeAttribute("style");
        byId('marker2').removeAttribute("style");

      } else {
        this.active = true;
        //if (fs.existsSync(data.dzi)) {
          this.view = OpenSeadragon({
            id:'zoom-container',
            prefixUrl: './libs/openseadragon/images/',
            tileSources:data.dzi+'.dzi',
            showNavigationControl:false
          });
          this.currentZoomLevel = this.view.viewport.getMinZoom();
          this.imgInfos = data;

          this.view.addHandler('canvas-press',function(e){
            zoom.longClick = true;
            window.setTimeout(function() {
              console.log('test');
              if (zoom.longClick) {
                zoom.longTap(null);
              }
              zoom.longClick = false;
            },200);
          })

          this.view.addHandler('canvas-release',function(e){
            zoom.longClick = false;
          })

          this.view.addHandler('canvs-drag',function(e){
            zoom.longClick = false;
          })

      }
    },
    longTap:function(e){
      leftMarker1 = rect(byId('marker1')).left;

      topMarker1 = rect(byId('marker1')).top;

      rightMarker2 =  rect(byId('marker2')).right;

      bottomMarker2 = rect(byId('marker2')).bottom;

      rotation = this.view.viewport.getRotation()

      console.log(leftMarker1,topMarker1,rightMarker2,bottomMarker2,rotation);
      if (rotation == 0 && leftMarker1 == 0 && topMarker1 == 0 && rightMarker2 == frame.w && bottomMarker2 == frame.h) {
        this.toggle(null);
        return;
      }

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
          angle:rotation
        }
        ipcRenderer.send('addBonus',arg);
      } else {
        console.error("orange marker must be above and at left of the cyan marker");
      }
      this.toggle(null);
    }

  }
});

/*
$(document.getElementById('marker1')).draggable({
  containment: "parent",
  snap: "#zoom",
  snapTolerance: 20,
  start: function(){},
  drag: function(){},
  stop: function(){}
});

$(document.getElementById('marker2')).draggable({
  containment: "parent",
  snap: "#zoom",
  snapTolerance: 20,
  start: function(){},
  drag: function(){},
  stop: function(){}
});*/
