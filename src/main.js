/*
 * @Author: your name
 * @Date: 2021-12-16 10:06:11
 * @LastEditTime: 2021-12-16 16:31:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \bpmn-antdesign-vue\src\main.js
 */
import Vue from 'vue'
import App from './App.vue' 
import axios from "axios";
import VueBus from 'vue-bus';
Vue.prototype.$axios = axios;
import MyPD from "./components/bpmn-designer-vue/index.js";
Vue.use(MyPD);
import MyPP from "./components/bpmn-properties-panel/index.js";
Vue.use(MyPP);
import "./components/bpmn-designer-vue/theme/process-designer.scss";
import "./components/bpmn-designer-vue/theme/process-panel.scss";

import { vuePlugin } from "@/highlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
Vue.use(vuePlugin);
Vue.use(VueBus);

import { HTable, HSwitch } from './components/HComponents/index'


import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
// 引入Ant Design Vue组件
import Antd from 'ant-design-vue'
// 引入Ant Design Vue样式
import 'ant-design-vue/dist/antd.css' 
//挂载到vue中
Vue.use(Antd) 
Vue.config.productionTip = false
Vue.component('h-table', HTable)
Vue.component('h-switch', HSwitch)

new Vue({
  render: h => h(App),
}).$mount('#app')
