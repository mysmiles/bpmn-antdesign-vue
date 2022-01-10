<template>
  <div class="panel-tab__content">
    <a-form-model :model="elementBaseInfo" size="small" :label-col="labelCol" :wrapper-col="wrapperCol" @submit.native.prevent>
      <a-form-model-item label="调用活动类型">
        <a-select v-model="elementBaseInfo.callActivitiType" default-value="1" @change="updateBaseInfo('callActivitiType')" >
          <a-select-option value="1">默认（BPMN）</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="调用元素" prop="callActivitiKey" :rules="{ required: true, message: '请输入调用元素', trigger: ['blur'] }">
        <a-input v-model="elementBaseInfo.callActivitiKey" allowClear @change="updateBaseInfo('callActivitiKey')" />
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
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'SubProcessTask',
  props: {},
  components: {},
  watch: {},
  data() {
    return {
      elementBaseInfo: {},
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
  },
  created() {
  },
  mounted() {
    // let $parent = this.$parent.$parent.$parent.$parent.$parent.$parent
    let $parent = this.$root.$children[0].$refs.bpmn.$refs.my_properties_panel
    this.elementBaseInfo = $parent.$refs['element_base_info'].elementBaseInfo
  },
  methods: {
    updateBaseInfo(key) {
      this.$bus.emit('changeBaseInfo', { elementBaseInfo: this.elementBaseInfo, key: key })
    }
  }
}
</script>

<style scoped>

</style>
