<template>
  <div class="panel-tab__content">
    <h-table
      :data-source="elementPropertyList"
      size="small"
      rowKey="id"
      :columns="elementPropertyColumns"
      :scroll="{ x: 400, y: 240 }"
      bordered
    >
      <span slot="actions" slot-scope="text, record, index">
        <a @click="openAttributesForm(record, index)">编辑</a>
        <a-divider type="vertical" />
        <a style="color: #ff4d4f" @click="removeAttributes(record, index)">移除</a>
      </span>
    </h-table>
    <div class="element-drawer__button">
      <a-button type="primary" icon="plus" @click="openAttributesForm(null, -1)">添加审核菜单</a-button>
    </div>

    <a-modal :visible="propertyFormModelVisible" title="审核菜单配置" width="600px" destroy-on-close @cancel="propertyFormModelVisible = false">
      <a-form-model :model="propertyForm" :label-col="labelCol" :wrapper-col="wrapperCol" size="mini" ref="attributeFormRef" @submit.native.prevent>
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="propertyForm.name" allowClear />
        </a-form-model-item>
        <a-form-model-item label="菜单值" prop="value">
          <a-input v-model="propertyForm.value" allowClear />
        </a-form-model-item> 
        <a-form-model-item label="默认" prop="isDefault">
          <h-switch v-model="propertyForm.isDefault" />
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
    dataIndex: 'index',
    key: 'index',
    type: 'index',
    width: '50px',
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    showOverflowTooltip: true,
    minWidth: '100px',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '变量值',
    dataIndex: 'value',
    key: 'value',
    ellipsis: true,
    showOverflowTooltip: true,
    minWidth: '100px',
    scopedSlots: { customRender: 'value' },
  },
  {
    title: '是否默认值',
    dataIndex: 'isDefault',
    key: 'isDefault',
    minWidth: '90px',
    scopedSlots: { customRender: 'isDefault' },
    customRender: (item) => {
      return item ? '是' : '否'
    }
  },
  {
    title: '操作',
    dataIndex: 'actions',
    key: 'actions',
    width: '90px',
    scopedSlots: { customRender: 'actions' },
  }
]
export default {
  name: "AuditMenu",
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
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      elementPropertyList: [],
      propertyForm: {
        name: '',
        value: '',
        isDefault: 0
      },
      editingPropertyIndex: -1,
      propertyFormModelVisible: false,
      elementPropertyColumns
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
          if (ex.$type !== `${this.prefix}:FlowActions`) {
            this.otherExtensionList.push(ex);
          }
          return ex.$type === `${this.prefix}:FlowActions`;
        }) ?? [];
    console.log("bpmnElementProperties", this.bpmnElementProperties);
      // 保存所有的 扩展属性字段
      this.bpmnElementPropertyList = this.bpmnElementProperties.reduce((pre, current) => pre.concat(current.values), []);
    console.log("bpmnElementPropertyList", this.bpmnElementPropertyList);
      // 复制 显示
     // this.elementPropertyList = JSON.parse(JSON.stringify(this.bpmnElementPropertyList ?? []));
      this.elementPropertyList = this.bpmnElementPropertyList.map(current => Object.assign({"isDefault":current.$attrs.isDefault},current));
      console.log("elementPropertyList", this.elementPropertyList);
    },
    openAttributesForm(attr, index) {
      this.editingPropertyIndex = index;
      this.propertyForm = index === -1 ? this.$options.data.call(this).propertyForm : JSON.parse(JSON.stringify(attr));
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
          const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:FlowActions`, {
            values: this.bpmnElementPropertyList
          });
          this.updateElementExtensions(propertiesObject);
          this.resetAttributesList();
        },
        onCancel: () => {
          console.info("操作取消")
        }
      });
    },
    saveAttribute() {
      // 新建属性字段
      if (this.editingPropertyIndex > -1) {
        // 先删除
        this.elementPropertyList.splice(this.editingPropertyIndex, 1)
        this.bpmnElementPropertyList.splice(this.editingPropertyIndex, 1);
        const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:FlowActions`, {
          values: this.bpmnElementPropertyList
        });
        this.updateElementExtensions(propertiesObject);
        this.resetAttributesList();
      }
      const newPropertyObject = window.bpmnInstances.moddle.create(`${this.prefix}:FlowAction`, this.propertyForm);
        console.log("newPropertyObject", newPropertyObject);
      // 新建一个属性字段的保存列表
      const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:FlowActions`, {
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
