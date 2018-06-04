// IMPORTANT

// NEED vue-simple-gesture.js

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
      update:function(){
        container = document.getElementById(this.conf.id);
        slides = (Array.from(container.childNodes))[0];
        slidesChilds = Array.from(slides.childNodes);
        selectedEl = slidesChilds[selected];
        selectedEl.setAttribute('selected',true);
      },
      scrollTo:function(nextSelected){

        container = document.getElementById(this.conf.id);
        slides = (Array.from(container.children))[0];
        slidesChilds = Array.from(slides.children);

        console.log(nextSelected);
        if (nextSelected >= 0 && nextSelected < slidesChilds.length) {

          selectedEl = slidesChilds[this.selected];
          nextSelectedEl = slidesChilds[nextSelected];

          selectedElStyle = selectedEl.getBoundingClientRect()//window.getComputedStyle(selectedEl);
          nextSelectedElStyle = nextSelectedEl.getBoundingClientRect()//window.getComputedStyle(nextSelectedEl);

          dLeft = parseFloat(nextSelectedElStyle.left) - parseFloat(selectedElStyle.left);
          dTop = parseFloat(nextSelectedElStyle.top) - parseFloat(selectedElStyle.top);

          slidesStyle = window.getComputedStyle(slides)

          lefttop = 'left:'+(parseFloat(slidesStyle.left) - dLeft)+'px;top:'+(parseFloat(slidesStyle.top) - dTop)+'px;';

          slides.setAttribute('style',lefttop);
          console.log(slides.getAttribute('style'));

          selectedEl.removeAttribute('selected');
          nextSelectedEl.setAttribute('selected',true);
        }


      },
      swipe:function(evt){
        console.log(evt.direction);
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
          this.scrollTo(nextSelected);
          this.selected = nextSelected;
        }
      },
      move:function(evt){
        /*
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
          this.scrollTo(nextSelected);
          this.selected = nextSelected;
        }*/
      }
    },
    template:`
      <div v-bind:id="conf.id" class="slides-container" v-simple-gesture:swipe="swipe" v-simple-gesture:pressMove="{start:function(){},move:move,end:function(){},leave:function(){}}" :horizontal="conf.horizontal">
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
