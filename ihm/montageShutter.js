var svgCanvas = {}

var montage_data;

function saveMontage(montage){
  fs.writeFile(montage.src, svgCanvas[montage.name].svg(), function(err) {
    if(err) {
        return console.log(err);
    } else {
        console.log("The file was saved!");
    }
  });
}

function saveMontages(){
  for (var i = 0; i < montages.length; i++) {
    saveMontage(montages[i]);
  }
}

function attachAutomaticSaving(montage){
  svgCanvas[montage.name].touchend(function(e){
    saveMontage(montage);
  })
  svgCanvas[montage.name].mouseup(function(e){
    saveMontage(montage);
  })
}


//
// MontageShutter
//


montageShutter = new Vue({
  el: '#montageShutter',
  data:{
    div:document.getElementById('montageShutter'),
    montages:remote.getGlobal('montages'),
    down:false
  },
  methods:{
    resize:function(){
      this.style.left = (strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))+'px';
      this.style.height = frame.h+'px';
      this.style.width = (strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left))) +'px';

      montageSize = Math.min(frame.h*0.8,(strToFloat(libraryStrip.style.left)-(strToFloat(montageStrip.style.width)+strToFloat(montageStrip.style.left)))*0.8);

      this.styleMontage.height = montageSize+'px';
      this.styleMontage.width = montageSize+'px';

      this.style['padding-left'] = 'auto';
      this.style['padding-right'] = 'auto';

      this.styleMontage.margin = montageSize/8.0+'px auto '+montageSize/8.0+'px auto';

      for (var i = 0; i < montages.length; i++) {
        //svgCanvas[montages[i].name].size(montageSize,montageSize);
        svgCanvas[montages[i].name].each(function(i, children) {
          this.draggable({
            minX:0,
            minY:0,
            maxX:montageSize,
            maxY:montageSize
          });
        },true)
      }

    },
    wheelOnMontages:function(e){
      var delta = Math.max(-1, Math.min(1, e.deltaY));
      document.getElementById("montageShutter").scrollTop += (delta*40); // Multiplied by 40
      document.getElementById("montageStrip").scrollTop += (delta*40); // Multiplied by 40
      var t = document.getElementById(e.currentTarget.id);

      e.preventDefault();
    },
    startOnMontages:function(e){
      console.log(e);
      //DEBUG
      //console.log('montageShutter:mouseDown');
      this.down = true;
    },
    endOnMontages:function(e){
      //DEBUG
      //console.log('montageShutter:mouseUp');
      this.down = false;
    },
    moveOnMontages:function(e){
      //DEBUG
      //console.log('montageShutter:mouseMove');
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
      e.movementY = e.movementY || e.deltaY;
      if (this.down == true) {
        var delta = Math.max(-1, Math.min(1, e.movementY));
        document.getElementById("montageShutter").scrollTop -= (delta*40); // Multiplied by 40
        document.getElementById("montageStrip").scrollTop -= (delta*40); // Multiplied by 40
        var t = document.getElementById(e.currentTarget.id);
        e.preventDefault();
        //DEBUG
        //console.log('montageShutter:mouseMove:true');

      }
    },
    newMontage:function(name){
      ipcRenderer.send('new_montage',{
        name:name,
        src:path.normalize(remote.getGlobal('montages_path')+'/'+name+'.svg')
      })
    },
    printSVG:function(name){
      console.log(svgCanvas[name].svg());
    },
    rotateOnImage:function(e){
      if (e.target.tagName == 'image') {
        img = SVG.get(e.target.id);
        img.rotate(e.angle);
      }
    },
    getTargetMontage:function(){
      var targetWorkspace;
      $("#montageShutter").children().each(function() {
        var workspaceY = $(this).offset().top;
        if (workspaceY <= frame.h/2 && workspaceY >= -frame.h/2) {
          targetWorkspace = $(this);
          return false;
        }
      });
      return targetWorkspace.id;
    },
    pushImage:function(img){
      var montageId = getTargetMontage();

      var rect = $("#"+montageId).getBoundingClientRect();
      var x = rect.width/2 - img.offsetx;
      var y = rect.height/2 - img.offsety;
      var img = svgCanvas[montageId].image(img.thumbnail,img.width,img.height).move(x,y);
      img.attr('originalPath',img.originalPath);
      img.attr('dzi',img.dzi);
      img.attr('originalWidth',img.originalWidth);
      img.attr('originalHeight',img.originalHeight);
      img.attr('thumbnail',img.thumbnail)
      img.draggable({
        minX:0,
        minY:0,
        maxX:montageSize,
        maxY:montageSize
      });
      saveMontage(montages[k]);

    },
    export:function(e){
      var montageId = this.theMostVisible();
      svgCanvas[montageId]

      var minRatio = 1000000000;

      $('#'+montageId+' image').each(function(){
        width = this.width();
        height = this.height();

        if (this.attr('originalWidth') / width < minRatio) {
          minRatio = this.attr('originalWidth') / width;
        }
        if (this.attr('originalHeight') / height < minRatio) {
          minRatio = this.attr('originalHeight') / height;
        }
      });
      montageWidth = $('#montageShutter').width();
      montageHeight = frame.h;
      var montageIO = SVG('montageIO').size(montageWidth * minRatio,montageHeight * minRatio)

      imgs = [];
      paths = [];
      counter = 0;


      $('#'+montageId+' image').each(function(){
        imgData = {
          width:this.width()*minRatio,
          height:this.height()*minRatio,
          x:this.x()*minRatio,
          y:this.y()*minRatio,
          angle:this.transform().rotation,
          originalPath:this.attr('originalPath')
        };

        imgs.push(imgData);
        paths.push(path.basename(imgData.originalPath));
        fs.createReadStream(imgData.originalPath).pipe(fs.createWriteStream(path.basename(imgData.originalPath)).on("close", function() {
          counter+=1;
          if (paths.length == counter) {

            for (var l = 0; l < imgs.length; l++) {
              montageIO.image(path.basename(imgs[l].originalPath), imgs[l].width, imgs[l].height).move(imgs[l].x,imgs[l].y).rotate(imgs[l].angle)
            }

            fs.writeFileSync(montageId+'.svg', montageIO.svg());

            n = 1;
            zipOutput = montageId+'_export'+n+'.zip';
            exist = fs.existsSync(zipOutput);
            while (exist) {
              n+=1;
              zipOutput = montageId+'_export'+n+'.zip';
              exist = fs.existsSync(zipOutput);
            }

            var zipfile = new yazl.ZipFile();
            for (var i = 0; i < paths.length; i++) {
              zipfile.addFile(paths[i],paths[i]);

            }
            zipfile.addFile(montageId+'.svg',montageId+'.svg');
            zipfile.outputStream.pipe(fs.createWriteStream(zipOutput)).on("close", function() {
              for (var l = 0; l < paths.length; l++) {
                if (fs.existsSync(paths[l])) {
                  fs.unlinkSync(paths[l]);
                }
              }
              fs.unlinkSync(montageId+'.svg');
              console.log("export done");
            });
            zipfile.end();
          }
        }));
      });
    }
  }
});

