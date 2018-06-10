// NEED vue-simple-gesture.js

// if not done : don't forget Vue.use(VueSimpleGesture);

// List of CSS class

// vue-dialogue-form
// vue-dialogue-final
//  vue-dialogue-form-send
//  vue-dialogue-form-cancel

// vue-dialogue-group
//  vue-dialogue-input [valid,invalid,email,password]
//  vue-dialogue-textarea
//  vue-dialogue-radio-area
//    vue-dialogue-radio
//    vue-dialogue-radio-label
//  vue-dialogue-checkbox-area
//    vue-dialogue-checkbox
//    vue-dialogue-checkbox-label

VueDialogue = {}

VueDialogue.install = function(Vue,options){

  Vue.component('dialogue-input',{
    data:function(){
      return {
        value:'',
        ph:'',
        valid:false
      }
    },
    mounted:function(){
      this.ph = this.placeholder || '';
    },
    updated:function(){
      this.ph = this.placeholder || '';
      this.check();
    },
    props:{
      'type':String,
      'ckecking-function':Function,
      'placeholder':String
    },
    methods:{
      check:function(){
        if (this.checkingFunction != undefined) {
          this.valid = this.checkingFunction(this.value);
          if (this.valid) {
            this.$emit('input', this.value);
          } else {
            this.$emit('input', null);
          }
        } else {
          this.$emit('input', this.value);
        }
      }
    },
    template:`
      <input  class="vue-dialogue-input"
              :valid="valid"
              :invalid="!valid"
              :password="type == 'password'"
              :email="type == 'email'"
              type="type"
              v-model="value"
              :placeholder="ph">
    `
  });

  Vue.component('dialogue-textarea',{
    data:function(){
      return {
        value:'',
        ph:''
      }
    },
    mounted:function(){
      this.ph = this.placeholder || '';
    },
    updated:function(){
      this.ph = this.placeholder || '';
      this.check();
    },
    props:{
      'type':String,
      'ckecking-function':Function,
      'placeholder':String
    },
    methods:{
      check:function(){
        if (this.checkingFunction != undefined) {
          this.valid = this.checkingFunction(this.value);
          if (this.valid) {
            this.$emit('input', this.value);
          } else {
            this.$emit('input', null);
          }
        } else {
          this.$emit('input', this.value);
        }
      }
    },
    template:`
      <textarea class="vue-dialogue-textarea" v-model="value" :placeholder="ph"></textarea>
    `
  });

  Vue.component('dialogue-checkbox',{
    data:function(){
      return {
        value:[],
      }
    },
    props:{
      'entries':Array,
    },
    updated:function(){
      this.$emit('input', this.value);
    },
    methods:{
    },
    template:`
      <div class="vue-dialogue-checkbox-area">
        <template v-for="entry in entries">
          <input class="vue-dialogue-checkbox" :value="entry.value" :id="entry.id" type="checkbox" v-model="value">
          <label class="vue-dialogue-checkbox-label" :for="entry.id">{{entry.value}}</label>
        </template>
      </div>
    `
  });

  Vue.component('dialogue-radio',{
    data:function(){
      return {
        value:'',
      }
    },
    props:{
      'entries':Array,
    },
    updated:function(){
      this.$emit('input', this.value);
    },
    methods:{
    },
    template:`
      <div class="vue-dialogue-radio-area">
        <template v-for="entry in entries">
          <input class="vue-dialogue-radio" :value="entry.value" :id="entry.id" type="radio" v-model="value">
          <label class="vue-dialogue-radio-label" :for="entry.id">{{entry.value}}</label>
        </template>
      </div>
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
      tap:function(){
        if (this.info.tap != undefined) {
          this.info.tap({info:this.info,el:document.getElementById(this.info.id),vueel:this});
        }
      },
      onInput:function(evt){
        this.$emit('input', {id:this.info.id,value:evt});
      }
    },
    template:`
      <div :id="info.id" v-simple-gesture:tap="tap" v-bind:class="{'vue-dialogue-group': info.type == 'group'}">
        <dialogue-input v-on:input="onInput" v-if="(info.type == 'text' || info.type == 'password' || info.type == 'email')" :type="info.type" :ckecking-function="info.checkingFunction" :placeholder="info.placeholder"></dialogue-input>
        <dialogue-textarea v-on:input="onInput" v-if="info.type == 'textarea'" :type="info.type" :ckecking-function="info.checkingFunction" :placeholder="info.placeholder"></dialogue-textarea>
        <dialogue-checkbox v-on:input="onInput" v-if="info.type == 'checkbox'" :entries="info.entries"></dialogue-checkbox>
        <dialogue-radio v-on:input="onInput" v-if="info.type == 'radio'" :entries="info.entries"></dialogue-radio>
        <dialogue-entry v-on:input="onInput" v-if="info.type == 'group'" v-for="entry in info.entries" v-bind:key="entry.info.id" :info="entry.info"></dialogue-entry>
      </div>
    `
  });

  Vue.component('dialogue',{
    data:function(){
      return {
        formData:{}
      }
    },
    props:{
      entries:Array,
      'send-text':String,
      'cancel-text':String,
      'send-pressed':Boolean,
      'cancel-pressed':Boolean
    },
    updated:function(){
      console.log(this.sendPressed);
      if (this.sendPressed == true) {
        this.$emit('send',this.formData);
      } else if(this.cancelPressed == true){
        this.$emit('cancel',null);
      }
    },
    methods:{
      onInput:function(evt){
        this.formData[evt.id] = evt.value;
      }
    },
    template:`
      <div class="vue-dialogue-form">
        <div class="vue-dialogue-inputs">
          <dialogue-entry
            v-for="info in entries"
            v-bind:key="info.id"
            v-bind:info="info"
            v-on:input="onInput"
            >
          </dialogue-entry>
        </div>
        <div class="vue-dialogue-final">
          <button   class="vue-dialogue-form-send"
                    type="submit"
                    v-simple-gesture:tap="function(){$emit('send',formData)}">
                    {{sendText}}
          </button>
          <button   class="vue-dialogue-form-cancel"
                    type="submit"
                    v-simple-gesture:tap="function(){$emit('cancel',null)}">
                    {{cancelText}}
          </button>
        </div>
      </div>
    `
  });


}
