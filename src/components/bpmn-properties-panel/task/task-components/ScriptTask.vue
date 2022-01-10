<template>
  <div>
    <a-form-model size="small" :model="scriptTaskForm" :label-col="labelCol" :wrapper-col="wrapperCol" @submit.native.prevent>
      <a-form-model-item label="脚本格式">
        <a-input v-model="scriptTaskForm.scriptFormat" allowClear @input="updateElementTask()" @change="updateElementTask()" />
      </a-form-model-item>
      <a-form-model-item label="脚本类型">
        <a-select v-model="scriptTaskForm.scriptType">
          <a-select-option value="inline">内联脚本</a-select-option>
          <a-select-option value="external">外部资源</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="脚本" v-show="scriptTaskForm.scriptType === 'inline'">
        <a-textarea
            v-model="scriptTaskForm.script"
            resize="vertical"
            :autosize="{ minRows: 2, maxRows: 4 }"
            allowClear
            @input="updateElementTask()"
            @change="updateElementTask()"
        />
      </a-form-model-item>
      <a-form-model-item label="资源地址" v-show="scriptTaskForm.scriptType === 'external'">
        <a-input v-model="scriptTaskForm.resource" allowClear @input="updateElementTask()" @change="updateElementTask()" />
      </a-form-model-item>
      <a-form-model-item label="结果变量">
        <a-input v-model="scriptTaskForm.resultVariable" allowClear @input="updateElementTask()" @change="updateElementTask()" />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: "ScriptTask",
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      defaultTaskForm: {
        scriptFormat: "",
        script: "",
        resource: "",
        resultVariable: ""
      },
      scriptTaskForm: {}
    };
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.bpmnElement = window.bpmnInstances.bpmnElement;
        this.$nextTick(() => this.resetTaskForm());
      }
    }
  },
  methods: {
    resetTaskForm() {
      for (let key in this.defaultTaskForm) {
        let value = this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key];
        this.$set(this.scriptTaskForm, key, value);
      }
      this.$set(this.scriptTaskForm, "scriptType", this.scriptTaskForm.script ? "inline" : "external");
    },
    updateElementTask() {
      let taskAttr = Object.create(null);
      taskAttr.scriptFormat = this.scriptTaskForm.scriptFormat || null;
      taskAttr.resultVariable = this.scriptTaskForm.resultVariable || null;
      if (this.scriptTaskForm.scriptType === "inline") {
        taskAttr.script = this.scriptTaskForm.script || null;
        taskAttr.resource = null;
      } else {
        taskAttr.resource = this.scriptTaskForm.resource || null;
        taskAttr.script = null;
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr);
    }
  },
  beforeDestroy() {
    this.bpmnElement = null;
  }
};
</script>
