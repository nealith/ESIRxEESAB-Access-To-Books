nbButtons = 4

mainStrip = new Vue({
  el: '#mainStrip',
  data:{
    div:document.getElementById('mainStrip'),
    style:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      left : '0px',
      width : (sizePourcent*frame.w)+'px'
    },
    buttonStyle:{
      width : (sizePourcent*frame.w)+'px',
      height : (sizePourcent*frame.w)+'px'
    },
    whiteSpace:{
      height : frame.h-nbButtons*((sizePourcent*frame.w))+'px'
    }
  },
  methods:{
    resize:function(){
      this.style.height = frame.h+'px';
      this.style.width = frame.w * sizePourcent+'px';
      this.style.left = '0px';

      this.buttonStyle.width = frame.w * sizePourcent+'px';
      this.buttonStyle.height = frame.w * sizePourcent+'px';

      this.whiteSpace.height = frame.h-nbButtons*((sizePourcent*frame.w))+'px'
    },
    onNewMontagePressed:function(e){
      console.log('onmontage');
      montageDialogue.toggle();
    },
    onExportMontagePressed:function(e){
      console.log('onmontageExport');
      montageShutter.export();
    },
    onAddNotePressed:function(e){
      console.log('onnotes');
    },
    onEnableVocalPressed:function(e){
      console.log('onvocal');
    }
  }
});
