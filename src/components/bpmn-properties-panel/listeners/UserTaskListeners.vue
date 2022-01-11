<template>
  <div class="panel-tab__content">
    <h-table
      :data-source="elementListenersList"
      size="small"
      bordered
      rowKey="id"
      :columns="elementListenersColumns"
    >
      <span slot="action" slot-scope="text, record, index">
        <a @click="openListenerForm(record, index)">编辑</a>
        <a-divider type="vertical" />
        <a style="color: #ff4d4f" @click="removeListener(record, index)">移除</a>
      </span>
    </h-table>
    <div class="element-drawer__button">
      <a-button type="primary" icon="plus" @click="openListenerForm(null)">添加监听器</a-button>
    </div>

    <!-- 监听器 编辑/创建 部分 -->
    <a-drawer :visible="listenerFormModelVisible" title="任务监听器" :width="`${width}px`" destroy-on-close closable @close="listenerFormModelVisible = false">
      <a-form-model size="small" :model="listenerForm" :label-col="labelCol" :wrapper-col="wrapperCol" ref="listenerFormRef" @submit.native.prevent>
        <a-form-model-item label="事件类型" prop="event" :rules="{ required: true, message: '请选择事件类型', trigger: ['blur', 'change'] }">
          <a-select v-model="listenerForm.event">
            <a-select-option v-for="i in Object.keys(listenerEventTypeObject)" :key="i" :value="i">{{ listenerEventTypeObject[i] }}</a-select-option>
          </a-select>
        </a-form-model-item>
