dialogue = new Vue({
  el: '#dialogue',
  data:{
    active:false,
    name:"",
    callback:null
  },
  methods:{
    onOkPressed:function(){
      var name = this.name;
      callback = this.callback;
      this.toggle();
      callback(name);
    },
    onCancelPressed:function(){
      this.toggle();
    },
    toggle:function(callback){
      if (!this.active) {
        this.active = true;
        this.callback=callback;
        keyboard.addListener('name');
        keyboard.toggle();
      } else {
        this.active = false;
        this.callback=null;
        keyboard.removeListener('name');
        keyboard.toggle();
        this.name = "";
      }
    },
  }
});

document.getElementById('name').addEventListener('keypress', (e) => {
  if (e.key == 9166) {
    dialogue.onOkPressed();
  } else {
    dialogue.name += String.fromCharCode(e.key);
  }
  console.log(e.target.value);
});
