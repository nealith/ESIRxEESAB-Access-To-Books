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
      this.currentZoomFactor += e.zoom;
      if (this.view != null) {
        this.view.viewport.zoomBy(this.currentZoomFactor);
      }
    },
    tap:function(e){

      this.currentZoomLevel+=this.incZoom;
      if (this.currentZoomLevel >= this.view.viewport.getMaxZoom()) {
        this.incZoom = -0.1;
      } else if(this.currentZoomLevel <= this.view.viewport.getMinZoom()) {
        this.incZoom = 0.1;
      }
      this.view.viewport.zoomTo(this.currentZoomLevel);
    },
    start:function(e){

      id = e.target.id || e.currentTarget.id;
      if (id != 'marker1' && id != 'marker2' ) {
        if (this.view != null) {
          this.center = this.view.viewport.getCenter();
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
          this.view.setMouseNavEnabled(false);
          this.currentZoomLevel = this.view.viewport.getMinZoom();
          this.imgInfos = data;

      }
    },
    longTap:function(e){

      if (this.view != null) {
        leftMarker1 = rect(byId('marker1')).left;

        topMarker1 = rect(byId('marker1')).top;

        rightMarker2 =  rect(byId('marker2')).right;

        bottomMarker2 = rect(byId('marker2')).bottom;

        rotation = this.view.viewport.getRotation()

        if (rotation == 0 && leftMarker1 == 0 && topMarker1 == 0 && rightMarker2 == frame.w && bottomMarker2 == frame.h) {
          discretAlert.alert({msg:'no modifications detected, bonus creation cancelled',warning:true});
          this.toggle(null);
          return;
        }

        if (leftMarker1 < rightMarker2 && topMarker1 < bottomMarker2) {

          topleft =  this.view.viewport.viewportToImageCoordinates(this.view.viewport.pointFromPixelNoRotate(new OpenSeadragon.Point(leftMarker1,topMarker1),true)) ;
          bottomright = this.view.viewport.viewportToImageCoordinates(this.view.viewport.pointFromPixelNoRotate(new OpenSeadragon.Point(rightMarker2,bottomMarker2),true)) ;



          if (topleft.x >= 0 &&
            topleft.y >= 0 &&
            bottomright.x < this.imgInfos.originalWidth &&
            bottomright.y < this.imgInfos.originalHeight
          ) {

            arg = {
              name:'bonus'+libraryShutter.bonus.length,
              left:topleft.x,
              top:topleft.y,
              width:bottomright.x - topleft.x,
              height:bottomright.y - topleft.y,
              original:this.imgInfos,
              angle:rotation
            }

            dialogue.toggle(
              [
                {
                  type:'text',
                  checkingFunction:libraryShutter.checkBonusExist,
                  id:'new-bonus-name',
                  placeholder:'Name (:',
                  tap:dialogue.focus
                },
                {
                  type:'textarea',
                  id:'new-bonus-description',
                  placeholder:'Description',
                  tap:dialogue.focus
                }
              ],
              function(data){
                arg.name = data['new-bonus-name'];
                arg.description = data['new-bonus-description']
                ipcRenderer.send('addBonus',arg);
                zoom.toggle(null);
              },
              function(){
                zoom.toggle(null);
              }
            );
          } else {
            discretAlert.alert({msg:'markers must be on the image ! ):',warning:true});
          }



        } else {
          discretAlert.alert({msg:'orange marker must be above and at left of the cyan marker ):',warning:true});
        }

      }

    }
  }
});