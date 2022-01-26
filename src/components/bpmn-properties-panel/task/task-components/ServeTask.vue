<template>
  <div>
    <a-form-model
      size="small"
      :model="listenerForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="listenerFormRef"
      @submit.native.prevent>
      <a-form-model-item label="监听器类型" prop="listenerType" :rules="{ required: true, message: '请选择监听器类型', trigger: ['blur', 'change'] }">
        <a-select v-model="listenerForm.listenerType">
          <a-select-option v-for="i in Object.keys(serveTaskType)" :key="i" :value="i">{{ serveTaskType[i] }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        v-if="listenerForm.listenerType === 'classListener'"
        label="Java类"
        prop="class"
        key="listener-class"
        :rules="{ required: true, message: '请输入Java类', trigger: ['blur', 'change'] }"
      >
        <a-input v-model="listenerForm.class" allow-clear @change="updateProperty('class')" />
      </a-form-model-item>
      <a-form-model-item
        v-if="listenerForm.listenerType === 'expressionListener'"
        label="表达式"
        prop="expression"
        key="listener-expression"
        :rules="{ required: true, message: '请输入表达式', trigger: ['blur', 'change'] }"
      >
        <a-input v-model="listenerForm.expression" allow-clear @change="updateProperty('expression')" />
      </a-form-model-item>
      <a-form-model-item
        v-if="listenerForm.listenerType === 'delegateExpressionListener'"
        label="代理表达式"
        prop="delegateExpression"
        key="listener-delegate"
        :rules="{ required: true, message: '请输入代理表达式', trigger: ['blur', 'change'] }"
      >
        <a-input v-model="listenerForm.delegateExpression" allow-clear @change="updateProperty('delegateExpression')" />
      </a-form-model-item>
    </a-form-model>
    <a-divider />
    <p class="listener-filed__title listener-filed__title-span-width-auto">
      <span><a-icon type="appstore" theme="filled" />注入字段</span>
      <a-button size="small" type="primary" @click="openListenerFieldForm(null)">添加字段</a-button>
    </p>
    <h-table
      :data-source="fieldsListOfListener"
      size="small"
      :scroll="{ y: 240 }"
      bordered
      style="flex: none"
      :columns="fieldsListOfListenerColumns"
    >
      <span slot="action" slot-scope="text, record, index">
        <a @click="openListenerFieldForm(record, index)">编辑</a>
        <a-divider type="vertical" />
        <a style="color: #ff4d4f" @click="removeListenerField(record, index)">移除</a>
      </span>
    </h-table>

    <!-- 注入字段 编辑/创建 部分 -->
    <a-modal title="字段配置" :visible="listenerFieldFormModelVisible" width="600px" destroy-on-close @cancel="listenerFieldFormModelVisible = false">
      <a-form-model
        :model="listenerFieldForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        ref="listenerFieldFormRef"
        style="min-height: 136px"
        @submit.native.prevent>
        <a-form-model-item label="字段名称" prop="name" :rules="{ required: true, message: '请输入字段名称', trigger: ['blur', 'change'] }">
          <a-input v-model="listenerFieldForm.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="字段类型" prop="fieldType" :rules="{ required: true, message: '请输入字段类型', trigger: ['blur', 'change'] }">
          <a-select v-model="listenerFieldForm.fieldType">
            <a-select-option v-for="i in Object.keys(fieldTypeObject)" :key="i" :value="i">{{ fieldTypeObject[i] }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-if="listenerFieldForm.fieldType === 'string'"
          label="字段值"
          prop="string"
          key="field-string"
          :rules="{ required: true, message: '请输入字段值', trigger: ['blur', 'change'] }"
        >
          <a-input v-model="listenerFieldForm.string" allow-clear />
        </a-form-model-item>
        <a-form-model-item
          v-if="listenerFieldForm.fieldType === 'expression'"
          label="表达式"
          prop="expression"
          key="field-expression"
          :rules="{ required: true, message: '请输入表达式', trigger: ['blur', 'change'] }"
        >
          <a-input v-model="listenerFieldForm.expression" allow-clear />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="listenerFieldFormModelVisible = false">取 消</a-button>
        <a-button type="primary" @click="saveListenerFiled">确 定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { serveTaskType, fieldType } from '../../listeners/utilSelf';
import { createListenerObject, updateElementExtensions } from '@/components/bpmn/utils';
const fieldsListOfListenerColumns = [
  {
    title: '序号',
    type: 'index',
    dataIndex: 'index',
    key: 'index',
    width: '50px',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '字段名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '字段类型',
    dataIndex: 'fieldType',
    key: 'fieldType',
    ellipsis: true,
    showOverflowTooltip: true,
    customRender: (text) => { return fieldType[text]; },
    scopedSlots: { customRender: 'fieldType' }
  },
  {
    title: '字段值/表达式',
    dataIndex: 'expression',
    key: 'expression',
    ellipsis: true,
    showOverflowTooltip: true,
    customRender: (text, row) => { return row.string || row.expression; },
    scopedSlots: { customRender: 'expression' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '100px',
    scopedSlots: { customRender: 'action' }
  }
];

export default {
  name: 'ServeTask',
  props: {
    id: String
  },
  components: {},
  inject: {
    prefix: 'prefix',
    width: 'width'
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.$nextTick(() => this.resetListenersList());
      }
    },
    'listenerForm.listenerType': {
      handler(val) {
        this.$set(this.listenerForm, 'class', null);
        this.updateProperty('class');
        this.$set(this.listenerForm, 'expression', null);
        this.updateProperty('expression');
        this.$set(this.listenerForm, 'delegateExpression', null);
        this.updateProperty('delegateExpression');
      }
    }
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      serveTaskType,
      fieldType,
      fieldsListOfListenerColumns,
      listenerForm: {}, // 监听器详情表单
      fieldsListOfListener: [],
      listenerFieldFormModelVisible: false, // 监听器 注入字段表单弹窗 显示状态
      listenerFieldForm: {}, // 监听器 注入字段 详情表单
      fieldTypeObject: fieldType
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    resetListenersList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.otherExtensionList = [];
      this.bpmnElementListeners =
        this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type === `${this.prefix}:Field`) ?? [];
      this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type !== `${this.prefix}:Field`) ?? [];
      this.fieldsListOfListener = this.bpmnElementListeners.map(item => {
        return {
          ...item,
          fieldType: item.string ? 'string' : 'expression'
        };
      });
    },
    openListenerFieldForm(field, index) {
      this.listenerFieldForm = field ? JSON.parse(JSON.stringify(field)) : {};
      this.editingListenerFieldIndex = field ? index : -1;
      this.listenerFieldFormModelVisible = true;
      this.$nextTick(() => {
        if (this.$refs['listenerFieldFormRef']) this.$refs['listenerFieldFormRef'].clearValidate();
      });
    },
    // 移除监听器字段
    removeListenerField(field, index) {
      this.$confirm({
        title: '提示',
        content: '确认移除该字段吗？',
        okText: '确定',
        okType: 'warning',
        cancelText: '取消',
        onOk: () => {
          this.fieldsListOfListener.splice(index, 1);
          this.bpmnElementListeners.splice(index, 1);
          this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type !== `${this.prefix}:Field`) ?? [];
          const extensions = window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
            values: [ ...this.bpmnElementListeners, ...this.otherExtensionList ]
          });
          window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
            extensionElements: extensions
          });
        },
        onCancel: () => {
          console.info('操作取消');
        }
      });
    },
    // 保存监听器注入字段
    async saveListenerFiled() {
      const validateStatus = await this.$refs['listenerFieldFormRef'].validate();
      if (!validateStatus) return; // 验证不通过直接返回
      if (this.editingListenerFieldIndex === -1) {
        this.fieldsListOfListener.push(this.listenerFieldForm);
        this.bpmnElementListeners =
          this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type === `${this.prefix}:Field`) ?? [];
        this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type !== `${this.prefix}:Field`) ?? [];
        const otherList = [ ...this.bpmnElementListeners, ...this.otherExtensionList ];
        this.updateFiled(otherList);
      } else {
        this.fieldsListOfListener.splice(this.editingListenerFieldIndex, 1, this.listenerFieldForm);
        this.bpmnElementListeners.splice(this.editingListenerFieldIndex, 1);
        this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type !== `${this.prefix}:Field`) ?? [];
        const otherList = [ ...this.bpmnElementListeners, ...this.otherExtensionList ];
        this.updateFiled(otherList);
      }
      this.listenerFieldFormModelVisible = false;
      this.$nextTick(() => (this.listenerFieldForm = {}));
    },
    // 保存监听器配置
    async saveListenerConfig() {
      const validateStatus = await this.$refs['listenerFormRef'].validate();
      if (!validateStatus) return; // 验证不通过直接返回
      const listenerObject = createListenerObject(this.listenerForm, false, this.prefix);
      if (this.editingListenerIndex === -1) {
        this.bpmnElementListeners.push(listenerObject);
        this.elementListenersList.push(this.listenerForm);
      } else {
        this.bpmnElementListeners.splice(this.editingListenerIndex, 1, listenerObject);
        this.elementListenersList.splice(this.editingListenerIndex, 1, this.listenerForm);
      }
      // 保存其他配置
      this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type !== `${this.prefix}:ExecutionListener`) ?? [];
      updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(this.bpmnElementListeners));
      // 4. 隐藏侧边栏
      this.listenerForm = {};
    },
    updateProperty(key) {
      const attrObj = Object.create(null);
      attrObj[key] = this.listenerForm[key];
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj);
    },
    updateFiled(otherList) {
      const { name, fieldType, string, expression } = this.listenerFieldForm;
      const fieldConfig = fieldType === 'string' ? { name, string } : { name, expression };
      const newAdd = window.bpmnInstances.moddle.create(`${this.prefix}:Field`, fieldConfig);
      updateElementExtensions(this.bpmnElement, otherList.concat([newAdd]));
      this.resetListenersList();
    }
  }
};
</script>

<style scoped>

</style>
