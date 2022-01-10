<!--
 * @Author: your name
 * @Date: 2021-12-16 10:06:11
 * @LastEditTime: 2021-12-16 15:44:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \bpmn-antdesign-vue\src\App.vue
-->
<template>
  <a-config-provider :locale="zh_CN">
    <Bpmn ref="bpmn" />
  </a-config-provider>
</template>

<script>
import Bpmn from './components/Bpmn.vue'
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
export default {
  name: 'App',
  components: {
    Bpmn
  },
  data() {
    return {
      zh_CN
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
