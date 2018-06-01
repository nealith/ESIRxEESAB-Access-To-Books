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
      if (!active) {
        this.active = true;
        this.callback=callback;
        keyboard.addListener('montageName');
        keyboard.toggle();
      } else {
        this.active = false;
        this.callback=null;
        keyboard.removeListener('montageName');
        keyboard.toggle();
        this.name = "";
      }
    },
  }
});

document.getElementById('name').addEventListener('keypress', (e) => {
  if (e.key == 9166) {
    montageDialogue.onOkPressed();
  } else {
    montageDialogue.name += String.fromCharCode(e.key);
  }
  console.log(e.target.value);
});


$("#dialogue").draggable({
  containment: "parent",
  snap: "#rotationWrap",
  snapTolerance: 20,
  start: function(){},
  drag: function(){},
  stop: function(){}
});
