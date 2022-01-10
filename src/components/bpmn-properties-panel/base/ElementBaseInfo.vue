<!--
 * @Author: your name
 * @Date: 2021-11-18 13:35:33
 * @LastEditTime: 2021-12-14 16:35:05
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \bpmn-process-designer-main\package\refactor\base\ElementBaseInfo.vue
-->
<template>
  <div class="panel-tab__content">
    <a-form-model :model="elementBaseInfo" size="small" :label-col="labelCol" :wrapper-col="wrapperCol" @submit.native.prevent>
      <a-form-model-item label="ID">
        <a-input
          v-model="elementBaseInfo.id"
          :disabled="idEditDisabled || elementBaseInfo.$type === 'bpmn:Process'"
          allowClear
          @change="updateBaseInfo('id')"
        />
      </a-form-model-item>
      <a-form-model-item label="名称">
        <a-input v-model="elementBaseInfo.name" allowClear @change="updateBaseInfo('name')" />
      </a-form-model-item>
      <!--流程的基础属性-->
      <template  v-if="elementBaseInfo.$type === 'bpmn:Process' || elementBaseInfo.$type === 'bpmn:UserTask'">
        <a-form-model-item label="办理时限">
          <a-input v-model="elementBaseInfo.timeLimit" allowClear @change="updateBaseInfo('timeLimit')" >
            <i slot="addonAfter" style="margin-right: 10px;">天</i>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="警告时限">
          <a-input v-model="elementBaseInfo.warningTimeLimit" allowClear @change="updateBaseInfo('warningTimeLimit')" >
            <i slot="addonAfter" style="margin-right: 10px;">天</i>
          </a-input>
        </a-form-model-item>
      </template>
<!--      <template  v-if="elementBaseInfo.$type === 'bpmn:SubProcess'">
        <a-form-model-item label="调用活动类型">
          <a-select v-model="elementBaseInfo.callActivitiType" default-value="1" @change="updateBaseInfo('callActivitiType')" >
            <a-select-option value="1">默认（BPMN）</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="调用元素" prop="callActivitiKey" :rules="{ required: true, message: '请输入调用元素', trigger: ['blur'] }">
          <a-input v-model="elementBaseInfo.callActivitiKey" allowClear @change="updateBaseInfo('callActivitiKey')" >
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="Binding">
          <a-select v-model="elementBaseInfo.binding" default-value="1" @change="updateBaseInfo('binding')" >
            <a-select-option value="1">latest</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Tenant Id">
          <a-input v-model="elementBaseInfo.tenantId" allowClear @change="updateBaseInfo('tenantId')" >
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="Delegate Variable Mapping">
          <a-select v-model="elementBaseInfo.variable" @change="updateBaseInfo('variable')" >
          </a-select>
        </a-form-model-item>
      </template>-->
      <template  v-if="elementBaseInfo.$type === 'bpmn:UserTask'">
        <a-form-model-item label="允许打印">
          <h-switch v-model="elementBaseInfo.enablePrint" @change="updateBaseInfo('enablePrint')" />
        </a-form-model-item>
        <a-form-model-item label="允许委托办理">
          <h-switch v-model="elementBaseInfo.enableEntrusted" @change="updateBaseInfo('enableEntrusted')" />
        </a-form-model-item>
        <a-form-model-item label="发送任务到消息">
          <h-switch v-model="elementBaseInfo.arriveNotification"  @change="updateBaseInfo('arriveNotification')" />
        </a-form-model-item>
        <a-form-model-item label="允许跟踪">
          <h-switch v-model="elementBaseInfo.enableTrack" @change="updateBaseInfo('enableTrack')" />
        </a-form-model-item>           
        <a-form-model-item label="审核留言必填">
          <h-switch v-model="elementBaseInfo.requireComment" @change="updateBaseInfo('requireComment')" />
        </a-form-model-item>      
      </template>
<!--      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <a-form-model-item label="版本标签">
          <a-input v-model="elementBaseInfo.versionTag" allowClear @change="updateBaseInfo('versionTag')" />
        </a-form-model-item>
        <a-form-model-item label="可执行">
          <a-switch v-model="elementBaseInfo.isExecutable" checked-children="是" un-checked-children="否" @change="updateBaseInfo('isExecutable')" />
        </a-form-model-item>
      </template>-->
    </a-form-model>
  </div>
</template>
<script>
import { uuid } from 'vue-uuid';

export default {
  name: "ElementBaseInfo",
  props: {
    businessObject: Object,
    type: String,
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      elementBaseInfo: {},
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
  },
  watch: {
    businessObject: {
      immediate: false,
      handler: function(val) {
        if (val) {
          this.$nextTick(() => {
            this.resetBaseInfo();
            this.changeId()
          });
        }
      }
    }
  },
  methods: {
    resetBaseInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement;
      this.elementBaseInfo = Object.assign({
        timeLimit:this.bpmnElement.businessObject.$attrs.timeLimit,
        warningTimeLimit:this.bpmnElement.businessObject.$attrs.warningTimeLimit,
        enableEntrusted:this.bpmnElement.businessObject.$attrs.enableEntrusted,
        enablePrint:this.bpmnElement.businessObject.$attrs.enablePrint,
        arriveNotification:this.bpmnElement.businessObject.$attrs.arriveNotification,
        enableTrack:this.bpmnElement.businessObject.$attrs.enableTrack,
        requireComment:this.bpmnElement.businessObject.$attrs.requireComment,
        callActivitiType:this.bpmnElement.businessObject.$attrs.callActivitiType,
        callActivitiKey:this.bpmnElement.businessObject.$attrs.callActivitiKey,
        binding:this.bpmnElement.businessObject.$attrs.binding,
        tenantId:this.bpmnElement.businessObject.$attrs.tenantId,
        variable:this.bpmnElement.businessObject.$attrs.variable
        },this.bpmnElement.businessObject);
    },
    changeId() {
      if (this.type === 'Process') {
        return;
      }
      let uuidV4 = uuid.v4().replace(/-/g, "");
      this.elementBaseInfo.id = `${this.type}_${uuidV4}`
      this.updateBaseInfo('id')
    },
    updateBaseInfo(key) {
      const attrObj = Object.create(null);
      attrObj[key] = this.elementBaseInfo[key];
      if (key === "id") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: `${this.elementBaseInfo[key]}_di` }
        });
      } else {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj);
      }
    }
  },
  mounted() {
    this.$bus.on('changeBaseInfo', ({ elementBaseInfo, key }) => {
      Object.assign(this.elementBaseInfo, elementBaseInfo)
      this.updateBaseInfo(key)
    })
  },
  beforeDestroy() {
    this.bpmnElement = null;
  }
};
</script>