<!--        <a-form-model-item label="监听器ID" prop="id" :rules="{ required: true, message:'请输入监听器ID', trigger: ['blur', 'change'] }">
          <a-input v-model="listenerForm.id" allow-clear />
        </a-form-model-item>-->
        <a-form-model-item label="监听器类型" prop="listenerType" :rules="{ required: true, message:'请选择监听器类型', trigger: ['blur', 'change'] }">
          <a-select v-model="listenerForm.listenerType">
            <a-select-option v-for="i in Object.keys(listenerTypeObject)" :key="i" :value="i">{{ listenerTypeObject[i] }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-if="listenerForm.listenerType === 'classListener'"
          label="Java类"
          prop="class"
          key="listener-class"
          :rules="{ required: true, message:'请输入Java类', trigger: ['blur', 'change'] }"
        >
          <a-input v-model="listenerForm.class" allow-clear />
        </a-form-model-item>
        <a-form-model-item
          v-if="listenerForm.listenerType === 'expressionListener'"
          label="表达式"
          prop="expression"
          key="listener-expression"
          :rules="{ required: true, message:'请输入表达式', trigger: ['blur', 'change'] }"
        >
          <a-input v-model="listenerForm.expression" allow-clear />
        </a-form-model-item>
        <a-form-model-item
          v-if="listenerForm.listenerType === 'delegateExpressionListener'"
          label="代理表达式"
          prop="delegateExpression"
          key="listener-delegate"
          :rules="{ required: true, message:'请输入代理表达式', trigger: ['blur', 'change'] }"
        >
          <a-input v-model="listenerForm.delegateExpression" allow-clear />
        </a-form-model-item>
        <template v-if="listenerForm.listenerType === 'scriptListener'">
<!--          <a-form-model-item
            label="脚本格式"
            prop="scriptFormat"
            key="listener-script-format"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本格式' }"
          >
            <a-input v-model="listenerForm.scriptFormat" allow-clear />
          </a-form-model-item>
          <a-form-model-item
            label="脚本类型"
            prop="scriptType"
            key="listener-script-type"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请选择脚本类型' }"
          >
            <a-select v-model="listenerForm.scriptType">
              <a-select-option value="inlineScript">内联脚本</a-select-option>
              <a-select-option value="externalScript">外部脚本</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="listenerForm.scriptType === 'inlineScript'"
            label="脚本内容"
            prop="value"
            key="listener-script"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本内容' }"
          >
            <a-input v-model="listenerForm.value" allow-clear />
          </a-form-model-item>
          <a-form-model-item
            v-if="listenerForm.scriptType === 'externalScript'"
            label="资源地址"
            prop="resource"
            key="listener-resource"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写资源地址' }"
          >
            <a-input v-model="listenerForm.resource" allow-clear />
          </a-form-model-item>-->
          <a-form-model-item prop="groovyName" key="listener.groovyName" label="Groovy脚本">
            <a-col :span="12">
              <a-input v-model="listenerForm.groovyName" allow-clear />
            </a-col>
            <a-col :span="4">
              <a-button type="primary" @click="openGroovyForm">选择</a-button>
            </a-col>
          </a-form-model-item>
        </template>

        <template v-if="listenerForm.event === 'timeout'">
          <a-form-model-item label="定时器类型" prop="eventDefinitionType" key="eventDefinitionType">
            <a-select v-model="listenerForm.eventDefinitionType">
              <a-select-option value="date">日期</a-select-option>
              <a-select-option value="duration">持续时长</a-select-option>
              <a-select-option value="cycle">循环</a-select-option>
              <a-select-option value="null">无</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="!!listenerForm.eventDefinitionType && listenerForm.eventDefinitionType !== 'null'"
            label="定时器"
            prop="eventTimeDefinitions"
            key="eventTimeDefinitions"
            :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写定时器配置' }"
          >
            <a-input v-model="listenerForm.eventTimeDefinitions" allow-clear />
          </a-form-model-item>
        </template>
      </a-form-model>

      <a-divider />
      <p class="listener-filed__title listener-filed__title-span-width-auto">
        <span><a-icon type="appstore" theme="filled" />注入字段 </span>
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

      <div class="element-drawer__button element-drawer__two-btn">
        <a-button @click="listenerFormModelVisible = false">取 消</a-button>
        <a-button type="primary" @click="saveListenerConfig">保 存</a-button>
      </div>
    </a-drawer>

    <!-- 注入西段 编辑/创建 部分 -->
    <a-modal title="字段配置" :visible="listenerFieldFormModelVisible" width="600px" destroy-on-close @cancel="listenerFieldFormModelVisible = false">
      <a-form-model :model="listenerFieldForm" :label-col="labelCol" :wrapper-col="wrapperCol" ref="listenerFieldFormRef" style="min-height: 136px" @submit.native.prevent>
        <a-form-model-item label="字段名称" prop="name" :rules="{ required: true, message:'请输入字段名称', trigger: ['blur', 'change'] }">
          <a-input v-model="listenerFieldForm.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="字段类型" prop="fieldType" :rules="{ required: true, message:'请选择字段类型', trigger: ['blur', 'change'] }">
          <a-select v-model="listenerFieldForm.fieldType">
            <a-select-option v-for="i in Object.keys(fieldTypeObject)" :key="i" :value="i">{{ fieldTypeObject[i] }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-if="listenerFieldForm.fieldType === 'string'"
          label="字段值"
          prop="string"
          key="field-string"
          :rules="{ required: true, message:'请输入字段值', trigger: ['blur', 'change'] }"
        >
          <a-input v-model="listenerFieldForm.string" allow-clear />
        </a-form-model-item>
        <a-form-model-item
          v-if="listenerFieldForm.fieldType === 'expression'"
          label="表达式"
          prop="expression"
          key="field-expression"
          :rules="{ required: true, message:'请输入表达式', trigger: ['blur', 'change'] }"
        >
          <a-input v-model="listenerFieldForm.expression" allow-clear />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="listenerFieldFormModelVisible = false">取 消</a-button>
        <a-button type="primary" @click="saveListenerFiled">确 定</a-button>
      </template>
    </a-modal>
    <a-modal :visible="groovyListDialogVisible" title="脚本库" width="600px" destroy-on-close @cancel="groovyListDialogVisible = false">
      <a-form layout="inline" :model="searchForm" class="demo-form-inline" style="margin-bottom: 15px">
        <a-form-model-item>
          <a-input v-model="searchForm.searchName" placeholder="脚本名称"></a-input>
        </a-form-model-item>
<!--        <a-form-model-item>
          <a-select style="width: 180px" v-model="searchForm.type" placeholder="脚本类别">
            <a-select-option value="默认类别">默认类别</a-select-option>
            <a-select-option value="新增类别">新增类别</a-select-option>
          </a-select>
        </a-form-model-item>-->
        <a-form-model-item>
          <a-button type="primary" @click="onSubmit(true)">查询</a-button>
        </a-form-model-item>
      </a-form>
      <h-table
        :data-source="groovyList.content"
        size="small"
        ref="groovyListTable"
        :scroll="{ y: 240 }"
        bordered
        rowKey="id"
        :columns="groovyColumns"
        :rowSelection="{ selectedRowKeys: selectIds, selectedRows: selects, onChange: handleGroovyListSelectionChange, type: 'radio'}"
        :pagination="{
          current: searchForm.pageNumber + 1,
          pageSize: searchForm.pageSize,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          total: groovyList.totalElements,
          onChange: (pageNumber, pageSize) => {
            Object.assign(this.searchForm, { pageNumber: pageNumber - 1, pageSize })
            this.onSubmit()
          }
        }"
      >
      </h-table>
      <template slot="footer">
        <a-button  @click="groovyListDialogVisible = false">取 消</a-button>
        <a-button  type="primary" @click="bindGroovy()">绑定脚本</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment';
const groovyColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'true' },
  },
  {
    title: 'code',
    dataIndex: 'code',
    key: 'code',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'code' },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'createTime' },
    customRender: (text) => {
      if (!text) return '--';
      return moment(text).format('YYYY-MM-DD HH:mm:ss');
    },
  },
]
import { createListenerObject, updateElementExtensions } from "../../utils";
import { initListenerForm, initListenerType, eventType, listenerType, fieldType } from "./utilSelf";

