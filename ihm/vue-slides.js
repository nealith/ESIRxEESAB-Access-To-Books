// IMPORTANT

// NEED vue-draggable.js
// NEED vue-size-changed.js
// NEED vue-simple-gesture.js

// if not done : don't forget Vue.use(VueDraggable);
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
    mounted:function(){
      this.scrollToSelected();
    },
    updated:function(){
      this.scrollToSelected();
    },
    props:{
      id:String,
      pos:Number,
      horizontal:Boolean,
      lock:Boolean,
      conf:Object,
      aclass:String,
      'pseudo-drag':Boolean,
      'on-slide':Function,
      'drag':Boolean
    },
    methods:{
      updateSelected(selected){
        container = document.getElementById(this.id);
        slides = (Array.from(container.children))[0];
        slidesChilds = Array.from(slides.children);

        if (selected >= 0 && selected < slidesChilds.length) {
          selectedEl = slidesChilds[this.selected];
          selectedEl.removeAttribute('selected');

          this.selected = selected;
          this.scrollToSelected();
        }
      },
      scrollToSelected:function(){
        console.log('lol');
        container = document.getElementById(this.id);
        slides = (Array.from(container.children))[0];
        slidesChilds = Array.from(slides.children);

        if (slidesChilds.length > 0) {
          selectedEl = slidesChilds[this.selected];
          rectSelectedEl = selectedEl.getBoundingClientRect();
          rectContainer = container.getBoundingClientRect();

          xContainerCenter = parseFloat(rectContainer.width)/2 + parseFloat(rectContainer.left);
          yContainerCenter = parseFloat(rectContainer.height)/2 + parseFloat(rectContainer.top);

          xSelectedElCenter = parseFloat(rectSelectedEl.width)/2 + parseFloat(rectSelectedEl.left);
          ySelectedElCenter = parseFloat(rectSelectedEl.height)/2 + parseFloat(rectSelectedEl.top);

          if (this.pos != undefined && this.pos==0) {
            if (this.horizontal != undefined && this.horizontal == true) {
              xContainerCenter = parseFloat(rectContainer.left);
              xSelectedElCenter = parseFloat(rectSelectedEl.left);
            } else {
              yContainerCenter = parseFloat(rectContainer.top);
              ySelectedElCenter = parseFloat(rectSelectedEl.top);
            }
          }

          if (this.pos != undefined && this.pos==2) {
            if (this.horizontal != undefined && this.horizontal == true) {
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
          slides.setAttribute('style',lefttop);
          selectedEl.setAttribute('selected',true);

          if (this.onSlide != undefined) {
            this.onSlide({selected:this.selected,id:this.id});
          }
        }



      },
      swipe:function(evt){
        if ((this.pseudoDrag === undefined || this.pseudoDrag == false) && (this.lock === undefined || this.lock == false)) {
          nextSelected=this.selected;

          if ((this.horizontal != undefined && this.horizontal == true ) && (evt.direction == 'R' || evt.direction == 'L')) {
            if (evt.direction == 'L') {
              nextSelected++;
            } else {
              nextSelected--;
            }
          } else if((this.horizontal === undefined || this.horizontal == false) && (evt.direction == 'T' || evt.direction == 'B')) {
            if (evt.direction == 'T') {
              nextSelected++;
            } else {
              nextSelected--;
            }
          }
          if (nextSelected != this.selected) {
            container = document.getElementById(this.id);
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
        if ((this.pseudoDrag != undefined && this.pseudoDrag == true) && (this.lock === undefined || this.lock == false)) {

          nextSelected=this.selected;
          if ((this.horizontal != undefined && this.horizontal == true )) {
            if (evt.movementX < 0) {
              nextSelected++;
            } else if (evt.movementX > 0) {
              nextSelected--;
            }
          } else if((this.horizontal === undefined || this.horizontal == false)) {
            if (evt.movementY < 0) {
              nextSelected++;
            } else if (evt.movementY > 0) {
              nextSelected--;
            }
          }
          if (nextSelected != this.selected) {
            container = document.getElementById(this.id);
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
      ondrag:function(evt){

        console.log('enculer');

        nextSelected=this.selected;
        container = document.getElementById(this.id);
        slides = (Array.from(container.children))[0];
        slidesChilds = Array.from(slides.children);

        rectContainer = container.getBoundingClientRect();

        xContainerCenter = parseFloat(rectContainer.width)/2 + parseFloat(rectContainer.left);
        yContainerCenter = parseFloat(rectContainer.height)/2 + parseFloat(rectContainer.top);

        selectedEl = slidesChilds[this.selected];
        selectedEl.removeAttribute('selected');

        if (this.pos != undefined && this.pos==0) {
          if (this.horizontal != undefined && this.horizontal == true) {
            xContainerCenter = parseFloat(rectContainer.left);
          } else {
            yContainerCenter = parseFloat(rectContainer.top);
          }
        }

        if (this.pos != undefined && this.pos==2) {
          if (this.horizontal != undefined && this.horizontal == true) {
            xContainerCenter = parseFloat(rectContainer.right);
          } else {
            yContainerCenter = parseFloat(rectContainer.bottom);
          }
        }

        var bestEl = null;
        var bestElRect;
        var bestDistX;
        var bestDistY;

        for (var i = 0; i < slidesChilds.length; i++) {

          nextselectedEl = slidesChilds[i];

          rectSelectedEl = nextselectedEl.getBoundingClientRect();

          xSelectedElCenter = parseFloat(rectSelectedEl.width)/2 + parseFloat(rectSelectedEl.left);
          ySelectedElCenter = parseFloat(rectSelectedEl.height)/2 + parseFloat(rectSelectedEl.top);

          if (this.pos != undefined && this.pos==0) {
            if (this.horizontal != undefined && this.horizontal == true) {
              xSelectedElCenter = parseFloat(rectSelectedEl.left);
            } else {
              ySelectedElCenter = parseFloat(rectSelectedEl.top);
            }
          }

          if (this.pos != undefined && this.pos==2) {
            if (this.horizontal != undefined && this.horizontal == true) {
              xSelectedElCenter = parseFloat(rectSelectedEl.right);
            } else {
              ySelectedElCenter = parseFloat(rectSelectedEl.bottom);
            }
          }

          distX = Math.abs(xContainerCenter - xSelectedElCenter);
          distY = Math.abs(yContainerCenter - ySelectedElCenter);


          if ((distY < bestDistY && this.horizontal == false) || (this.horizontal == true && distX < bestDistX) || bestEl == null) {
            bestEl = nextselectedEl;
            bestElRect = rectSelectedEl;
            bestDistX = distX;
            bestDistY = distY;
            nextSelected = i;
          } else {
            break;
          }
        }

        this.selected = nextSelected;
        bestEl.setAttribute('selected',true);
      }
    },
    template:`
      <div v-if="!drag" v-bind:id="id" :class="aclass != undefined ? 'slides-container '+aclass : 'slides-container'" v-size-changed="scrollToSelected" v-simple-gesture:swipe="swipe" v-simple-gesture:press-move="{start:function(){},move:move,end:function(){},leave:function(){}}" :horizontal="horizontal" :vertical="!horizontal">
        <div class="slides">
          <slot></slot>
        </div>
      </div>

      <div v-else-if="drag" v-bind:id="id" :class="aclass != undefined ? 'slides-container '+aclass : 'slides-container'" v-size-changed="scrollToSelected" :horizontal="horizontal" :vertical="!horizontal">
        <div v-if="(horizontal != undefined || horizontal == true) ? true : false" class="slides" v-draggable="{axis:'x',drag:ondrag,end:scrollToSelected}">
          <slot></slot>
        </div>

        <div v-else-if="(horizontal === undefined || horizontal == false) ? true : false" class="slides" v-draggable="{axis:'y',drag:ondrag,end:scrollToSelected}">
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
      data:Object,
      aclass:String,
      'on-tap':Function,
      'on-double-tap':Function,
      'on-long-tap':Function,
    },
    methods:{
      tap:function(evt){
        if (this.onTap) {
          evt.data = this.data;
          this.onTap(evt);
        }
      },
      doubleTap:function(evt){
        if (this.onDoubleTap) {
          evt.data = this.data;
          this.onDoubleTap(evt);
        }
      },
      longTap:function(evt){
        if (this.onLongTap) {
          evt.data = this.data;
          this.onLongTap(evt);
        }
      }
    },
    template:`
      <div :class="aclass != undefined ? 'slide '+aclass : 'slide'" v-simple-gesture:tap="tap" v-simple-gesture:double-tap="doubleTap" v-simple-gesture:long-tap="longTap">
        <slot></slot>
      </div>
    `
  });



}
