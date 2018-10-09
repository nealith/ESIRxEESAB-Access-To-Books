alert = new Vue({
  el: '#alert',
  data:{
    active:false,
    succes:false,
    error:false,
    warning:false,
    msg:''
  },
  methods:{
    alert:function(arg){
      throwError = false;
      try {
        this.msg = arg.msg;
        this.active = true;
        this.error = (arg.error == true);
        this.warning = (arg.warning == true);
        this.succes = (arg.succes == true);
      } catch (e) {
        throwError = true;
        console.error(e);
      } finally {
        if (throwError) {
          this.active = false;
          this.error = false;
          this.succes = false;
          this.warning = false;
        }
      }
    },
    hide:function(){
      this.msg = '';
      this.active = false;
      this.error = false;
      this.succes = false;
      this.warning = false;
    }
  }
});
