VueDialogue = {}

VueDialogue.install = function(Vue,options){

  Vue.component('dialogue-input',{
    data:function(){
      return {

      }
    },
    props:{
      'type':String,
      'ckecking-function':Function
    },
    methods:{
      check:function(){
        if (this.checkingFunction != undefined) {
          this.checkingFunction
        }
      }
    },
    template:`
      <div v-if="type == ''"
      <input type="type"

    `


  });

  Vue.component('dialogue-entry',{
    data:function(){
      return {

      }
    },
    props:{
      'info':Object
    },
    methods:{
    },
    template:`
      <div v-if="(info.type == 'text' || info.type == 'password' || info.type == 'email')">
        <v-dialogue-input :info="info"><v-dialogue-input :info="info">
      </div>
    `
  });

  Vue.component('dialogue',{
    data:function(){
      return {

      }
    },
    props:{
      accept:Function,
      cancel:Function
    },
    methods:{

    },
    template:``



  });


}
