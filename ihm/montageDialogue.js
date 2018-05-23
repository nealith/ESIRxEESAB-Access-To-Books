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
    toggle:function(){
      if (this.style.display == 'none') {
        this.style.display = 'block';
        keyboard.addListener('montageName');
        keyboard.toggle();
      } else {
        this.style.display = 'none';
        keyboard.removeListener('montageName');
        keyboard.toggle();
        this.name = "";
      }
    },
    onOkPressed:function(){
      alreadyexist = false;
      console.log(this.name);
      for (var i = 0; i < montageShutter.montages.length; i++) {
        if (montageShutter.montages[i].name == this.name) {
          alreadyexist = true;
          break;
        }
      }
      if (!alreadyexist) {
        var name = this.name;
        this.toggle();
        montageShutter.newMontage(name);
      }
    },
    onCancelPressed:function(){
      this.toggle();
    },
    start:function(e){
      //DEBUG
      //console.log('montageDialogue:mouseDown');
      this.down = true;
    },
    end:function(e){
      //DEBUG
      //console.log('montageDialogue:mouseUp');
      this.down = false;
    },
    move:function(e){
      //DEBUG
      //console.log('montageDialogue:mouseMove');
      e.movementX = e.movementX || e.deltaX;
      e.movementY = e.movementY || e.deltaY;
      if (this.down == true) {

        var right  = (strToFloat(this.style.right) - e.movementX);
        var bottom  = (strToFloat(this.style.bottom) - e.movementY);
        if (right >= 0 && right+strToFloat(this.style.width) < frame.w && bottom >= 0 && bottom + strToFloat(this.style.height) < frame.h ) {
          this.style.right = right + 'px';
          this.style.bottom = bottom + 'px';
        }

      }
    }
  }
});

document.getElementById('montageName').addEventListener('keypress', (e) => {
  if (e.key == 9166) {
    montageDialogue.onOkPressed();
  } else {
    montageDialogue.name += String.fromCharCode(e.key);
  }
  console.log(e.target.value);
});


montageDialogue.style['z-index'] = 60;

//// Test

//window.addEventListener('keypress',function(e){
//  console.log(String.fromCharCode(e.key));
//});
