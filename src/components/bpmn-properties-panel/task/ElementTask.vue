<!--
 * @Author: your name
 * @Date: 2021-11-18 13:35:33
 * @LastEditTime: 2021-11-24 15:34:24
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \bpmn-process-designer-main\package\refactor\task\ElementTask.vue
-->
<template>
  <div class="panel-tab__content">
<!--      <a-form-model-item label="异步延续" :modal="taskConfigForm">
        <a-checkbox v-model="taskConfigForm.asyncBefore" @change="changeTaskAsync">异步前</a-checkbox>
        <a-checkbox v-model="taskConfigForm.asyncAfter" @change="changeTaskAsync">异步后</a-checkbox>
        <a-checkbox v-model="taskConfigForm.exclusive" v-if="taskConfigForm.asyncAfter || taskConfigForm.asyncBefore" @change="changeTaskAsync">排除</a-checkbox>
      </a-form-model-item>-->
      <component :is="witchTaskComponent" v-bind="$props" />
  </div>
</template>

<script>
import UserTask from "./task-components/UserTaskRouter";
import ScriptTask from "./task-components/ScriptTask";
import ReceiveTask from "./task-components/ReceiveTask";

export default {
  name: "ElementTaskConfig",
  components: { UserTask, ScriptTask, ReceiveTask },
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      /*taskConfigForm: {
        asyncAfter: false,
        asyncBefore: false,
        exclusive: false
      },*/
      witchTaskComponent: "",
      installedComponent: {
        // 手工任务与普通任务一致，不需要其他配置
        // 接收消息任务，需要在全局下插入新的消息实例，并在该节点下的 messageRef 属性绑定该实例
        // 发送任务、服务任务、业务规则任务共用一个相同配置
        UserTask: "UserTask", // 用户任务配置
        ScriptTask: "ScriptTask", // 脚本任务配置
        ReceiveTask: "ReceiveTask" // 消息接收任务
      }
    };
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.bpmnElement = window.bpmnInstances.bpmnElement;
        this.taskConfigForm.asyncBefore = this.bpmnElement?.businessObject?.asyncBefore;
        this.taskConfigForm.asyncAfter = this.bpmnElement?.businessObject?.asyncAfter;
        this.taskConfigForm.exclusive = this.bpmnElement?.businessObject?.exclusive;
      }
    },
    type: {
      immediate: true,
      handler() {
        this.witchTaskComponent = this.installedComponent[this.type];
      }
    }
  },
  methods: {
    changeTaskAsync() {
      if (!this.taskConfigForm.asyncBefore && !this.taskConfigForm.asyncAfter) {
        this.taskConfigForm.exclusive = false;
      }
      window.bpmnInstances.modeling.updateProperties(window.bpmnInstances.bpmnElement, {
        ...this.taskConfigForm
      });
    }
  }
};
</script>
