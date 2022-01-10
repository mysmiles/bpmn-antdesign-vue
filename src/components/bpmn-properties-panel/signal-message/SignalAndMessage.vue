<template>
  <div class="panel-tab__content">
    <div class="panel-tab__content--title">
      <span><a-icon type="appstore" theme="filled" style="margin-right: 8px; color: #555555" />消息列表</span>
      <a-button size="small" type="primary" icon="plus" @click="openModel('message')">创建新消息</a-button>
    </div>
    <h-table
      :data-source="messageList"
      size="small"
      bordered
      rowKey="id"
      :columns="messageColumns"
      :pagination="false"
    >
    </h-table>
    <div class="panel-tab__content--title" style="padding-top: 8px; margin-top: 8px; border-top: 1px solid #eeeeee">
      <span><a-icon type="appstore" theme="filled" style="margin-right: 8px; color: #555555" />信号列表</span>
      <a-button size="small" type="primary" icon="plus" @click="openModel('signal')">创建新信号</a-button>
    </div>
    <h-table
      :data-source="signalList"
      size="small"
      bordered
      rowKey="id"
      :columns="signalColumns"
      :pagination="false"
    >
    </h-table>
    <a-modal :visible="modelVisible" :title="modelConfig.title" :mask-closable="false" width="400px" destroy-on-close @cancel="modelVisible = false">
      <a-form-model :model="modelObjectForm" size="small" @submit.native.prevent :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item :label="modelConfig.idLabel">
          <a-input v-model="modelObjectForm.id" allow-clear />
        </a-form-model-item>
        <a-form-model-item :label="modelConfig.nameLabel">
          <a-input v-model="modelObjectForm.name" allow-clear />
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button size="small" @click="modelVisible = false">取 消</a-button>
        <a-button size="small" type="primary" @click="addNewObject">保 存</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
const messageColumns = [
  {
    title: '序号',
    type: 'index',
    dataIndex: 'index',
    key: 'index',
    width: '60px',
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '消息ID',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'id' },
  },
  {
    title: '消息名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'name' },
  },
]
const signalColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    type: 'index',
    key: 'index',
    width: '60px',
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '信号ID',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'id' },
  },
  {
    title: '信号名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    showOverflowTooltip: true,
    scopedSlots: { customRender: 'name' },
  },
]
export default {
  name: "SignalAndMassage",
  data() {
    return {
      signalList: [],
      messageList: [],
      modelVisible: false,
      modelType: "",
      modelObjectForm: {},
      messageColumns,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      signalColumns
    };
  },
  computed: {
    modelConfig() {
      if (this.modelType === "message") {
        return { title: "创建消息", idLabel: "消息ID", nameLabel: "消息名称" };
      } else {
        return { title: "创建信号", idLabel: "信号ID", nameLabel: "信号名称" };
      }
    }
  },
  mounted() {
    this.initDataList();
  },
  methods: {
    initDataList() {
      this.rootElements = window.bpmnInstances.modeler.getDefinitions().rootElements;
      this.messageIdMap = {};
      this.signalIdMap = {};
      this.messageList = [];
      this.signalList = [];
      this.rootElements.forEach(el => {
        if (el.$type === "bpmn:Message") {
          this.messageIdMap[el.id] = true;
          this.messageList.push({ ...el });
        }
        if (el.$type === "bpmn:Signal") {
          this.signalIdMap[el.id] = true;
          this.signalList.push({ ...el });
        }
      });
    },
    openModel(type) {
      this.modelType = type;
      this.modelObjectForm = {};
      this.modelVisible = true;
    },
    addNewObject() {
      if (this.modelType === "message") {
        if (this.messageIdMap[this.modelObjectForm.id]) {
          return this.$message.error("该消息已存在，请修改id后重新保存");
        }
        const messageRef = window.bpmnInstances.moddle.create("bpmn:Message", this.modelObjectForm);
        this.rootElements.push(messageRef);
      } else {
        if (this.signalIdMap[this.modelObjectForm.id]) {
          return this.$message.error("该信号已存在，请修改id后重新保存");
        }
        const signalRef = window.bpmnInstances.moddle.create("bpmn:Signal", this.modelObjectForm);
        this.rootElements.push(signalRef);
      }
      this.modelVisible = false;
      this.initDataList();
    }
  }
};
</script>
