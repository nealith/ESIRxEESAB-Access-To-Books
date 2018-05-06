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
    if (!oracle.pass(e)) {
      return;
    }
    saveMontage(montage);
  })
  svgCanvas[montage.name].mouseup(function(e){
    if (!oracle.pass(e)) {
      return;
    }
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
    down:false,
    style:{
      height : frame.h+'px',
      position : 'absolute',
      top : '0px',
      left : (sizePourcent*frame.w*2)+'px',
      width : (frame.w - sizePourcent*frame.w*3)+'px',
      overflow : 'hidden',
      display:'block'
    },
    styleMontage:{
      height : montageSize+'px',
      width : montageSize+'px',
      margin : montageSize/8.0+'px auto '
    }
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
      if (!oracle.pass(e)) {
        return;
      }
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
    endOnMontage:function(e){
      if (dataTransfer.ready == true) {
        var k = -1;
        for (var i = 0; i < montages.length; i++) {
          if (e.target.parentElement.parentElement.id == montages[i].name || e.target.parentElement.id == montages[i].name) {
            k=i;
            break;
          }

        }
        if (k >= 0) {
          var rect = document.getElementById(montages[k].name).getBoundingClientRect();
          var a = dataTransfer.data.height;
          var b = dataTransfer.data.width;
          var x = (e.clientX - rect.left) - dataTransfer.data.offsetx;
          var y = (e.clientY - rect.top) - dataTransfer.data.offsety;
          var img = svgCanvas[montages[k].name].image(dataTransfer.data.src,b,a).move(x,y);
          img.draggable({
            minX:0,
            minY:0,
            maxX:montageSize,
            maxY:montageSize
          });
          img.mousedown = montageShutter.mouseDownPage;
          saveMontage(montages[k]);
          dataTransfer.data = null,
          dataTransfer.ready = false;
        }
      }
    },
    dragOverMontage:function(e){
      e.preventDefault();
    },
    dropMontage:function(e){
      var k = -1;
      for (var i = 0; i < montages.length; i++) {
        if (e.currentTarget.id == montages[i].name) {
          k=i;
          break;
        }
      }

      if (k >= 0) {
        var rect = e.currentTarget.getBoundingClientRect();

        var data;

        try {
          data = JSON.parse(e.dataTransfer.getData('text'));
        } catch (e) {
          data = montage_data;
        } finally {

        }
        var a = data.height;
        var b = data.width;
        var x = (e.clientX - rect.left) - data.offsetx;
        var y = (e.clientY - rect.top) - data.offsety;
        var img = svgCanvas[montages[k].name].image(data.src,b,a).move(x,y);
        img.draggable({
          minX:0,
          minY:0,
          maxX:montageSize,
          maxY:montageSize
        });
        img.mousedown = montageShutter.mouseDownPage;
        saveMontage(montages[k]);
        //img.touchstart(montageShutter.touchPage);
        console.log("pass in a canvas, src:"+e.dataTransfer.getData('text'));
      }

      console.log("pass in dropImg");
      console.log("target element : "+e.currentTarget.id);

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
    tap:function(e){
      console.log(e);
    },
    rotateOnImage:function(e){
      if (e.target.tagName == 'image') {
        img = SVG.get(e.target.id);
        img.rotate(e.angle);
      }
    },
    theMostVisible:function(){
      var k = -1;
      var deltaOffsetTopScrollTop = 1000000;
      for (var i = 0; i < montages.length; i++) {
        pos = document.getElementById(montages[i].name).offsetTop;
        currentScroll = document.getElementById("montageShutter").scrollTop;
        if (deltaOffsetTopScrollTop > Math.abs(pos-currentScroll)) {
          k=i;
          deltaOffsetTopScrollTop = Math.abs(pos-currentScroll);
        }
      }
      return k;
    },
    export:function(e){
      k = this.theMostVisible();

      if (k != -1) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(svgCanvas[montages[k].name].svg(), "image/svg+xml");

        var images = doc.getElementsByTagName('image');

        var minRatio = 1000000000;

        for (var i = 0; i < images.length; i++) {
          imgData = libraryShutter.getPageByHREF(images[i]['href'].baseVal);
          width = images[i].width.baseVal.value;
          height = images[i].height.baseVal.value;

          if (imgData.originalWidth / width < minRatio) {
            minRatio = imgData.originalWidth / width;
          }
          if (imgData.originalHeight / height < minRatio) {
            minRatio = imgData.originalHeight / height;
          }
        }
        var exportArea = SVG('exportArea').size(montageSize * minRatio,montageSize * minRatio)

        imgs = [];
        paths = [];
        counter = 0;

        for (var i = 0; i < images.length; i++) {
          imgData = libraryShutter.getPageByHREF(images[i]['href'].baseVal);
          imgData.width = images[i].width.baseVal.value*minRatio;
          imgData.height = images[i].height.baseVal.value*minRatio;
          imgData.x = images[i].x.baseVal.value*minRatio;
          imgData.y = images[i].y.baseVal.value*minRatio;
          imgData.angle = 0.0;
          for (var j = 0; j < images[i].length; j++) {
            if(images[i].transform.baseVal[j].angle != 0){
              imgData.angle = images[i].transform.baseVal[j].angle;
            }
          }

          imgs.push(imgData);
          paths.push(path.basename(imgData.originalPath));
          //ipcRenderer.sendSync('copyFileSync',{path:imgData.originalPath,dest:path.basename(imgData.originalPath)});
          fs.createReadStream(imgData.originalPath).pipe(fs.createWriteStream(path.basename(imgData.originalPath)).on("close", function() {
            counter+=1;
            if (paths.length == counter) {

              for (var l = 0; l < imgs.length; l++) {
                exportArea.image(path.basename(imgs[l].originalPath), imgs[l].width, imgs[l].height).move(imgs[l].x,imgs[l].y).rotate(imgs[l].angle)
              }

              fs.writeFileSync(montages[k].name+'.svg', exportArea.svg());

              n = 1;
              zipOutput = montages[k].name+'_export'+n+'.zip';
              exist = fs.existsSync(zipOutput);
              while (exist) {
                n+=1;
                zipOutput = montages[k].name+'_export'+n+'.zip';
                exist = fs.existsSync(zipOutput);
              }

              var zipfile = new yazl.ZipFile();
              for (var i = 0; i < paths.length; i++) {
                zipfile.addFile(paths[i],paths[i]);

              }
              zipfile.addFile(montages[k].name+'.svg',montages[k].name+'.svg');
              zipfile.outputStream.pipe(fs.createWriteStream(zipOutput)).on("close", function() {
                for (var l = 0; l < paths.length; l++) {
                  if (fs.existsSync(paths[l])) {
                    fs.unlinkSync(paths[l]);
                  }
                }
                fs.unlinkSync(montages[k].name+'.svg');
                console.log("export done");
              });
              zipfile.end();
            }
          }));



        }

        /*
        Zipit({
          input: paths,
          cwd: process.cwd()
        }, (err, buffer) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('test');
          n = 1;
          zipOutput = montages[k].name+'_export'+n+'.zip';
          exist = fs.existsSync(zipOutput);
          while (exist) {
            n+=1;
            zipOutput = montages[k].name+'_export'+n+'.zip';
            exist = fs.existsSync(zipOutput);
          }

          fs.writeFile(montages[k].name+'.zip', buffer, (err) => {
            if(err){
              console.log(err);
            }
          });
          // Handle buffer, which is an instance of Buffer
        });*/

      }
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
    console.log(montageSize);
    console.log(arg.name)
    svgCanvas[arg.name] = SVG(arg.name).size(montageSize,montageSize);
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

      var parser = new DOMParser();
      var doc = parser.parseFromString(data, "image/svg+xml");
      var root = doc.getElementsByTagName('svg')[0];
      var ratio = montageSize/root.width.baseVal.value;
      root.width = montageSize;
      root.height = montageSize;

      var images = doc.getElementsByTagName('image');

      svgCanvas[montage.name] = SVG(montage.name).size(montageSize,montageSize);

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

montageShutter.style['padding-left'] = 'auto';
montageShutter.style['padding-right'] = 'auto';
montageShutter.style['white-space'] = 'nowrap';
