montageStrip = new Vue({
  el: '#montageStrip',
  data:{
    montages:montages
  },
  methods:{
    showDescription:function(e){
      for (var i = 0; i < this.montages.length; i++) {
        if (this.montages[i].name == e.data.name) {
          alert.alert({msg:this.montages[i].description});
          break;
        }
      }
    }
  }
});
