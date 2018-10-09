dialogue = new Vue({
  el: '#dialogue',
  data:{
    active:false,
    entries:[],
    onsend:null,
    okPressed:false,
    currentFocus:null
  },
  methods:{
    onKeyPressed:function(e){
      if (e.key != 9166 && e.key != 8657) {
        this.currentFocus.vueel.$children[0].value += String.fromCharCode(e.key);
      }
    },
    focus:function(arg){
      if (this.currentFocus != null) {
        this.currentFocus.el.removeEventListener('keypress',this.onKeyPressed);
        keyboard.removeListener(this.currentFocus.info.id);
      }
      this.currentFocus = arg;
      keyboard.addListener(this.currentFocus.info.id);
      this.currentFocus.el.addEventListener('keypress',this.onKeyPressed);
    },
    send:function(data){
      if (this.onsend != null) {
        onsend = this.onsend;
        this.toggle();
        onsend(data);
      } else  {
        this.toggle();
      }
    },
    cancel:function(){
      if (this.oncancel && this.oncancel != null) {
        this.oncancel();
      }
      this.toggle();
    },
    isOkPressed:function(e){
      if (e.key == 9166) {
        this.okPressed = true;
      }
    },
    toggle:function(entries,onsend,oncancel){
      if (!this.active) {
        this.active = true;
        this.entries = entries;
        this.onsend = onsend;
        this.oncancel = oncancel;

        keyboard.toggle();
        keyboard.addListener('dialogue');

        byId('dialogue').addEventListener('keypress',this.isOkPressed);
      } else {
        this.okPressed = false;
        this.active = false;
        this.entries=[];
        this.onsend=null;
        this.oncancel = null;
        byId('dialogue').removeEventListener('keypress',this.isOkPressed);
        keyboard.removeListener('dialogue');
        keyboard.toggle();
      }
    },
  }
});
