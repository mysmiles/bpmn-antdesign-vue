/*
 * @Author: your name
 * @Date: 2021-12-16 13:40:20
 * @LastEditTime: 2021-12-16 14:46:19
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \bpmn-antdesign-vue\src\components\bpmn-designer-vue\index.js
 */
import BpmnDesignerVue from "./BpmnDesignerVue.vue";
const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};
const components = [BpmnDesignerVue];
BpmnDesignerVue.install = function(Vue) {
  Vue.component(BpmnDesignerVue.name, BpmnDesignerVue);
};

export default {
  version: "0.0.1",
  install,
  ...components
};
