VueSizeChanged = {};

VueSizeChanged.install = function(Vue, options){
  Vue.directive('size-changed',{
    bind: function(el, binding, vnode){

      var style = window.getComputedStyle(el);
      var transition = style.transition;
      if (!(style.transition.includes('width'))) {
        let width='width 0s ease 0s';
        if (transition == '') {
          transition+=width;
        } else {
          transition+=','+width;
        }
      }

      if (!(style.transition.includes('height'))) {
        let height='height 0s ease 0s';
        if (transition == '') {
          transition+=height;
        } else {
          transition+=','+height;
        }
      }

      el.setAttribute('style','transition:'+transition+';');

      var currentWidth = style.width;
      var currentHeigth = style.height;

      el.addEventListener('transitionend',function(evt){
        let newStyle = window.getComputedStyle(el);
        SizeChangeEvent = {
          oldWidth:currentWidth,
          oldHeight:currentHeigth,
          newWidth:newStyle.width,
          newHeight:newStyle.height,
          widthChanged:(newStyle.width != currentWidth),
          heigthChanged:(newStyle.height != currentHeigth),
          target:el
        }
        if (SizeChangeEvent.widthChanged == true || SizeChangeEvent.heigthChanged == true) {
          currentWidth = newStyle.width;
          currentHeigth = newStyle.height;
          binding.value(SizeChangeEvent);
        }
      });


    }
  });
}
