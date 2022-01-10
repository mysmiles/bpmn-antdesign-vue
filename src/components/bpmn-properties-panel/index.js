import MyPropertiesPanel from "./PropertiesPanel.vue";
const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};
const components = [MyPropertiesPanel];
MyPropertiesPanel.install = function(Vue) {
  Vue.component(MyPropertiesPanel.name, MyPropertiesPanel);
};

export default {
  install,
  ...components
};
