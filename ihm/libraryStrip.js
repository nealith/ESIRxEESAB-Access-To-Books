var library_scroll_active = true;

libraryStrip = new Vue({
  el: '#libraryStrip',
  data:{
    books:books
  },
  methods:{
    move:function(e){
      let rectStrip = rect(byId('libraryStrip'))
      let rectContainer = rect(byClass('global_container')[0]);

      byId('montageShutter').setAttribute('style','width:'+(rectStrip.left-rectContainer.left)+'px;');
      byId('libraryShutter').setAttribute('style','width:'+(frame.w-rectStrip.left-rectStrip.width)+'px;');

    },
    end:function(e){
      els = Array.from(byId('libraryShutter').querySelectorAll('div.slides-container'));
      for (var i = 0; i < els.length; i++) {
        console.log(els[i]);
        els[i].dispatchEvent(new TransitionEvent('transitionend',{}));
      }
    }
  }
});
