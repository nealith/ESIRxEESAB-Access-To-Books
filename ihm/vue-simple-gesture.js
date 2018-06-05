VueSimpleGesture = {}

/* This library handle simple gesture event from both mouse and touch event with one finger
 * recognize :
 * single tap
 * double tap
 * long tap
 * swipe to any direction return one or two char string, if two, first letter if for left or right, second pour top or bottom (L:left R:right B:bottom T:top)
 * pressMove (need a object with four function : start, move, end, leave)
 */

// options
// doubleTapTime = max time between two tap to be considered as doubleTap
//

VueSimpleGesture.install = function(Vue, options){

  Vue.directive('simple-gesture',{
    bind: function(el, binding, vnode){

      options = options || {};

      doubleTapTime = options.doubleTapTime || 150;
      longTapTime = options.longTapTime || 200;
      swipeMinLength = options.swipeMinLength || 30;

      if (binding.arg == 'tap') {
        var isTap = false;
        el.addEventListener('touchstart',function(evt){
          if (!isTap) {
            isTap = true;
            window.setTimeout(function() { isTap = false;},longTapTime-10);
          }
        });
        el.addEventListener('touchend',function(evt){
          if (isTap) {
            isTap = false;
            binding.value(evt);
          }
        });

        el.addEventListener('mousedown',function(evt){
          if (!isTap) {
            isTap = true;
            window.setTimeout(function() { isTap = false;},longTapTime-10);
          }
        });
        el.addEventListener('mouseup',function(evt){
          if (isTap) {
            isTap = false;
            binding.value(evt);
          }
        });
      }

      if (binding.arg == 'double-tap') {
        var isDoubleTap = false;
        el.addEventListener('touchstart',function(evt){
          if (!isDoubleTap) {
            isDoubleTap = true;
            window.setTimeout(function() { isDoubleTap = false;},doubleTapTime);
          } else {
            isDoubleTap = false;
            binding.value(evt);
          }
        });

        el.addEventListener('mousedown',function(evt){
          if (!isDoubleTap) {
            isDoubleTap = true;
            window.setTimeout(function() { isDoubleTap = false;},doubleTapTime);
          } else {
            isDoubleTap = false;
            binding.value(evt);
          }
        });
      }

      if (binding.arg == 'long-tap') {
        var isLongTap = false;
        el.addEventListener('touchstart',function(evt){
          if (!isLongTap) {
              window.setTimeout(function() { isLongTap = true;},longTapTime);
          }
        });
        el.addEventListener('touchmove',function(evt){
          if (isLongTap) {
            isLongTap = false;
          }
        });
        el.addEventListener('touchleave',function(evt){
          if (isLongTap) {
            isLongTap = false;
          }
        });
        el.addEventListener('touchend',function(evt){
          if (isLongTap) {
            isLongTap = false;
            binding.value(evt);
          }
        });



        el.addEventListener('mousedown',function(evt){
          if (!isLongTap) {
              window.setTimeout(function() { isLongTap = true;},longTapTime);
          }
        });
        el.addEventListener('mousemove',function(evt){
          if (isLongTap) {
            isLongTap = false;
          }
        });
        el.addEventListener('mouseout',function(evt){
          if (isLongTap) {
            isLongTap = false;
          }
        });
        el.addEventListener('mouseup',function(evt){
          if (isLongTap) {
            isLongTap = false;
            binding.value(evt);
          }
        });
      }


      // To handle touch move

      var currentX = 0;
      var currentY = 0;

      var press = false;

      if (binding.arg == 'pressMove') {

        el.addEventListener('touchstart',function(evt){
          press = true;
          currentX = evt.changedTouches[0].pageX;
          currentY = evt.changedTouches[0].pageY;
          binding.value.start(evt);
        });
        el.addEventListener('mousedown',function(evt){
          press = true;
          binding.value.start(evt);
        });

        el.addEventListener('touchmove',function(evt){
          if (press) {
            evt.movementX = evt.changedTouches[0].pageX - currentX;
            evt.movementY = evt.changedTouches[0].pageY - currentY;

            currentX = evt.changedTouches[0].pageX;
            currentY = evt.changedTouches[0].pageY;

            binding.value.move(evt);
          }

        });
        el.addEventListener('mousemove',function(evt){
          if (press) {
            binding.value.move(evt);
          }

        });

        el.addEventListener('touchend',function(evt){
          press = false;
          binding.value.end(evt);
        });
        el.addEventListener('mouseup',function(evt){
          press = false;
          binding.value.end(evt);
        });

        el.addEventListener('touchleave',function(evt){
          press = false;
          binding.value.leave(evt);
        });
        el.addEventListener('mouseout',function(evt){
          press = false;
          binding.value.leave(evt);
        });
      }

      if (binding.arg == 'swipe') {
        el.addEventListener('touchstart',function(evt){
          press = true;
          currentX = evt.changedTouches[0].pageX;
          currentY = evt.changedTouches[0].pageY;
        });
        el.addEventListener('mousedown',function(evt){
          currentX = evt.pageX;
          currentY = evt.pageY;
          press = true;
        });

        function getDir(dX,dY){
          var top = 'T';
          var bottom = 'B';
          var left  = 'L';
          var right = 'R';

          var r = '';

          if (dX > swipeMinLength) {
            r+=right;
          } else if (dX < -swipeMinLength) {
            r+=left;
          }

          if (dY > swipeMinLength) {
            r+=bottom;
          } else if (dY < -swipeMinLength) {
            r+=top;
          }

          return r;
        }

        el.addEventListener('touchend',function(evt){
          if (press) {
            press = false;
            evt.movementX = evt.changedTouches[0].pageX - currentX;
            evt.movementY = evt.changedTouches[0].pageY - currentY;
            evt.direction = getDir(evt.movementX,evt.movementY);

            if(evt.direction != undefined && evt.direction != '' && evt.direction.length != 0){binding.value(evt);}
          }
        });
        el.addEventListener('mouseup',function(evt){
          if (press) {
            press = false;
            e = {};
            e.movementX = evt.pageX - currentX;
            e.movementY = evt.pageY - currentY;
            e.direction = getDir(e.movementX,e.movementY);

            if(e.direction != undefined && e.direction != '' && e.direction.length != 0){binding.value(e);}
          }
        });

        el.addEventListener('touchleave',function(evt){
          if (press) {
            press = false;
            evt.movementX = evt.changedTouches[0].pageX - currentX;
            evt.movementY = evt.changedTouches[0].pageY - currentY;
            evt.direction = getDir(evt.movementX,evt.movementY);

            if(evt.direction != undefined && evt.direction != '' && evt.direction.length != 0){binding.value(evt);}
          }

        });
        el.addEventListener('mouseout',function(evt){
          if (press) {
            press = false;
            e = {};
            e.movementX = evt.pageX - currentX;
            e.movementY = evt.pageY - currentY;
            e.direction = getDir(e.movementX,e.movementY);

            if(e.direction != undefined && e.direction != '' && e.direction.length != 0){binding.value(e);}
          }

        });
      }
    }
  });
}
