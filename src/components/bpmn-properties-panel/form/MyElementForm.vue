<template>
  <div class="panel-tab__content">
<!--    <a-form-model size="small" :label-col="labelCol" :wrapper-col="wrapperCol" @submit.native.prevent>
      <a-form-model-item label="表单标识">
        <a-input v-model="formKey" allowClear @change="updateElementFormKey" />
      </a-form-model-item>
      <a-form-model-item label="业务标识">
        <a-select v-model="businessKey" @change="updateElementBusinessKey">
          <a-select-option v-for="i in fieldList" :key="i.id" :value="i.id">{{ i.label }}</a-select-option>
          <a-select-option value="null">无</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>-->

    <!--字段列表-->
    <div class="element-property list-property">
      <a-divider><a-icon type="profile" /> 表单</a-divider>
      <h-table
        :data-source="taskFormList"
        size="small"
        bordered
        rowKey="id"
        :scroll="{ y: 240 }"
        :columns="taskFormColumns"
      >
        <span slot="action" slot-scope="text, record, index">
          <a @click="openFieldForm(record, index)">字段权限</a>
          <a-divider type="vertical" />
          <a style="color: #ff4d4f" @click="removeForm(record, index)">移除</a>
        </span>
      </h-table>
    </div>
    <div class="element-drawer__button">
      <a-button type="primary" icon="plus" @click="openFormDialog()" block>添加表单</a-button>
    </div>
    <a-modal :visible="formListDialogVisible" title="表单库" width="600px" :maskClosable="false" destroy-on-close @cancel="formListDialogVisible = false">
      <a-form-model layout="inline" :model="searchForm" class="demo-form-inline" style="margin-bottom: 15px">
        <a-form-model-item>
          <a-input v-model="searchForm.name" placeholder="表单名称"></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-select v-model="searchForm.type" style="width: 180px" placeholder="表单类别">
            <a-select-option value="默认类别">默认类别</a-select-option>
            <a-select-option value="新增类别">新增类别</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="onSubmit">查询</a-button>
        </a-form-model-item>
      </a-form-model>
      <h-table
        :data-source="formList"
        size="small"
        ref="formListTable"
        bordered
        rowKey="id"
        :columns="formColumns"
        :scroll="{ y: 240 }"
        :rowSelection="{ selectedRowKeys: selectFormIds, selectedRows: selectForms, onChange: handleSelectionChange }"
      >
      </h-table>
      <template slot="footer">
        <a-button @click="formListDialogVisible = false">取 消</a-button>
        <a-button type="primary" @click="bindForm()">绑定表单</a-button>
      </template>
    </a-modal>
    <a-modal :visible="fieldDialogVisible" title="字段权限设置" width="600px" destroy-on-close @cancel="fieldDialogVisible = false">
      <h-table
        :data-source="fieldList"
        size="small"
        ref="fieldListTable"
        :scroll="{ y: 240 }"
        rowKey="name"
        :columns="fieldColumns"
        bordered
      >
        <template slot="isDisabled" slot-scope="text, record">
          <h-switch v-model="record.isDisabled" />
        </template>
        <template slot="isShow" slot-scope="text, record">
          <h-switch v-model="record.isShow" />
        </template>
      </h-table>
      <template slot="footer">
        <a-button  @click="fieldDialogVisible = false">取 消</a-button>
        <a-button  type="primary" @click="saveFields()">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