ipcRenderer.on('sync_montages', (event, arg) => {
  montages = remote.getGlobal('montages');
  montageShutter.montages = montages;
  montageStrip.montages = montages;
});

ipcRenderer.on('new_montage_added', (event, arg) => {
  montages = remote.getGlobal('montages');
  montageShutter.montages = montages;
  montageStrip.montages = montages;
  window.setTimeout(function() {
    svgCanvas[arg.name] = SVG(arg.name).size($('#montageShutter').width(),frame.h);
    attachAutomaticSaving(arg);
    saveMontage(arg);
  },200);
});


// Import a montage with some necessary "cleaning" in svg/xml code to avoid huge recursivity in xml
function loadMontage(montage){
  fs.readFile(montage.src, {encoding: 'utf-8'}, function(err,data) {
    if(err) {
      return console.log(err);
    } else {

      montageWidth = $('#montageShutter').width();
      montageHeight = frame.h;

      var parser = new DOMParser();
      var doc = parser.parseFromString(data, "image/svg+xml");
      var root = doc.getElementsByTagName('svg')[0];
      var ratioW = montageWidth/root.width.baseVal.value;
      var ratioH = montageHeight/root.width.baseVal.value;
      var ratio = ratioW;
      if (ratioH < ratio) {
        ratio = ratioH;
      }
      root.width = montageWidth;
      root.height = montageHeight;

      var images = doc.getElementsByTagName('image');

      svgCanvas[montage.name] = SVG(montage.name).size(montageWidth,montageHeight);

      for (var i = 0; i < images.length; i++) {
        var width = images[i].width.baseVal.value*ratio;
        var height = images[i].height.baseVal.value*ratio;
        var x = images[i].x.baseVal.value*ratio;
        var y = images[i].y.baseVal.value*ratio;
        var angle = 0
        for (var j = 0; j < images[i].length; j++) {
          if(images[i].transform.baseVal[j].angle != 0){
            angle = images[i].transform.baseVal[j].angle;
          }
        }
        //console.log(x,y)
        var img = svgCanvas[montage.name].image(images[i]['href'].baseVal, width, height).move(x,y).rotate(angle);
      }

      var XMLS = new XMLSerializer();
      data = XMLS.serializeToString(doc);

      // Make image draggable
      svgCanvas[montage.name].each(function(i, children) {
        this.draggable({
          minX:0,
          minY:0,
          maxX:montageSize,
          maxY:montageSize
        });
      },true)


      attachAutomaticSaving(montage);
    }
  });
}

for (var i = 0; i < montages.length; i++) {
  loadMontage(montages[i]);

}
