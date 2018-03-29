montageDialogue = new Vue({
  el: '#montageDialogue',
  data:{
    down:false,
    name:"",
    style:{
      width:(1/8)*frame.w+'px',
      height:(1/6)*frame.h+'px',
      display:'none',
      position:'absolute',
      right:'0px',
      bottom:'0px',
    }
  },
  methods:{
    resize:function(){
      this.style.width = 1/8*frame.w+'px';
      this.style.height = 1/6*frame.h+'px';
    },
    ontoggle:function(){
      if (this.style.display == 'none') {
        this.style.display = 'block';
        keyboard.addListener('montageName');
        keyboard.ontoggle();
      } else {
        this.style.display = 'none';
        keyboard.removeListener('montageName');
        keyboard.ontoggle();
        this.name = "";
      }
    },
    ok:function(){
      alreadyexist = false;
      for (var i = 0; i < this.montages.length; i++) {
        if (this.montages[i].name == this.name) {
          alreadyexist = true;
          break;
        }
      }
      if (!alreadyexist) {
        var name = this.name;
        this.ontoggle();
        montageShutter.newMontage(name);
      }
    },
    cancel:function(){
      this.ontoggle();
    },
    mouseDown:function(e){
      //DEBUG
      //console.log('montageDialogue:mouseDown');
      this.down = true;
    },
    mouseUp:function(e){
      //DEBUG
      //console.log('montageDialogue:mouseUp');
      this.down = false;
    },
    mouseMove:function(e){
      //DEBUG
      //console.log('montageDialogue:mouseMove');
      if (this.down == true) {

        var right  = (strToFloat(this.style.right) - e.movementX);
        var bottom  = (strToFloat(this.style.bottom) - e.movementY);
        if (right >= 0 && right+strToFloat(this.style.width) < frame.w && bottom >= 0 && bottom + strToFloat(this.style.height) < frame.h ) {
          this.style.right = right + 'px';
          this.style.bottom = bottom + 'px';
        }

      }
    },
    touch:function(e){
      switch (e.type) {
        case "touchstart":
          //DEBUG
          //console.log('montageDialogue:touchstart');
          this.down = true;
          break;
        case "touchmove":
          //DEBUG
          //console.log('montageDialogue:touchmove');
          if (this.down == true) {
            var right  = (strToFloat(this.style.right) - e.movementX);
            var bottom  = (strToFloat(this.style.bottom) - e.movementY);

            if (right >= 0 && right+strToFloat(this.style.width) < frame.w && bottom >= 0 && bottom + strToFloat(this.style.height) < frame.h ) {
              this.style.right = right + 'px';
              this.style.bottom = bottom + 'px';
            }
            //DEBUG
            //console.log('montageDialogue:touchmove:true');

          }
          break;
        case "touchend":
          //DEBUG
          //console.log('montageDialogue:touchend');
          this.down = false;
          break;
      }
    }

  }
});

document.getElementById('montageName').addEventListener('keypress', (e) => {
  e.target.value += String.fromCharCode(e.key);
});


montageDialogue.style['z-index'] = 10;

//// Test

//window.addEventListener('keypress',function(e){
//  console.log(String.fromCharCode(e.key));
//});
