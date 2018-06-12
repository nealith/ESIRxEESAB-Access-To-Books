/* v-draggable
 *
 * axis = x or y or none, default = none
 * containment = parend or a element id or none, default = none
 * start = function(evt){...}
 * drag = function(evt){...}
 * end = function(evt){...}
 *
 */


VueDraggable = {
  dragStart:function(evt,el){
    el.setAttribute('is-dragged',true);
    if (evt.type=='touchstart') {
      el.setAttribute('current-x',evt.touches[0].pageX);
      el.setAttribute('current-y',evt.touches[0].pageY);
    }
  },
  drag:function(evt,el){

    if (el.getAttribute('is-dragged') === 'true') {

      let containment = null
      if (el.getAttribute('drag-containment') == 'parent') {
        containment = el.parentElement;
      } else if (el.getAttribute('drag-containment') != 'none'){
        containment = document.getElementById(el.getAttribute('drag-containment'));
      }
      rectEl = el.getBoundingClientRect();
      rectContainment = null;
      if (containment != null) {
        rectContainment = containment.getBoundingClientRect();
      }

      let left=0;
      let top=0;

      if (el.getAttribute('drag-on-axis') == 'x' || el.getAttribute('drag-on-axis') == 'none') {
        if (evt.type=='touchmove') {
          evt.deltaX = evt.touches[0].pageX - parseFloat(el.getAttribute('current-x'));
        } else {
          evt.deltaX = evt.deltaX || evt.movementX;
        }
        if (containment!= null) {
          if (evt.deltaX > 0) {
            evt.deltaX = Math.min(evt.deltaX,rectContainment.right-rectEl.right);
          } else {
            evt.deltaX = Math.max(evt.deltaX,rectContainment.left-rectEl.left);
          }
        }
        left = evt.deltaX + parseFloat(window.getComputedStyle(el,null).getPropertyValue('left'));

      }
      if (el.getAttribute('drag-on-axis') == 'y' || el.getAttribute('drag-on-axis') == 'none') {
        if (evt.type=='touchmove') {
          evt.deltaY = evt.touches[0].pageY - parseFloat(el.getAttribute('current-y'));
        } else {
          evt.deltaY = evt.deltaY || evt.movementY;
        }
        if (containment!= null) {
          if (evt.deltaY > 0) {
            evt.deltaY = Math.min(evt.deltaY,rectContainment.bottom-rectEl.bottom);
          } else {
            evt.deltaY = Math.max(evt.deltaY,rectContainment.top-rectEl.top);
          }
        }
        top = evt.deltaY + parseFloat(window.getComputedStyle(el,null).getPropertyValue('top'));
      }

      el.setAttribute('style','left:'+left+'px;top:'+top+'px;');

      if (evt.type=='touchmove') {
        el.setAttribute('current-x',evt.touches[0].pageX);
        el.setAttribute('current-y',evt.touches[0].pageY);
      }
    }
  },
  dragStop:function(evt,el){
    el.removeAttribute('is-dragged');
  }
}


VueDraggable.install = function(Vue, options){
  Vue.directive('draggable',{
    bind: function(el, binding, vnode){
      el.setAttribute('drag-on-axis',binding.value.axis || 'none');
      el.setAttribute('drag-containment',binding.value.containment || 'none');

      onlyOn = binding.value.onlyOn || false

      el.addEventListener('mousedown',function(evt){
        VueDraggable.dragStart(evt,el);
        if (binding.value.start) {
          binding.value.start(evt);
        }
      });

      el.addEventListener('touchstart',function(evt){
        VueDraggable.dragStart(evt,el);
        if (binding.value.start) {
            binding.value.start(evt);
        }
      },{passive: true});

      function drag(evt){
        VueDraggable.drag(evt,el);
        if (binding.value.drag && el.getAttribute('is-dragged') === 'true' ) {
          binding.value.drag(evt);
        }
      }

      function end(evt){
        VueDraggable.dragStop(evt,el);
        if (binding.value.end && !el.hasAttribute('is-dragged')) {
          binding.value.end(evt);
        }
      }

      if (onlyOn) {
        el.addEventListener('mousemove',drag);
        el.addEventListener('touchmove',drag);

        el.addEventListener('touchleave',end);
        el.addEventListener('mouseout',end);
        el.addEventListener('touchend',end);
        el.addEventListener('mouseup',end);
      } else {
        window.addEventListener('mousemove',drag);
        window.addEventListener('touchmove',drag);

        window.addEventListener('touchend',end);
        window.addEventListener('mouseup',end);
      }

    }
  });
}
