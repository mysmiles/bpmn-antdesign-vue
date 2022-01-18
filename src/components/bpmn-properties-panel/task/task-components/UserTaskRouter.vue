<!--
 * @Author: your name
 * @Date: 2021-11-24 15:32:50
 * @LastEditTime: 2021-12-14 16:42:12
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \bpmn-process-designer-main\package\refactor\task\task-components\UserTaskRouter.vue
-->
<template>
  <div>
    <a-form-model size="small" :model="userTaskForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" @submit.native.prevent>
      <a-form-model-item label="候选人方案" prop="assigneeRouter" :rules="{ required: true, message: '请选择候选人方案', trigger: ['change'] }">
        <a-select v-model="userTaskForm.assigneeRouter" @change="updateElementTask('assigneeRouter')">
          <a-select-option v-for="rt in routerTypes" :key="rt.value" :value="rt.value">
            方案{{ rt.value }}：{{ rt.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item  v-if="userTaskForm.assigneeRouter !== 6" label="参数" ref="assigneeRouterParam" prop="assigneeRouterParam" :rules="{ required: true, message: '请选择参数', trigger: ['blur', 'change'] }" :autoLink="false">

        <div v-if="userTaskForm.assigneeRouter === 1">
          <transfer-tree :value="userTaskForm.assigneeRouterParam" @change="(val) => {this.userTaskForm.assigneeRouterParam = val; this.updateElementTask('assigneeRouterParam')}" />
        </div>
        <div v-else-if="userTaskForm.assigneeRouter === 2">
          <roles-select :value="userTaskForm.assigneeRouterParam" @change="(val) => {this.userTaskForm.assigneeRouterParam = val; this.updateElementTask('assigneeRouterParam')}" />
        </div>
        <div v-else-if="userTaskForm.assigneeRouter === 3">
          <organization-select :value="userTaskForm.assigneeRouterParam" @change="(val) => {this.userTaskForm.assigneeRouterParam = val; this.updateElementTask('assigneeRouterParam')}" />
        </div>
        <div v-else-if="userTaskForm.assigneeRouter === 4">
          <department-select :value="userTaskForm.assigneeRouterParam" @change="(val) => {this.userTaskForm.assigneeRouterParam = val; this.updateElementTask('assigneeRouterParam')}" />
        </div>
        <div v-else-if="userTaskForm.assigneeRouter === 5">
          <!--todo: 这个 procDefId 和 id从哪里来-->
          <progress-task-key-select :value="userTaskForm.assigneeRouterParam" @change="(val) => {this.userTaskForm.assigneeRouterParam = val; this.updateElementTask('assigneeRouterParam')}" :procDefId="procDefId" :id="id" />
        </div>
        <div v-else>
          <a-input v-model="userTaskForm.assigneeRouterParam" />
        </div>


<!--         <a-col :span="16">
           <a-input
             v-model="userTaskForm.assignee"
             allowClear
             @change="() => {$refs.assignee.onFieldChange(); this.updateElementTask('assignee')}"
             @blur="() => {$refs.assignee.onFieldBlur()}"
           />
         </a-col>
         <a-col :span="4">
           <a-button style="margin-left: 20px" type="primary" @click="openUserForm">选择</a-button>
         </a-col>-->

      </a-form-model-item>
      <a-form-model-item label="历史办理者优先">
        <h-switch v-model="userTaskForm.assigneeHistoryFirst" @change="updateElementTask('assigneeHistoryFirst')" />
       </a-form-model-item>
      <a-form-model-item label="默认提交">
        <h-switch v-model="userTaskForm.taskAutoSubmit" @change="updateElementTask('taskAutoSubmit')" />
       </a-form-model-item>
      <a-form-model-item label="办理人数（最大）" prop="maxAssigneeNum">
        <a-input style="width:160px" v-model.number="userTaskForm.maxAssigneeNum" allowClear @change="updateElementTask('maxAssigneeNum')" >
          <i slot="addonAfter">个</i>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="办理人数（最少）" prop="minAssigneeNum">
        <a-input style="width:160px" v-model.number="userTaskForm.minAssigneeNum" allowClear @change="updateElementTask('minAssigneeNum')" >
          <i slot="addonAfter">个</i>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="展现方式">
        <a-radio-group v-model="userTaskForm.assigneeShowType" @change="updateElementTask('assigneeShowType')">
          <a-radio value="1">按人员</a-radio>
          <a-radio value="2">部门</a-radio>
          <a-radio value="3">组织机构</a-radio>
          <a-radio value="4">角色</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="是否候选人">
        <h-switch v-model="userTaskForm.isCandidate" @change="updateElementTask('isCandidate')" />
<!--        <a-radio-group v-model="userTaskForm.isCandidate" @change="updateElementTask('isCandidate')">
          <a-radio value="常规">常规</a-radio>
          &lt;!&ndash;<a-radio v-if="userTaskForm.isMultiIntance === 0" value="接收办理">接收办理</a-radio>&ndash;&gt;
&lt;!&ndash;          <a-radio v-if="userTaskForm.isMultiIntance === 1" value="串行">串行</a-radio>
          <a-radio v-if="userTaskForm.isMultiIntance === 1" value="并行">并行</a-radio>
          <a-radio v-if="userTaskForm.isMultiIntance === 1" value="循环">循环</a-radio>&ndash;&gt;
        </a-radio-group>-->
      </a-form-model-item>
      <a-form-model-item label="多实例">
        <h-switch v-model="userTaskForm.isMultiIntance" @change="updateElementTask('isMultiIntance')" />
       </a-form-model-item>
<!--      <a-form-model-item label="完成条件" v-if="userTaskForm.isMultiIntance === 1">
        <a-input style="width:120px" v-model="userTaskForm.doneCondition" allowClear @change="updateBaseInfo('doneCondition')" ></a-input>
       </a-form-model-item>-->
    </a-form-model>
    <a-modal :visible="userFormVisible" title="候选人选择" width="600px" destroy-on-close @cancel="userFormVisible = false">
      <h-table
        :data-source="userList"
        ref="userTable"
        size="small"
        :rowSelection="{ selectedRowKeys: selectUsersIds, selectedRows: selectUsers, onChange: handleSelectionChange }"
        bordered
        rowKey="name"
        :columns="userColumns"
        :scroll="{ y: 240 }"
      >
      </h-table>
      <template slot="footer">
        <a-button @click="userFormVisible = false">取 消</a-button>
        <a-button type="primary" @click="saveUser">确 定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { TransferTree, DepartmentSelect, OrganizationSelect, ProgressTaskKeySelect, RolesSelect } from '@/components/HComponents/index'
const userColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    showOverflowTooltip: true,
    minWidth: '100px',
    scopedSlots: { customRender: 'name' },
  }
]
export default {
  name: "UserTask",
  props: {
    id: String,
    type: String
  },
  data() {
    let isGreater  = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入办理人数（最大）'));
      } else if (Number(value) < Number(this.userTaskForm.minAssigneeNum)) {
        callback(new Error("办理人数（最大）应不小于办理人数（最少）"));
      } else {
        callback();
      }
    };
    let isSmaller = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入办理人数（最少）'));
      } else if (Number(value) > Number(this.userTaskForm.maxAssigneeNum)) {
        callback(new Error("办理人数（最少）应不大于办理人数（最大）"));
      } else {
        callback();
      }
    };
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      userColumns,
      defaultTaskForm: {
        assigneeRouterParam: "",
        assigneeHistoryFirst:0,
        taskAutoSubmit:0,
        maxAssigneeNum:1,
        minAssigneeNum:0,
        assigneeShowType: '1',
        isCandidate: 0,
        isMultiIntance:0,
        arriveNotification:0,
        doneCondition:0,
        assigneeRouter:"",
        candidateUsers: [],
        candidateGroups: [],
        dueDate: "",
        followUpDate: "",
        priority: ""
      },
      userFormVisible:false,
      userTaskForm: {},
      userList:[
        {name:"局长"}
      ],
      selectUsers:[],
      selectUsersIds:[],
      routerTypes:[],
      rules: {
        maxAssigneeNum: [{ validator: isGreater, trigger: ['change', 'blur'] }],
        minAssigneeNum: [{ validator: isSmaller, trigger: ['change', 'blur'] }],
      }
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
  components: {
    TransferTree,
    DepartmentSelect,
    OrganizationSelect,
    ProgressTaskKeySelect,
    RolesSelect
  },
  methods: {
    loadDict() {
      this.$api.listEnumsByType({ types: 'CandidateRouter' }).then(res => {
        this.routerTypes = res.data[0].items;
      });
    },
    resetTaskForm() {
      for (let key in this.defaultTaskForm) {
        let value;
        if (key === "candidateUsers" || key === "candidateGroups") {
          value = this.bpmnElement?.businessObject[key] ? this.bpmnElement.businessObject[key].split(",") : [];
        } else {
          value = this.bpmnElement?.businessObject[key]|| this.bpmnElement?.businessObject.$attrs[key] || this.defaultTaskForm[key];
        }
        if (key === "isMultiIntance") {
          value = this.bpmnElement?.businessObject.loopCharacteristics ? 1 : 0;
        }
        console.log("this.bpmnElement?.businessObject",this.bpmnElement?.businessObject);
        this.$set(this.userTaskForm, key, value);
      }
    },
    openUserForm(){
        this.userFormVisible = true;
    },
    saveUser(){
     this.userTaskForm.assigneeRouterParam = this.selectUsers.map(v=>v.name).join(",");
     this.userTaskForm.candidateUsers = this.selectUsers.map(v=>v.name).join(",");
     this.userFormVisible = false;
     this.$refs.assigneeRouterParam.onFieldChange()
     this.updateElementTask("assigneeRouterParam");
     this.updateElementTask("candidateUsers");
    },
    handleSelectionChange(selectedRowKeys, selectedRows) {
      this.selectUsers = selectedRows;
      this.selectUsersIds = selectedRowKeys;
    },
    updateElementTask(key) {
      const taskAttr = Object.create(null);
    //  if (key === "candidateUsers" || key === "candidateGroups") {
    //    taskAttr[key] = this.userTaskForm[key] && this.userTaskForm[key].length ? this.userTaskForm[key].join() : null;
   //   } else {
        taskAttr[key] = this.userTaskForm[key] ?? null;
    //  }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr);
    }
  },
  beforeDestroy() {
    this.bpmnElement = null;
  },
  mounted() {
    this.loadDict()
    this.$nextTick(() => {
      let operateArr = ['maxAssigneeNum', 'minAssigneeNum', 'assigneeHistoryFirst', 'taskAutoSubmit', 'assigneeShowType', 'isCandidate', 'isMultiIntance'];
      operateArr.forEach(item => {
        this.updateElementTask(item)
      })
    })
  }
};
</script>
