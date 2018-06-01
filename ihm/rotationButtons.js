rotationButtons = new Vue({
  el: '#rotationButtons',
  data:{
    rotated:false
  },
  methods:{
    onRotatePressed:function(){
      if (!oracle.pass(e)) {
        return;
      }
      el = document.getElementById("rotationWrap");
      if (this.rotated) {
        el.className = "";
        this.rotated = false;
      } else {
        el.style.height = frame.h+'px';
        el.className = "rotated";
        this.rotated = true;
      }
    }
  }
});
