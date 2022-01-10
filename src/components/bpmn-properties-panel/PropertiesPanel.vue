<template>
  <div class="process-panel__container" :style="{ width: `${this.width}px` }">
    <div class="panel-tab__title"><a-icon type="info-circle" theme="filled" />{{elementType}}</div>
    <a-collapse v-model="activeTab" :bordered="false" expand-icon-position="right">
      <a-collapse-panel name="base" key="base">
        <div slot="header" class="panel-tab__title"><a-icon type="info-circle" theme="filled" />常规</div>
        <element-base-info ref="element_base_info" :id-edit-disabled="idEditDisabled" :business-object="elementBusinessObject" :type="elementType" />
      </a-collapse-panel>
<!--      <a-collapse-panel name="condition" v-if="elementType === 'Process'" key="condition">
        <div slot="header" class="panel-tab__title"><a-icon type="message" theme="filled" />消息与信号</div>
        <signal-and-massage />
      </a-collapse-panel>-->
      <a-collapse-panel name="subProcessTask" v-if="elementType === 'SubProcess' " key="subProcessTask">
        <div slot="header" class="panel-tab__title"><a-icon type="check-circle" theme="filled" />子流程任务</div>
        <sub-process-task />
      </a-collapse-panel>
      <a-collapse-panel name="subProcessVariable" v-if="elementType === 'SubProcess' " key="subProcessVariable">
        <div slot="header" class="panel-tab__title"><a-icon type="compass" />子流程变量</div>
        <sub-process-variable :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel name="condition" v-if="conditionFormVisible" key="condition">
        <div slot="header" class="panel-tab__title"><a-icon type="interaction" theme="filled" />流转条件</div>
        <flow-condition :business-object="elementBusinessObject" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel name="condition" v-if="formVisible" key="condition">
        <div slot="header" class="panel-tab__title"><a-icon type="file-text" theme="filled" />表单</div>
        <element-form :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel name="task" v-if="elementType.indexOf('Task') !== -1 && elementType !== 'ServiceTask'" key="task">
        <div slot="header" class="panel-tab__title"><a-icon type="schedule" theme="filled" />任务/参与者</div>
        <element-task :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel name="multiInstance" v-if="elementType.indexOf('Task') !== -1" key="multiInstance">
        <div slot="header" class="panel-tab__title"><a-icon type="radar-chart" />多实例</div>
        <element-multi-instance :business-object="elementBusinessObject" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel name="audit" v-if="elementType === 'UserTask'"  key="audit">
        <div slot="header" class="panel-tab__title"><a-icon type="check-circle" theme="filled" />审核菜单</div>
        <flow-action :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel name="listeners" key="listeners">
        <div slot="header" class="panel-tab__title"><a-icon type="bell" theme="filled" />执行监听器</div>
        <element-listeners :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel name="taskListeners" v-if="elementType === 'UserTask'" key="taskListeners">
        <div slot="header" class="panel-tab__title"><a-icon type="bell" theme="filled" />任务监听器</div>
        <user-task-listeners :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel name="extensions" key="extensions">
        <div slot="header" class="panel-tab__title"><a-icon type="plus-circle" theme="filled" />扩展属性</div>
        <element-properties :id="elementId" :type="elementType" />
      </a-collapse-panel>
      <a-collapse-panel name="other" key="other">
        <div slot="header" class="panel-tab__title"><a-icon type="ellipsis" />其他</div>
        <element-other-config :id="elementId" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
import ElementBaseInfo from "./base/ElementBaseInfo";
import ElementOtherConfig from "./other/ElementOtherConfig";
import ElementTask from "./task/ElementTask";
import ElementMultiInstance from "./multi-instance/ElementMultiInstance";
import FlowCondition from "./flow-condition/FlowCondition";
import FlowAction from "./flow-action/FlowAction";
// import SignalAndMassage from "./signal-message/SignalAndMessage";
import ElementListeners from "./listeners/MyElementListeners";
import ElementProperties from "./properties/ElementProperties";
import ElementForm from "./form/MyElementForm";
import UserTaskListeners from "./listeners/UserTaskListeners";
import SubProcessTask from './sub-process-task/SubProcessTask';
import SubProcessVariable from './sub-process-variable/SubProcessVariable';
/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
export default {
  name: "MyPropertiesPanel",
  components: {
    UserTaskListeners,
    ElementForm,
    ElementProperties,
    ElementListeners,
    // SignalAndMassage,
    FlowCondition,
    FlowAction,
    ElementMultiInstance,
    ElementTask,
    ElementOtherConfig,
    ElementBaseInfo,
    SubProcessTask,
    SubProcessVariable
  },
  componentName: "MyPropertiesPanel",
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: "camunda"
    },
    width: {
      type: Number,
      default: 480
    },
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      prefix: this.prefix,
      width: this.width
    };
  },
  data() {
    return {
      activeTab: "base",
      elementId: "",
      elementType: "",
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
      conditionFormVisible: false, // 流转条件设置
      formVisible: false // 表单配置
    };
  },
  watch: {
    elementId: {
      handler() {
        this.activeTab = "base";
      }
    }
  },
  created() {
    this.initModels();
  },
  methods: {
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10);
        return;
      }
      if (this.timer) clearTimeout(this.timer);
      window.bpmnInstances = {
        modeler: this.bpmnModeler,
        modeling: this.bpmnModeler.get("modeling"),
        moddle: this.bpmnModeler.get("moddle"),
        eventBus: this.bpmnModeler.get("eventBus"),
        bpmnFactory: this.bpmnModeler.get("bpmnFactory"),
        elementRegistry: this.bpmnModeler.get("elementRegistry"),
        replace: this.bpmnModeler.get("replace"),
        selection: this.bpmnModeler.get("selection")
      };
      this.getActiveElement();
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      this.initFormOnChanged(null);
      this.bpmnModeler.on("import.done", () => {
        this.initFormOnChanged(null);
      });
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on("selection.changed", ({ newSelection }) => {
        this.initFormOnChanged(newSelection[0] || null);
      });
      this.bpmnModeler.on("element.changed", ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.elementId) {
          this.initFormOnChanged(element);
        }
      });
    },
    // 初始化数据
    initFormOnChanged(element) {
      let activatedElement = element;
      if (!activatedElement) {
        activatedElement =
          window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Process") ??
          window.bpmnInstances.elementRegistry.find(el => el.type === "bpmn:Collaboration");
      }
      if (!activatedElement) return;
      console.log(`
              ----------
      select element changed:
                id:  ${activatedElement.id}
              type:  ${activatedElement.businessObject.$type}
              ----------
              `);
      console.log("businessObject: ", activatedElement.businessObject);
      window.bpmnInstances.bpmnElement = activatedElement;
      this.bpmnElement = activatedElement;
      this.elementId = activatedElement.id;
      this.elementType = activatedElement.type.split(":")[1] || "";
      this.elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject));
      this.conditionFormVisible = !!(
        this.elementType === "SequenceFlow" &&
        activatedElement.source &&
        activatedElement.source.type.indexOf("StartEvent") === -1
      );
      this.formVisible = this.elementType === "UserTask" || this.elementType === "StartEvent";
    },
    beforeDestroy() {
      window.bpmnInstances = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.ant-collapse-borderless {
  background: #fff;
}
</style>
