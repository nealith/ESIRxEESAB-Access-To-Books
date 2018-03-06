var montages = remote.getGlobal('montages');

var size = Math.min(frame.h*0.8,(strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left)))*0.8);
var montage_data;

//-
// Raphael
//

start = function () {
        // storing original coordinates
        this.ox = this.attr("x");
        this.oy = this.attr("y");
},
move = function (dx, dy) {

    this.attr({x: this.ox + dx, y: this.oy + dy});

}
up = function () {

};

//
// MontageShutter
//

for (var i = 0; i < montages.length; i++) {
  montages[i].raphael = {};
}

montageShutter = new Vue({
  el: '#montageShutter',
  data:{
    div:document.getElementById('montageShutter'),
    montages:montages,
    down:false,
    style:{
      height : frame.h+'px',
      background : 'orange',
      position : 'absolute',
      top : '0px',
      left : (sizePourcent*frame.w*2)+'px',
      width : (frame.w - sizePourcent*frame.w*3)+'px',
      overflow : 'hidden'
    },
    styleMontage:{
      height : size+'px',
      background : 'pink',
      width : size+'px',
      margin : size/8.0+'px auto '+size/8.0+'px auto'
    }
  },
  methods:{
    resize:function(){
      this.style.left = (strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))+'px';
      this.style.height = frame.h+'px';
      this.style.width = (strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))) +'px';

      size = Math.min(frame.h*0.8,(strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left)))*0.8);

      this.styleMontage.height = size+'px';
      this.styleMontage.width = size+'px';

      this.style['padding-left'] = 'auto';
      this.style['padding-right'] = 'auto';

      this.styleMontage.margin = size/8.0+'px auto '+size/8.0+'px auto';

      for (var i = 0; i < montages.length; i++) {
        montages[i].raphael.setSize(size,size);
      }

    },
    onWheel:function(e){
      var delta = Math.max(-1, Math.min(1, e.deltaY));
      document.getElementById(e.currentTarget.id).scrollTop += (delta*40); // Multiplied by 40
      var t = document.getElementById(e.currentTarget.id);

      e.preventDefault();
    },
    mouseDown:function(e){
      //DEBUG
      //console.log('montageShutter:mouseDown');
      this.down = true;
    },
    mouseUp:function(e){
      //DEBUG
      //console.log('montageShutter:mouseUp');
      this.down = false;
    },
    mouseMove:function(e){
      //DEBUG
      //console.log('montageShutter:mouseMove');
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
      if (this.down == true) {
        var delta = Math.max(-1, Math.min(1, e.movementY));
        document.getElementById(e.currentTarget.id).scrollTop -= (delta*40); // Multiplied by 40
        var t = document.getElementById(e.currentTarget.id);
        e.preventDefault();
        //DEBUG
        //console.log('montageShutter:mouseMove:true');

      }
    },
    touch:function(e){
      switch (e.type) {
        case "touchstart":
          //DEBUG
          //console.log('montageShutter:touchstart');
          this.down = true;
          break;
        case "touchmove":
          //DEBUG
          //console.log('montageShutter:touchmove');
          if (pressTimer) {
            clearTimeout(pressTimer);
          }
          if (this.down == true) {
            var delta = Math.max(-1, Math.min(1, e.movementY));
            console.log(e.movementY);
            document.getElementById(e.currentTarget.id).scrollTop -= (delta*40); // Multiplied by 40
            var t = document.getElementById(e.currentTarget.id);
            e.preventDefault();
            //DEBUG
            //console.log('montageShutter:touchmove:true');

          }
          break;
        case "touchend":
          //DEBUG
          //console.log('montageShutter:touchend');
          this.down = false;
          break;
      }
    },
    mouseDownPage:function(e){
      this.down = true;
      pressTimer = window.setTimeout(function() { montageShutter.down = false;},200);
    },
    touchPage:function(e){
      if (e.type = 'touchstart') {

        pressTimer = window.setTimeout(function() { montageShutter.down = false;},200);
      }
    },
    dragOverMontage:function(e){
      e.preventDefault();
    },
    dropMontage:function(e){
      var k = -1;
      for (var i = 0; i < montages.length; i++) {
        montages[i].name
        if (e.currentTarget.id == montages[i].name) {
          k=i;
          break;
        }
      }

      if (k >= 0) {
        var rect = e.currentTarget.getBoundingClientRect();

        var data;

        try {
          data = JSON.parse(e.dataTransfer.getData('text'));
        } catch (e) {
          data = montage_data;
        } finally {

        }
        var a = data.height;
        var b = data.width;
        var x = (e.clientX - rect.left) - data.offsetx;
        var y = (e.clientY - rect.top) - data.offsety;
        var img = montages[k].raphael.image(data.src,x,y,b,a);
        img.drag(move,start,up);
        img.mousedown(montageShutter.mouseDownPage);
        img.touchstart(montageShutter.touchPage);
        //img.show();
        console.log("pass in a canvas, src:"+e.dataTransfer.getData('text'));
      }

      console.log("pass in dropImg");
      console.log("target element : "+e.currentTarget.id);

    }
  }
});

for (var i = 0; i < montages.length; i++) {
  montages[i].raphael = Raphael(montages[i].name,size,size);
}

montageShutter.style['padding-left'] = 'auto';
montageShutter.style['padding-right'] = 'auto';
montageShutter.style['white-space'] = 'nowrap';
