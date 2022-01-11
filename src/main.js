/*
 * @Author: your name
 * @Date: 2021-12-16 10:06:11
 * @LastEditTime: 2021-12-16 16:31:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \bpmn-antdesign-vue\src\main.js
 */
// 外部引用 顺序: js css
import Vue from 'vue'
import Antd from 'ant-design-vue'
import axios from "axios";
import VueBus from 'vue-bus';

import 'ant-design-vue/dist/antd.css'
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";

// 内部引用 顺序: js css
import App from './App.vue'
import { VueAxios } from './utils/request';
import MyPD from "./components/bpmn-designer-vue/index.js";
import MyPP from "./components/bpmn-properties-panel/index.js";
import { HTable, HSwitch } from './components/HComponents/index'
import { vuePlugin } from "@/highlight";
import * as api from './api/api'

import "./components/bpmn-designer-vue/theme/process-designer.scss";
import "./components/bpmn-designer-vue/theme/process-panel.scss";
import "highlight.js/styles/atom-one-dark-reasonable.css";


Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.component('h-table', HTable)
Vue.component('h-switch', HSwitch)
Vue.use(MyPD);
Vue.use(MyPP);


Vue.use(vuePlugin);
Vue.use(VueBus);

Vue.use(Antd)
Vue.use(VueAxios);

new Vue({
  render: h => h(App),
}).$mount('#app')
