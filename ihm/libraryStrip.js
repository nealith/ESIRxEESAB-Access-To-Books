var library_scroll_active = true;

function move_separator() {
  var posX = parseFloat($("#libraryStrip").css("left"));
  var separatorW = parseFloat($("#libraryStrip").css("width"));
  $("#libraryShutter").css({
    "left": posX+separatorW,
    "width": frame.w-posX-separatorW,
  });
  $("#montageShutter").css({
    "width": posX
  });
}

function align_libraries_on_active_page() {
  $(".library_container").each(function() {
    var $activePage = $(this).children(".library_page[active]");
    var widthActivePage = $activePage.width();
    var widthLibrary = $(this).parent().width();

    library_scroll_active = false; // Prevent separator moving from triggering scroll event on libraries

    $(this).scrollTo($activePage, 300, {
      offset: -(widthLibrary/2)+(widthActivePage/2),
      onAfter: function() {
        setTimeout(function() {
          library_scroll_active = true;
        }, 350); // Wait until animation ends to activate scroll detection
      }
    });
  });
}

libraryStrip = new Vue({
  el: '#libraryStrip',
  data:{
    books:books
  },
  methods:{
    start:function(e){
    },
    end:function(e){
      align_libraries_on_active_page();
    },
    move:function(e){
      move_separator();
    }
  }
});

$("#libraryStrip").draggable({
  containment: "parent",
  axis: "x",
  snap: "#global_container",
  snapTolerance: 20,
  start: libraryStrip.start,
  drag: libraryStrip.move,
  stop: libraryStrip.end
});
