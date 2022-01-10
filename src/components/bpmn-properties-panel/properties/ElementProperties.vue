<template>
  <div class="panel-tab__content">
    <h-table
      :data-source="elementPropertyList"
      size="small"
      :scroll="{ y: 240 }"
      bordered
      :columns="elementPropertyColumns"
    >
      <span slot="action" slot-scope="text, record, index">
        <a @click="openAttributesForm(record, index)">编辑</a>
        <a-divider type="vertical" />
        <a style="color: #ff4d4f" @click="removeAttributes(record, index)">移除</a>
      </span>
    </h-table>
    <div class="element-drawer__button">
      <a-button type="primary" icon="plus" @click="openAttributesForm(null, -1)">添加属性</a-button>
    </div>

    <a-modal :visible="propertyFormModelVisible" title="属性配置" width="600px" destroy-on-close @cancel="propertyFormModelVisible = false">
      <a-form-model :model="propertyForm" :label-col="labelCol" :wrapper-col="wrapperCol" size="mini" ref="attributeFormRef" @submit.native.prevent>
        <a-form-model-item label="属性名" prop="name">
          <a-input v-model="propertyForm.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="属性值" prop="value">
          <a-textarea v-model="propertyForm.value" allow-clear />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="propertyFormModelVisible = false">取 消</a-button>
        <a-button type="primary" @click="saveAttribute">确 定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
const elementPropertyColumns = [
  {
    title: '序号',
    type: 'index',
    dataIndex: 'index',
    key: 'index',
    width: '50px',
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '属性名',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '属性值',
    dataIndex: 'value',
    key: 'value',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'value' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '100px',
    scopedSlots: { customRender: 'action' },
  }
]

export default {
  name: "ElementProperties",
  props: {
    id: String,
    type: String
  },
  inject: {
    prefix: "prefix",
    width: "width"
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      elementPropertyColumns,
      elementPropertyList: [],
      propertyForm: {},
      editingPropertyIndex: -1,
      propertyFormModelVisible: false
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.resetAttributesList();
      }
    }
  },
  methods: {
    resetAttributesList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.otherExtensionList = []; // 其他扩展配置
      this.bpmnElementProperties =
        this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => {
          if (ex.$type !== `${this.prefix}:Properties`) {
            this.otherExtensionList.push(ex);
          }
          return ex.$type === `${this.prefix}:Properties`;
        }) ?? [];

      // 保存所有的 扩展属性字段
      this.bpmnElementPropertyList = this.bpmnElementProperties.reduce((pre, current) => pre.concat(current.values), []);
      // 复制 显示
      this.elementPropertyList = JSON.parse(JSON.stringify(this.bpmnElementPropertyList ?? []));
    },
    openAttributesForm(attr, index) {
      this.editingPropertyIndex = index;
      this.propertyForm = index === -1 ? {} : JSON.parse(JSON.stringify(attr));
      this.propertyFormModelVisible = true;
      this.$nextTick(() => {
        if (this.$refs["attributeFormRef"]) this.$refs["attributeFormRef"].clearValidate();
      });
    },
    removeAttributes(attr, index) {
      this.$confirm({
        title: '提示',
        content: '确认移除该属性吗？',
        okText: '确定',
        okType: 'warning',
        cancelText: '取消',
        onOk: () => {
          this.elementPropertyList.splice(index, 1);
          this.bpmnElementPropertyList.splice(index, 1);
          // 新建一个属性字段的保存列表
          const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:Properties`, {
            values: this.bpmnElementPropertyList
          });
          this.updateElementExtensions(propertiesObject);
          this.resetAttributesList();
        },
        onCancel: () => {
          console.info("操作取消")
        }
      })
    },
    saveAttribute() {
      // 新建属性字段
      const newPropertyObject = window.bpmnInstances.moddle.create(`${this.prefix}:Property`, this.propertyForm);
      // 新建一个属性字段的保存列表
      const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:Properties`, {
        values: this.bpmnElementPropertyList.concat([newPropertyObject])
      });

      this.updateElementExtensions(propertiesObject);
      this.propertyFormModelVisible = false;
      this.resetAttributesList();
    },
    updateElementExtensions(properties) {
      const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
        values: this.otherExtensionList.concat([properties])
      });
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        extensionElements: extensions
      });
    }
  }
};
</script>
