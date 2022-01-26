<template>
  <div class="panel-tab__content">
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
          <a-input v-model="searchForm.searchName" placeholder="表单名称"></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-select v-model="searchForm.searchType" style="width: 180px" placeholder="表单类别" allow-clear>
            <a-select-option v-for="c in categoryList" :value="c.code" :key="c.id">{{ c.description }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="onSubmit(true)">查询</a-button>
        </a-form-model-item>
      </a-form-model>
      <h-table
        :data-source="formList.content"
        size="small"
        ref="formListTable"
        bordered
        rowKey="id"
        :columns="formColumns"
        :scroll="{ y: 240 }"
        :rowSelection="{ selectedRowKeys: selectFormIds, selectedRows: selectForms, onChange: handleSelectionChange }"
        :pagination="{
          current: searchForm.pageNumber + 1,
          pageSize: searchForm.pageSize,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          total: formList.totalElements,
          onChange: (pageNumber, pageSize) => {
            Object.assign(this.searchForm, { pageNumber: pageNumber - 1, pageSize })
            this.onSubmit()
          }
        }"
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
        rowKey="id"
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
    dataIndex: 'type.name',
    key: 'type.name',
    ellipsis: true,
    showOverflowTooltip: true,
    minWidth: '100px',
    scopedSlots: { customRender: 'type.name' },
  }
]
const fieldColumns = [
  {
    title: '字段名',
    dataIndex: 'filed',
    key: 'filed',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '注释',
    dataIndex: 'filedNote',
    key: 'filedNote',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'filedNote' },
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
Object.freeze(taskFormColumns)
Object.freeze(formColumns)
Object.freeze(fieldColumns)

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
      searchForm:{
        pageNumber: 0,
        pageSize: 20
      },
      formKey: "",
      businessKey: "",
      optionModelTitle: "",
      fieldList: [],
      formList: {
        content: [],
        totalElements: 0
      },
      taskFormList:[],
      formFieldForm: {},
      selectForms:[],
      selectFormIds:[],
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
      fieldPropertiesList: [], // 绑定属性列表
      categoryList: []
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
  mounted() {
    this.loadFormCategory()
  },
  methods: {
    loadFormCategory() {
      this.$api.listDictionaries({ pageNumber: 0, pageSize: 100, searchType: 'FORM-TYPE' }).then(resp => {
        this.categoryList = resp.data.content || []
      })
    },
    onSubmit(isFirst) {
      if (isFirst) {
        this.searchForm.pageNumber = this.$options.data.call(this).searchForm.pageNumber
      }
      this.$api.listFormDefinition({ ...this.searchForm }).then(resp => {
        this.formList = resp.data
      }).catch(e => {
        this.$message.error(e.response.message || '查询失败');
      }).finally()
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
      this.taskFormList = JSON.parse(JSON.stringify(this.bpmnElementFormList));
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
        this.selectFormIds = this.taskFormList.map(item => item.id)
        this.searchForm = this.$options.data.call(this).searchForm
        this.onSubmit()
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
        newFormsObjects.push(window.bpmnInstances.moddle.create(`${this.prefix}:Form`, { id: f.id, name: f.name }));
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
    openFieldForm(field, index) {
      this.formFieldIndex = index;
      this.fieldDialogVisible = true;
      this.$api.loadFormDefinitionById({ id: field.id }).then(resp => {
        const parseJson = JSON.parse(resp.data.json);
        const newArray = [];
        function childrenFilter(obj) {
          if (obj == null || '') {
            return;
          }
          Object.keys(obj).forEach(key => {
            if (key === 'dataId') {
              newArray.push({
                filed: `${obj[key]}`,
                isDisabled: 0,
                isShow: 0,
                formId: field.id,
                filedNote: `${obj.label}`
              });
            }
            if (typeof (obj[key]) === 'object') {
              childrenFilter(obj[key]);
            }
          });
        }
        childrenFilter(parseJson);
        this.fieldList = newArray;
        if (field.formDefJson) {
          this.selectCheckFiled(field.formDefJson);
        }
      }).catch(e => {
        this.$message.error(e.response.data.message || '查询失败');
      }).finally(() => {
        this.filedPermissionSpinning = false;
      })
    },
    /**
     * @method 读取返回的数据的字段选中的并且标上
     * @desc 解释说明
     * @return {type} 无返回
     */
    selectCheckFiled(json) {
      const parseJson = JSON.parse(json);
      Object.keys(parseJson).forEach(key => {
        const data = this.fieldList.find(item => item.filed === key);
        Object.assign(data, parseJson[key]);
      });
    },
    /*// 打开字段 某个 配置项 弹窗
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
    },*/
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
      const parmaObj = {};
      let formId = '';
      const filterArr = this.fieldList.filter(item => {
        return item.isDisabled || item.isShow;
      });
      if (filterArr.length > 0) {
        filterArr.forEach(item => {
          formId = item.formId;
          parmaObj[item.filed] = {};
          if (item.isDisabled) {
            Object.assign(parmaObj[item.filed], { 'isDisabled': 1 });
          }
          if (item.isShow) {
            Object.assign(parmaObj[item.filed], { 'isShow': 1 });
          }
        });
        const configFormIndex = this.taskFormList.findIndex(i => i.id === formId);
        Object.assign(this.taskFormList[configFormIndex], { formDefJson: JSON.stringify(parmaObj) });
      } else {
        formId = this.fieldList[0] ? this.fieldList[0].formId : '';
        const configFormIndex = this.taskFormList.findIndex(i => i.id === formId);
        Object.assign(this.taskFormList[configFormIndex], { formDefJson: '' });
      }

      let newFieldsObjects = [];
      filterArr.forEach(f => {
        newFieldsObjects.push(window.bpmnInstances.moddle.create(`${this.prefix}:FormField`, f));
      });
      this.bpmnElementFormList[this.formFieldIndex].values = newFieldsObjects;
      const propertiesObject = window.bpmnInstances.moddle.create(`${this.prefix}:Forms`, {
          values: this.bpmnElementFormList
        });
      this.updateElementExtensions(propertiesObject);

      this.fieldDialogVisible = false;
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
  }
};
</script>
