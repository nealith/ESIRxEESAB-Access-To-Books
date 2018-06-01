mainStrip = new Vue({
  el: '#mainStrip',
  data:{
    div:document.getElementById('mainStrip'),
    filtre_actif: "none",
    default: "none"
  },
  methods:{
    onNewMontagePressed:function(e){
      dialogue.toggle(montageShutter.newMontage);
    },
    onExportMontagePressed:function(e){
      montageShutter.export();
    },
    onAddPostIt:function(e){

    },
    onEnableVocalPressed:function(e){
    }
  }
});
