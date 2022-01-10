<template>
  <div>
    <div class="element-property list-property">
      <a-divider><a-icon type="login" /> In Mapping</a-divider>
      <h-table
        :data-source="variableInFormList"
        size="small"
        bordered
        rowKey="id"
        :scroll="{ y: 240 }"
        :columns="variableFormColumns"
      >
        <span slot="action" slot-scope="text, record, index">
          <a @click="openVariableFormModal('in', record, index)">编辑</a>
          <a-divider type="vertical" />
          <a style="color: #ff4d4f" @click="removeVariable('in', record, index)">移除</a>
        </span>
      </h-table>
      <div class="element-drawer__button">
        <a-button type="primary" icon="plus" @click="openVariableFormModal('in')" block>添加变量</a-button>
      </div>
      <a-divider><a-icon type="logout" /> Out Mapping</a-divider>
      <h-table
          :data-source="variableOutFormList"
          size="small"
          bordered
          rowKey="id"
          :scroll="{ y: 240 }"
          :columns="variableFormColumns"
      >
        <span slot="action" slot-scope="text, record, index">
          <a @click="openVariableFormModal('out', record, index)">编辑</a>
          <a-divider type="vertical" />
          <a style="color: #ff4d4f" @click="removeVariable('out', record, index)">移除</a>
        </span>
      </h-table>
      <div class="element-drawer__button">
        <a-button type="primary" icon="plus" @click="openVariableFormModal('out')" block>添加变量</a-button>
      </div>
    </div>
    <a-modal
      :visible="variableFormModalVisible"
      title="新增变量"
      width="600px"
      :maskClosable="false"
      destroy-on-close
      @cancel="variableFormModalVisible = false"
      @ok="addVariable()"
    >
      <a-form-model :model="variableForm" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="类型">
          <a-select v-model="variableForm.type" placeholder="类型">
            <a-select-option value="Source">Source</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Source">
          <a-input v-model="variableForm.source" />
        </a-form-model-item>
        <a-form-model-item label="Target">
          <a-input v-model="variableForm.target" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>

</template>

<script>
import { initListenerType } from '@/components/bpmn-properties-panel/listeners/utilSelf';

const variableFormColumns = [
  {
    title: '序号',
    type: 'index',
    dataIndex: 'index',
    key: 'index',
    width: '50px',
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'type' },
  },
  {
    title: '来源',
    dataIndex: 'source',
    key: 'source',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'source' },
  },
  {
    title: '目标',
    dataIndex: 'target',
    key: 'target',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'target' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '90px',
    scopedSlots: { customRender: 'action' },
  }
]
export default {
  name: 'SubProcessVariable',
  inject: {
    prefix: "prefix",
    width: "width"
  },
  props: {
    id: String,
    type: String
  },
  components: {},
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.$nextTick(() => this.resetList());
      }
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      variableInFormList: [],
      variableOutFormList: [],
      variableFormColumns,
      variableFormModalVisible: false,
      variableForm: {
        type: 'Source',
        source: '',
        target: ''
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    resetList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.otherExtensionList = [];
      this.bpmnElementListeners =
          this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type === `${this.prefix}:in`) ?? [];
      this.variableInFormList = this.bpmnElementListeners.map(listener => initListenerType(listener));
    },
    openVariableFormModal(type, row, index) {
      this.variableForm = this.$options.data.call(this).variableForm;
      this.variableFormModalVisible = true;
      this.$set(this.variableForm, '$variableType', type);
      this.$set(this.variableForm, '$index', index);
      this.variableForm = { ...this.variableForm, ...row }
    },
    removeVariable(type, row, index) {
      this.$confirm({
        title: '提示',
        content: '确认移除该变量吗？',
        okText: '确定',
        okType: 'warning',
        cancelText: '取消',
        onOk: () => {
          if (type === 'in') {
            this.variableInFormList.splice(index, 1);
          } else {
            this.variableOutFormList.splice(index, 1);
          }
          // this.createFieldObject()
          // updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(this.bpmnElementListeners));
        },
        onCancel: () => {
          console.info("操作取消")
        }
      })
    },
    addVariable() {
      if (this.variableForm.$variableType === 'in') {
        this.dealInVariable()
      } else {
        this.dealOutVariable()
      }
      this.variableFormModalVisible = false;
    },
    dealInVariable() {
      let changeItem = {
        type: this.variableForm.type,
        source: this.variableForm.source,
        target: this.variableForm.target
      }
      if (this.variableForm.$index > -1) {
        this.variableInFormList.splice(this.variableForm.$index, 1, changeItem);
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, changeItem);
        return;
      }
      this.variableInFormList.push(changeItem)
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, changeItem);
    },
    dealOutVariable() {
      let changeItem = {
        type: this.variableForm.type,
        source: this.variableForm.source,
        target: this.variableForm.target
      }
      if (this.variableForm.$index > -1) {
        this.variableOutFormList.splice(this.variableForm.$index, 1, changeItem);
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, changeItem);
        return;
      }
      this.variableOutFormList.push(changeItem)
      // window.bpmnInstances.modeling.updateProperties(this.bpmnElement, changeItem);
      this.createFieldObject(changeItem, 'Out')
    },
    createFieldObject(option, type) {
      const { source, target } = option;
      return window.bpmnInstances.moddle.create(`${this.prefix}:${type}`, { source, target });
    }
  }
}
</script>

<style scoped>

</style>
