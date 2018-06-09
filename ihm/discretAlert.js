discretAlert = new Vue({
  el: '#discretAlert',
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


        this.error = false;
        this.succes = false;
        this.warning = false;
        this.error = (arg.error == true);
        this.warning = (arg.warning == true);
        this.succes = (arg.succes == true);

        this.active = true;

        if (this.succes || this.warning) {
          window.setTimeout(function(){
            discretAlert.hide();
          },12000);
        }

      } catch (e) {
        throwError = true;
        console.error(e);
      } finally {
        if (throwError) {
          this.active = false;
        }
      }
    },
    hide:function(){
      this.msg = '';
      this.active = false;
    }
  }
});
