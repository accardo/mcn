import Vue from 'vue';
import Vuex from 'vuex';

import styleflage from './modules/styleflage';
import getters    from './getters';


Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
      styleflage
    },
    getters
  })
  
  export default store