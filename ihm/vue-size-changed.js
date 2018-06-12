VueSizeChanged = {};

VueSizeChanged.install = function(Vue, options){
  Vue.directive('size-changed',{
    bind: function(el, binding, vnode){

      var style = window.getComputedStyle(el);
      var currentWidth = style.width;
      var currentHeigth = style.height;

      function onTransition(evt){
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
          console.log('tsssss');
          currentWidth = newStyle.width;
          currentHeigth = newStyle.height;
          binding.value(SizeChangeEvent);
        }
      }

      el.addEventListener('transitionend',onTransition);

    }
  });
}