const taskFormColumns = [
  {
    title: '序号',
    type: 'index',
    dataIndex: 'index',
    key: 'index',
    width: '50px',
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '表单名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    showOverflowTooltip: true,
    minWidth: '80px',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' },
  }
]
const formColumns = [
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
    title: '分类',
    dataIndex: 'type',
    key: 'type',
    ellipsis: true,
    showOverflowTooltip: true,
    minWidth: '100px',
    scopedSlots: { customRender: 'type' },
  }
]
const fieldColumns = [
  {
    title: '字段名',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '注释',
    dataIndex: 'comment',
    key: 'comment',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'comment' },
  },
  {
    title: '启用',
    dataIndex: 'isDisabled',
    key: 'isDisabled',
    scopedSlots: { customRender: 'isDisabled' },
  },
  {
    title: '显示',
    dataIndex: 'isShow',
    key: 'isShow',
    scopedSlots: { customRender: 'isShow' },
  }
]
export default {
  name: "ElementForm",
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
      taskFormColumns,
      formColumns,
      fieldColumns,
      searchForm:{},
      formKey: "",
      businessKey: "",
      optionModelTitle: "",
      fieldList: [
        {name:'id',comment:"id",isDisabled:1,isShow:1},
        {name:'NAME',comment:"名称",isDisabled:1,isShow:1},
        {name:'DEPARTMENT',comment:"部门",isDisabled:1,isShow:1},
        {name:'PHONE',comment:"电话",isDisabled:1,isShow:1},
        {name:'ADDRESS',comment:"地址",isDisabled:1,isShow:1},
        {name:'COMMNET',comment:"备注",isDisabled:1,isShow:1}
      ],
      formList:[
        {id:"123",name:"测试表单1",type:"默认分类"},
        {id:"1234",name:"测试表单2",type:"默认分类"},
        {id:"12345",name:"测试表单3",type:"默认分类"}
      ],
      taskFormList:[],
      formFieldForm: {},
      selectForms:[],
      selectFormIds:[],
      fieldType: {
        long: "长整型",
        string: "字符串",
        boolean: "布尔类",
        date: "日期类",
        enum: "枚举类",
        custom: "自定义类型"
      },
      formFieldIndex: -1, // 编辑中的字段， -1 为新增
      formFieldOptionIndex: -1, // 编辑中的字段配置项， -1 为新增
      fieldModelVisible: false,
      formListDialogVisible:false,
      fieldOptionModelVisible: false,
      fieldDialogVisible: false,
      fieldOptionForm: {}, // 当前激活的字段配置项数据
      fieldOptionType: "", // 当前激活的字段配置项弹窗 类型
      fieldEnumList: [], // 枚举值列表
      fieldConstraintsList: [], // 约束条件列表
      fieldPropertiesList: [] // 绑定属性列表
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.$nextTick(() => this.resetFormList());
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('查询表单');
    },
    resetFormList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.otherExtensions = []; // 其他扩展配置
      this.bpmnElementForms =
        this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => {
          if (ex.$type !== `${this.prefix}:Forms`) {
            this.otherExtensions.push(ex);
          }
          return ex.$type === `${this.prefix}:Forms`;
        }) ?? []; 
      // 保存所有的 扩展属性字段
      this.bpmnElementFormList = this.bpmnElementForms.reduce((pre, current) => pre.concat(current.values), []); 
      // 复制 显示
     // this.elementPropertyList = JSON.parse(JSON.stringify(this.bpmnElementPropertyList ?? []));
      this.taskFormList = this.bpmnElementFormList.map(current => Object.assign({"isDefault":current.$attrs.isDefault},current)); 
    },
    // resetFormList() {
    //   this.bpmnELement = window.bpmnInstances.bpmnElement;
    //   this.formKey = this.bpmnELement.businessObject.formKey;
    //   // 获取元素扩展属性 或者 创建扩展属性
    //   this.elExtensionElements =
    //     this.bpmnELement.businessObject.get("extensionElements") || window.bpmnInstances.moddle.create("bpmn:ExtensionElements", { values: [] });
    //   // 获取元素表单配置 或者 创建新的表单配置
    //   this.formData =
    //     this.elExtensionElements.values.filter(ex => ex.$type === `${this.prefix}:Forms`)?.[0] ||
    //     window.bpmnInstances.moddle.create(`${this.prefix}:Forms`, { fields: [] });

    //   // 业务标识 businessKey， 绑定在 formData 中
    //   this.businessKey = this.formData.businessKey;

    //   // 保留剩余扩展元素，便于后面更新该元素对应属性
    //   this.otherExtensions = this.elExtensionElements.values.filter(ex => ex.$type !== `${this.prefix}:FormData`);

    //   // 复制原始值，填充表格
    //   this.fieldList = JSON.parse(JSON.stringify(this.formData.fields || []));

    //   // 更新元素扩展属性，避免后续报错
    //   this.updateElementExtensions();
    // },
    openFormDialog(){
        this.formListDialogVisible = true;
    },
    updateElementFormKey() {
      window.bpmnInstances.modeling.updateProperties(this.bpmnELement, { formKey: this.formKey });
    },
    updateElementBusinessKey() {
      window.bpmnInstances.modeling.updateModdleProperties(this.bpmnELement, this.formData, { businessKey: this.businessKey });
    },
    // 根据类型调整字段type
    changeFieldTypeType(type) {
      this.$set(this.formFieldForm, "type", type === "custom" ? "" : type);
    },
    bindForm(){
      let newSelect = [];
      this.selectForms.forEach(item => {
        let exit = this.taskFormList.findIndex(exitItem => exitItem.id === item.id)  > -1
        if (!exit) {
          newSelect.push(item)
        }
      })
      this.taskFormList = this.taskFormList.concat(newSelect);
      let newFormsObjects = [];
      newSelect.forEach(f => {
      //   f.values = [];
      //   this.fieldList.forEach(o => {
      // f.values.push(window.bpmnInstances.moddle.create(`${this.prefix}:Field`, o));
      // });
      newFormsObjects.push(window.bpmnInstances.moddle.create(`${this.prefix}:Form`, f));
      });
      // 新建一个属性字段的保存列表
      const formsObject = window.bpmnInstances.moddle.create(`${this.prefix}:Forms`, {
        values: this.bpmnElementFormList.concat(newFormsObjects)
      });
      console.log("formsObject", formsObject);
      this.updateElementExtensions(formsObject);
        this.formListDialogVisible = false;
        this.resetFormList();
    },
    removeForm(attr, index) {
      this.$confirm({
        title: '提示',
        content: '确认删除该表单吗？',
        okText: '确定',
        okType: 'warning',
        cancelText: '取消',
        onOk: () => {
          this.taskFormList.splice(index, 1);
          this.bpmnElementFormList.splice(index, 1);
          // 新建一个属性字段的保存列表
          const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:Forms`, {
            values: this.bpmnElementFormList
          });
          this.updateElementExtensions(propertiesObject);
          this.resetFormList();
        }
      });
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectForms = selectedRows;
      this.selectFormIds = selectedRowKeys;
    },
    // 打开字段详情侧边栏
    // openFieldForm(field, index) {
    //   this.formFieldIndex = index;
    //   if (index !== -1) {
    //     const FieldObject = this.formData.fields[index];
    //     this.formFieldForm = JSON.parse(JSON.stringify(field));
    //     // 设置自定义类型
    //     this.$set(this.formFieldForm, "typeType", !this.fieldType[field.type] ? "custom" : field.type);
    //     // 初始化枚举值列表
    //     field.type === "enum" && (this.fieldEnumList = JSON.parse(JSON.stringify(FieldObject?.values || [])));
    //     // 初始化约束条件列表
    //     this.fieldConstraintsList = JSON.parse(JSON.stringify(FieldObject?.validation?.constraints || []));
    //     // 初始化自定义属性列表
    //     this.fieldPropertiesList = JSON.parse(JSON.stringify(FieldObject?.properties?.values || []));
    //   } else {
    //     this.formFieldForm = {};
    //     // 初始化枚举值列表
    //     this.fieldEnumList = [];
    //     // 初始化约束条件列表
    //     this.fieldConstraintsList = [];
    //     // 初始化自定义属性列表
    //     this.fieldPropertiesList = [];
    //   }
    //   this.fieldModelVisible = true;
    // },

    openFieldForm(field, index) {
      this.formFieldIndex = index;
      // if (index !== -1) {
      //   const FieldObject = this.formData.fields[index];
      //   this.formFieldForm = JSON.parse(JSON.stringify(field));
      //   // 设置自定义类型
      //   this.$set(this.formFieldForm, "typeType", !this.fieldType[field.type] ? "custom" : field.type);
      //   // 初始化枚举值列表
      //   field.type === "enum" && (this.fieldEnumList = JSON.parse(JSON.stringify(FieldObject?.values || [])));
      //   // 初始化约束条件列表
      //   this.fieldConstraintsList = JSON.parse(JSON.stringify(FieldObject?.validation?.constraints || []));
      //   // 初始化自定义属性列表
      //   this.fieldPropertiesList = JSON.parse(JSON.stringify(FieldObject?.properties?.values || []));
      // } else {
      //   this.formFieldForm = {}; 
      // }
      this.fieldDialogVisible = true;
    },
    // 打开字段 某个 配置项 弹窗
    openFieldOptionForm(option, index, type) {
      this.fieldOptionModelVisible = true;
      this.fieldOptionType = type;
      this.formFieldOptionIndex = index;
      if (type === "property") {
        this.fieldOptionForm = option ? JSON.parse(JSON.stringify(option)) : {};
        return (this.optionModelTitle = "属性配置");
      }
      if (type === "enum") {
        this.fieldOptionForm = option ? JSON.parse(JSON.stringify(option)) : {};
        return (this.optionModelTitle = "枚举值配置");
      }
      this.fieldOptionForm = option ? JSON.parse(JSON.stringify(option)) : {};
      return (this.optionModelTitle = "约束条件配置");
    },

    // 保存字段 某个 配置项
    saveFieldOption() {
      if (this.formFieldOptionIndex === -1) {
        if (this.fieldOptionType === "property") {
          this.fieldPropertiesList.push(this.fieldOptionForm);
        }
        if (this.fieldOptionType === "constraint") {
          this.fieldConstraintsList.push(this.fieldOptionForm);
        }
        if (this.fieldOptionType === "enum") {
          this.fieldEnumList.push(this.fieldOptionForm);
        }
      } else {
        this.fieldOptionType === "property" && this.fieldPropertiesList.splice(this.formFieldOptionIndex, 1, this.fieldOptionForm);
        this.fieldOptionType === "constraint" && this.fieldConstraintsList.splice(this.formFieldOptionIndex, 1, this.fieldOptionForm);
        this.fieldOptionType === "enum" && this.fieldEnumList.splice(this.formFieldOptionIndex, 1, this.fieldOptionForm);
      }
      this.fieldOptionModelVisible = false;
      this.fieldOptionForm = {};
    },
    // 保存字段配置
    saveField() {
      const { id, type, label, defaultValue, datePattern } = this.formFieldForm;
      const Field = window.bpmnInstances.moddle.create(`${this.prefix}:FormField`, { id, type, label });
      defaultValue && (Field.defaultValue = defaultValue);
      datePattern && (Field.datePattern = datePattern);
      // 构建属性
      if (this.fieldPropertiesList && this.fieldPropertiesList.length) {
        const fieldPropertyList = this.fieldPropertiesList.map(fp => {
          return window.bpmnInstances.moddle.create(`${this.prefix}:Property`, { id: fp.id, value: fp.value });
        });
        Field.properties = window.bpmnInstances.moddle.create(`${this.prefix}:Properties`, { values: fieldPropertyList });
      }
      // 构建校验规则
      if (this.fieldConstraintsList && this.fieldConstraintsList.length) {
        const fieldConstraintList = this.fieldConstraintsList.map(fc => {
          return window.bpmnInstances.moddle.create(`${this.prefix}:Constraint`, { name: fc.name, config: fc.config });
        });
        Field.validation = window.bpmnInstances.moddle.create(`${this.prefix}:Validation`, { constraints: fieldConstraintList });
      }
      // 构建枚举值
      if (this.fieldEnumList && this.fieldEnumList.length) {
        Field.values = this.fieldEnumList.map(fe => {
          return window.bpmnInstances.moddle.create(`${this.prefix}:Value`, { name: fe.name, id: fe.id });
        });
      }
      // 更新数组 与 表单配置实例
      if (this.formFieldIndex === -1) {
        this.fieldList.push(this.formFieldForm);
        this.formData.fields.push(Field);
      } else {
        this.fieldList.splice(this.formFieldIndex, 1, this.formFieldForm);
        this.formData.fields.splice(this.formFieldIndex, 1, Field);
      }
      this.updateElementExtensions();
      this.fieldModelVisible = false;
    },

  // 保存字段配置
    saveFields() {
      let newFieldsObjects = [];
        this.fieldList.forEach(f => {
        newFieldsObjects.push(window.bpmnInstances.moddle.create(`${this.prefix}:FormField`, f));
        }); 
    //  this.bpmnElementForms[0].values[this.formFieldIndex].values=newFieldsObjects;

    //     console.log("this.bpmnElementForms", this.bpmnElementForms,this.formFieldIndex);
    //   this.updateElementExtensions(this.bpmnElementForms);
    this.bpmnElementFormList[this.formFieldIndex].values = newFieldsObjects;
    const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:Forms`, {
        values: this.bpmnElementFormList
      });
    this.updateElementExtensions(propertiesObject);          

    this.fieldDialogVisible = false;
     // this.resetFormList();
    },
    // 移除某个 字段的 配置项
    removeFieldOptionItem(option, index, type) {
      if (type === "property") {
        this.fieldPropertiesList.splice(index, 1);
        return;
      }
      if (type === "enum") {
        this.fieldEnumList.splice(index, 1);
        return;
      }
      this.fieldConstraintsList.splice(index, 1);
    },
    // 移除 字段
    removeField(field, index) {
      this.fieldList.splice(index, 1);
      this.formData.fields.splice(index, 1);
      this.updateElementExtensions();
    },
    updateElementExtensions(properties) {
      const extensions = window.bpmnInstances.moddle.create("bpmn:ExtensionElements", {
        values: this.otherExtensions.concat([properties])
      });
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        extensionElements: extensions
      });
    }
    // updateElementExtensions() {
    //   // 更新回扩展元素
    //   const newElExtensionElements = window.bpmnInstances.moddle.create(`bpmn:ExtensionElements`, {
    //     values: this.otherExtensions.concat(this.formData)
    //   });
    //   // 更新到元素上
    //   window.bpmnInstances.modeling.updateProperties(this.bpmnELement, {
    //     extensionElements: newElExtensionElements
    //   });
    // }
  }
};
</script>
