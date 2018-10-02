mainStrip = new Vue({
  el: '#mainStrip',
  data:{
    div:document.getElementById('mainStrip'),
    filtre_actif: "none",
    default: "none"
  },
  methods:{
    onNewMontagePressed:function(e){
      dialogue.toggle(
        [
          {
            type:'text',
            checkingFunction:montageShutter.checkMontageExist,
            id:'new-montage-name',
            placeholder:'Name (:',
            tap:dialogue.focus
          },
          {
            type:'textarea',
            id:'new-montage-description',
            placeholder:'Description',
            tap:dialogue.focus
          }
        ],
        montageShutter.newMontage
      );
    },
    onExportMontagePressed:function(e){

      let pathToUSB = remote.getGlobal('path_media')+remote.getGlobal('user')+'/';

      ipcRenderer.send('walkon',{path:pathToUSB,callback:'walkonUSB'});

    },
    onAddPostIt:function(e){

    },
    onEnableVocalPressed:function(e){
    }
  }
});

ipcRenderer.on('walkonUSB', (event, dir) => {

  dir.push({name:'./',path:'./'});

  let dirS = [];

  for (var i = 0; i < dir.length; i++) {
    if (dir[i].name != remote.getGlobal('user')) {
      dirS.push({id:dir[i].name,value:dir[i].name});
    }

  }

  dialogue.toggle(
    [
      {
        type:'radio',
        id:'export-montage-radio',
        entries:dirS
      }
    ],
    function(data){

      if (data['export-montage-radio']!= './') {
        for (var i = 0; i < dir.length; i++) {

          if (dir[i].name === data['export-montage-radio']) {
            data['export-montage-radio'] = dir[i].path;
          }
        }
      }

      montageShutter.export(data['export-montage-radio']);
    }
  );
});
