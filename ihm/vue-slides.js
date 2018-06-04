// IMPORTANT

// NEED vue-size-changed.js
// NEED vue-simple-gesture.js

// if not done : don't forget Vue.use(VueSizeChanged);
// if not done : don't forget Vue.use(VueSimpleGesture);

VueSlides = {};

VueSlides.install = function(Vue, options){

  Vue.component('slides',{
    data:function(){
      return {
        selected:0
      };
    },
    props:{
      conf:Object
    },
    methods:{
      scrollToSelected:function(){
        container = document.getElementById(this.conf.id);
        slides = (Array.from(container.children))[0];
        slidesChilds = Array.from(slides.children);

        selectedEl = slidesChilds[this.selected];
        rectSelectedEl = selectedEl.getBoundingClientRect();
        rectContainer = container.getBoundingClientRect();

        console.log(rectContainer);
        console.log(rectSelectedEl);

        xContainerCenter = parseFloat(rectContainer.width)/2 + parseFloat(rectContainer.left);
        yContainerCenter = parseFloat(rectContainer.height)/2 + parseFloat(rectContainer.top);

        xSelectedElCenter = parseFloat(rectSelectedEl.width)/2 + parseFloat(rectSelectedEl.left);
        ySelectedElCenter = parseFloat(rectSelectedEl.height)/2 + parseFloat(rectSelectedEl.top);

        if (this.conf.pos != undefined && this.conf.pos==0) {
          if (this.conf.horizontal != undefined && this.conf.horizontal == true) {
            xContainerCenter = parseFloat(rectContainer.left);
            xSelectedElCenter = parseFloat(rectSelectedEl.left);
          } else {
            yContainerCenter = parseFloat(rectContainer.top);
            ySelectedElCenter = parseFloat(rectSelectedEl.top);
          }
        }

        if (this.conf.pos != undefined && this.conf.pos==2) {
          if (this.conf.horizontal != undefined && this.conf.horizontal == true) {
            xContainerCenter = parseFloat(rectContainer.right);
            xSelectedElCenter = parseFloat(rectSelectedEl.right);
          } else {
            yContainerCenter = parseFloat(rectContainer.bottom);
            ySelectedElCenter = parseFloat(rectSelectedEl.bottom);
          }
        }

        dLeft = xContainerCenter - xSelectedElCenter;
        dTop = yContainerCenter - ySelectedElCenter;

        slidesStyle = window.getComputedStyle(slides)
        lefttop = 'left:'+(parseFloat(slidesStyle.left) + dLeft)+'px;top:'+(parseFloat(slidesStyle.top) + dTop)+'px;';
        console.log(lefttop);
        slides.setAttribute('style',lefttop);
        selectedEl.setAttribute('selected',true);

      },
      swipe:function(evt){
        if ( this.conf.drag === undefined || this.conf.drag == false) {
          nextSelected=this.selected;
          if ((this.conf.horizontal != undefined && this.conf.horizontal == true ) && (evt.direction == 'R' || evt.direction == 'L')) {
            if (evt.direction == 'L') {
              nextSelected++;
            } else {
              nextSelected--;
            }
          } else if((this.conf.horizontal === undefined || this.conf.horizontal == false) && (evt.direction == 'T' || evt.direction == 'B')) {
            if (evt.direction == 'T') {
              nextSelected++;
            } else {
              nextSelected--;
            }
          }
          if (nextSelected != this.selected) {
            container = document.getElementById(this.conf.id);
            slides = (Array.from(container.children))[0];
            slidesChilds = Array.from(slides.children);

            if (nextSelected >= 0 && nextSelected < slidesChilds.length) {
              selectedEl = slidesChilds[this.selected];
              selectedEl.removeAttribute('selected');

              this.selected = nextSelected;
              this.scrollToSelected();
            }
          }
        }
      },
      move:function(evt){
        if (this.conf.drag != undefined || this.conf.drag == true) {
          nextSelected=this.selected;
          if ((this.conf.horizontal != undefined && this.conf.horizontal == true ) && evt.movementX > evt.movementY) {
            if (evt.movementX > 0) {
              nextSelected++;
            } else {
              nextSelected--;
            }
          } else if((this.conf.horizontal === undefined || this.conf.horizontal == false) && evt.movementX < evt.movementY) {
            if (evt.movementY > 0) {
              nextSelected++;
            } else {
              nextSelected--;
            }
          }
          if (nextSelected != this.selected) {
            container = document.getElementById(this.conf.id);
            slides = (Array.from(container.children))[0];
            slidesChilds = Array.from(slides.children);

            if (nextSelected >= 0 && nextSelected < slidesChilds.length) {
              selectedEl = slidesChilds[this.selected];
              selectedEl.removeAttribute('selected');

              this.selected = nextSelected;
              this.scrollToSelected();
            }
          }
        }
      }
    },
    template:`
      <div v-bind:id="conf.id" class="slides-container" v-size-changed="scrollToSelected" v-simple-gesture:swipe="swipe" v-simple-gesture:pressMove="{start:function(){},move:move,end:function(){},leave:function(){}}" :horizontal="conf.horizontal" :vertical="!conf.horizontal">
        <div class="slides">
          <slot></slot>
        </div>
      </div>
    `
  });

  Vue.component('slide',{
    data:function(){
      return {
      };
    },
    props:{
      wrap:Object
    }, // wrap should be a object, called 'data' about slide information, like image path, text etc, and 'methods' : with three (optionnal) methods : tap, longTap, doubleTap
    methods:{
      tap:function(evt){
        if (this.wrap.methods && this.wrap.methods.tap) {
          evt.data = wrap.data;
          this.wrap.methods.tap(evt);
        }
      },
      doubleTap:function(evt){
        if (this.wrap.methods && this.wrap.methods.doubleTap) {
          evt.data = wrap.data;
          this.wrap.methods.doubleTap(evt);
        }
      },
      longTap:function(evt){
        if (this.wrap.methods && this.wrap.methods.longTap) {
          evt.data = wrap.data;
          this.wrap.methods.longTap(evt);
        }
      }
    },
    template:`
      <div class="slide" v-simple-gesture:tap="tap" v-simple-gesture:doubleTap="doubleTap" v-simple-gesture:long-tap="longTap">
        <slot></slot>
      </div>
    `
  });



}
