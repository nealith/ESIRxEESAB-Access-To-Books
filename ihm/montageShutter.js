var svgCanvas = {}

var montage_data;

var pW = 0.94;

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
    down:false,
    selected:-1
  },
  methods:{
    /*resize:function(){
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
            maxX:frame.w*pW,
            maxY:frame.h
          });
        },true)
      }

    },*/
    selectedMontageChanged:function(e){
      this.selected = e.selected;
      montageStrip.$refs.montageStripSlides.updateSelected(e.selected);
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
    pinchOnImage:function(e){
      if (e.target.tagName == 'image') {
        img = SVG.get(e.target.id);
        img.transform({scale:e.zoom});
      }
    },
    pushImage:function(img){
      if (this.selected>=0) {
        var montageId = this.montages[this.selected].name;

        var rectMontage = rect(byId(montageId));
        var rectImg = rect(byId(img.id));
        var x = rectMontage.width/2 - rectImg.width/2;
        var y = rectMontage.height/2 - rectImg.height/2;
        var svgimg = svgCanvas[montageId].image(img.thumbnail,img.width,img.height).move(x,y);

        byId(svgimg.node.id).setAttribute('originalPath',img.originalPath);
        byId(svgimg.node.id).setAttribute('dzi',img.dzi);
        byId(svgimg.node.id).setAttribute('originalWidth',img.originalWidth);
        byId(svgimg.node.id).setAttribute('originalHeight',img.originalHeight);
        byId(svgimg.node.id).setAttribute('thumbnail',img.thumbnail)
        svgimg.draggable({
          minX:0,
          minY:0,
          maxX:frame.w*pW,
          maxY:frame.h
        });

        console.log(svgimg);

        saveMontage(montages[this.selected]);
      }
    },
    export:function(e){
      /*
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
    }*/
    k = this.selected;

      if (k != -1) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(svgCanvas[montages[k].name].svg(), "image/svg+xml");

        var images = doc.getElementsByTagName('image');

        var minRatio = 1000000000;

        for (var i = 0; i < images.length; i++) {
          imgData = {};

          imgData.originalPath = images[i].getAttribute('originalPath');
          imgData.dzi = images[i].getAttribute('dzi');
          imgData.originalWidth = images[i].getAttribute('originalWidth');
          imgData.originalHeight = images[i].getAttribute('originalHeight');
          imgData.thumbnail = images[i].getAttribute('thumbnail')


          console.log(images[i]);
          width = images[i].width.baseVal.value;
          height = images[i].height.baseVal.value;

          if (imgData.originalWidth / width < minRatio) {
            minRatio = imgData.originalWidth / width;
          }
          if (imgData.originalHeight / height < minRatio) {
            minRatio = imgData.originalHeight / height;
          }
        }
        var montageIO = SVG('montageIO').size(frame.w*pW * minRatio,frame.h * minRatio)

        imgs = [];
        paths = [];
        counter = 0;

        for (var i = 0; i < images.length; i++) {
          imgData = {};

          imgData.originalPath = images[i].getAttribute('originalPath');
          imgData.dzi = images[i].getAttribute('dzi');
          imgData.originalWidth = images[i].getAttribute('originalWidth');
          imgData.originalHeight = images[i].getAttribute('originalHeight');
          imgData.thumbnail = images[i].getAttribute('thumbnail')
          console.log(images[i]);
          console.log(imgData);
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
                montageIO.image(path.basename(imgs[l].originalPath), imgs[l].width, imgs[l].height).move(imgs[l].x,imgs[l].y).rotate(imgs[l].angle)
              }

              fs.writeFileSync(montages[k].name+'.svg', montageIO.svg());

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
    console.log(frame.w*pW,frame.h);
    svgCanvas[arg.name] = SVG(arg.name).size(frame.w*pW,frame.h);
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

      montageWidth = frame.w*pW;
      montageHeight = frame.h;

      var parser = new DOMParser();
      var doc = parser.parseFromString(data, "image/svg+xml");
      var root = doc.getElementsByTagName('svg')[0];
      /*var ratioW = montageWidth/root.width.baseVal.value;
      var ratioH = montageHeight/root.width.baseVal.value;
      var ratio = ratioW;
      if (ratioH < ratio) {
        ratio = ratioH;
      }*/
      var ratio = 1;

      root.width = montageWidth;
      root.height = montageHeight;

      var images = doc.getElementsByTagName('image');

      svgCanvas[montage.name] = SVG(montage.name).size(frame.w*pW,frame.h);

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
        byId(img.node.id).setAttribute('originalPath',images[i].getAttribute('originalPath'));
        byId(img.node.id).setAttribute('dzi',images[i].getAttribute('dzi'));
        byId(img.node.id).setAttribute('originalWidth',images[i].getAttribute('originalWidth'));
        byId(img.node.id).setAttribute('originalHeight',images[i].getAttribute('originalHeight'));
        byId(img.node.id).setAttribute('thumbnail',images[i].getAttribute('thumbnail'));
      }

      var XMLS = new XMLSerializer();
      data = XMLS.serializeToString(doc);

      // Make image draggable
      svgCanvas[montage.name].each(function(i, children) {
        this.draggable({
          minX:0,
          minY:0,
          maxX:montageWidth,
          maxY:montageHeight
        });
      },true)


      attachAutomaticSaving(montage);
    }
  });
}

for (var i = 0; i < montages.length; i++) {
  loadMontage(montages[i]);

}