export default {
  name: "UserTaskListeners",
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
      elementListenersColumns: [
        {
          title: '序号',
          type: 'index',
          dataIndex: 'index',
          key: 'index',
          width: '50px',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '事件类型',
          dataIndex: 'event',
          key: 'event',
          customRender: (text) => { return this.listenerEventTypeObject[text] },
          scopedSlots: { customRender: 'event' },
        },
        /*{
          title: '事件id',
          dataIndex: 'id',
          key: 'id',
          ellipsis: true,
          showOverflowTooltip: true,
          scopedSlots: { customRender: 'id' },
        },*/
        {
          title: '监听器类型',
          dataIndex: 'listenerType',
          key: 'listenerType',
          ellipsis: true,
          showOverflowTooltip: true,
          customRender: (text) => { return this.listenerTypeObject[text] },
          scopedSlots: { customRender: 'listenerType' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: '90px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      fieldsListOfListenerColumns: [
        {
          title: '序号',
          type: 'index',
          dataIndex: 'index',
          key: 'index',
          width: '50px',
          scopedSlots: { customRender: 'index' },
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
          customRender: (text) => { return this.fieldTypeObject[text] },
          scopedSlots: { customRender: 'fieldType' },
        },
        {
          title: '字段值/表达式',
          dataIndex: 'expression',
          key: 'expression',
          ellipsis: true,
          showOverflowTooltip: true,
          customRender: (text, row) => { return row.string || row.expression },
          scopedSlots: { customRender: 'fieldType' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: '100px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      elementListenersList: [],
      selects:[],
      selectIds:[],
      listenerEventTypeObject: eventType,
      listenerTypeObject: listenerType,
      listenerFormModelVisible: false,
      listenerForm: {},
      fieldTypeObject: fieldType,
      fieldsListOfListener: [],
      listenerFieldFormModelVisible: false, // 监听器 注入字段表单弹窗 显示状态
      editingListenerIndex: -1, // 监听器所在下标，-1 为新增
      editingListenerFieldIndex: -1, // 字段所在下标，-1 为新增
      listenerFieldForm: {}, // 监听器 注入字段 详情表单
      groovyListDialogVisible: false,
      groovyList: {
        content: [],
        totalElements: 0
      },
      searchForm:{
        pageNumber: 0,
        pageSize: 20
      },
      groovyColumns
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        val && val.length && this.$nextTick(() => this.resetListenersList());
      }
    }
  },
  methods: {
    onSubmit(isFirst) {
      if (isFirst) {
        this.searchForm.pageNumber = this.$options.data.call(this).searchForm.pageNumber
      }
      this.$api.listDictionaries({ ...this.searchForm, searchType: 'GOORY-TYPE' }).then(resp => {
        this.groovyList = resp.data
      }).catch(e => {
        this.$message.error(e.response.message || '查询失败');
      }).finally()
      console.log('onSubmit')
    },
    openGroovyForm(){
      this.groovyListDialogVisible = true;
      this.searchForm = this.$options.data.call(this).searchForm
      this.onSubmit()
    },
    handleGroovyListSelectionChange(selectedRowKeys, selectedRows){
      this.selects = selectedRows;
      this.selectIds = selectedRowKeys;
    },
    bindGroovy(){
      if(this.selects.length === 0){
        return;
      }
      this.$set(this.listenerForm, 'groovyKeyId', this.selects[0].id)
      this.$set(this.listenerForm, 'groovyName', this.selects[0].name)
      this.groovyListDialogVisible = false;
    },
    resetListenersList() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.otherExtensionList = [];
      this.bpmnElementListeners = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type === `${this.prefix}:TaskListener`) ?? [];
      this.elementListenersList = this.bpmnElementListeners.map(listener => initListenerType(listener));
    },
    openListenerForm(listener, index) {
      if (listener) {
        this.listenerForm = initListenerForm(listener);
        this.editingListenerIndex = index;
      } else {
        this.listenerForm = {};
        this.editingListenerIndex = -1; // 标记为新增
      }
      if (listener && listener.fields) {
        this.fieldsListOfListener = listener.fields.map(field => ({ ...field, fieldType: field.string ? "string" : "expression" }));
      } else {
        this.fieldsListOfListener = [];
        this.$set(this.listenerForm, "fields", []);
      }
      // 打开侧边栏并清楚验证状态
      this.listenerFormModelVisible = true;
      this.$nextTick(() => {
        if (this.$refs["listenerFormRef"]) this.$refs["listenerFormRef"].clearValidate();
      });
    },
    // 移除监听器
    removeListener(listener, index) {
      this.$confirm({
        title: '提示',
        content: '确认移除该监听器吗？',
        okText: '确定',
        okType: 'warning',
        cancelText: '取消',
        onOk: () => {
          this.bpmnElementListeners.splice(index, 1);
          this.elementListenersList.splice(index, 1);
          updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(this.bpmnElementListeners));
        },
        onCancel: () => {
          console.info("操作取消")
        }
      })
    },
    // 保存监听器
    async saveListenerConfig() {
      let validateStatus = await this.$refs["listenerFormRef"].validate();
      if (!validateStatus) return; // 验证不通过直接返回
      const listenerObject = createListenerObject(this.listenerForm, true, this.prefix);
      if (this.editingListenerIndex === -1) {
        this.bpmnElementListeners.push(listenerObject);
        this.elementListenersList.push(this.listenerForm);
      } else {
        this.bpmnElementListeners.splice(this.editingListenerIndex, 1, listenerObject);
        this.elementListenersList.splice(this.editingListenerIndex, 1, this.listenerForm);
      }
      // 保存其他配置
      this.otherExtensionList = this.bpmnElement.businessObject?.extensionElements?.values?.filter(ex => ex.$type !== `${this.prefix}:TaskListener`) ?? [];
      updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(this.bpmnElementListeners));
      // 4. 隐藏侧边栏
      this.listenerFormModelVisible = false;
      this.listenerForm = {};
    },
    // 打开监听器字段编辑弹窗
    openListenerFieldForm(field, index) {
      this.listenerFieldForm = field ? JSON.parse(JSON.stringify(field)) : {};
      this.editingListenerFieldIndex = field ? index : -1;
      this.listenerFieldFormModelVisible = true;
      this.$nextTick(() => {
        if (this.$refs["listenerFieldFormRef"]) this.$refs["listenerFieldFormRef"].clearValidate();
      });
    },
    // 保存监听器注入字段
    async saveListenerFiled() {
      let validateStatus = await this.$refs["listenerFieldFormRef"].validate();
      if (!validateStatus) return; // 验证不通过直接返回
      if (this.editingListenerFieldIndex === -1) {
        this.fieldsListOfListener.push(this.listenerFieldForm);
        this.listenerForm.fields.push(this.listenerFieldForm);
      } else {
        this.fieldsListOfListener.splice(this.editingListenerFieldIndex, 1, this.listenerFieldForm);
        this.listenerForm.fields.splice(this.editingListenerFieldIndex, 1, this.listenerFieldForm);
      }
      this.listenerFieldFormModelVisible = false;
      this.$nextTick(() => (this.listenerFieldForm = {}));
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
          this.listenerForm.fields.splice(index, 1);
        },
        onCancel: () => {
          console.info("操作取消")
        }
      })
    }
  }
};
</script>
