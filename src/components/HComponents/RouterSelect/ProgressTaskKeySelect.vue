<template>
  <a-select v-model="participants" placeholder="">
    <a-select-option v-for="item in options" :key="item.taskDefKey" :value="item.taskDefKey">
      {{ item.taskDefKey }} {{ item.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import * as api from '@/api/api';

export default {
  name: 'ProgressTaskKeySelect',
  props: {
    value: {
      type: String,
      required: true,
      default: ''
    },
    procDefId: {
      type: String,
      required: true,
      default: ''
    },
    id: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      participants: '',
      options: [],
      valueArray: []
    };
  },
  mounted() {
    this.loadOptions();
  },
  methods: {
    loadOptions() {
      this.options = [];
       api.listTaskDefExtendById({ procDefId: this.procDefId }).then(resp => {
        // 排除开始节点和当前节点
        resp.data.map(ele => {
          if (ele.taskDefKey !== this.id && ele.taskDefKey) {
            this.options.push(ele);
          }
        });
      });
    }
  },
  watch: {
    'value': {
      handler(val) {
        try {
          const data = JSON.parse(val);
          if (data.taskDefKey) {
            this.valueArray = data.taskDefKey;
          } else {
            this.valueArray = [];
          }
        } catch (e) {
          this.valueArray = [];
        }
      },
      immediate: true,
      deep: true
    },
    'valueArray': {
      handler(val) {
        this.participants = val;
      },
      immediate: true,
      deep: true
    },
    'participants': {
      handler() {
        const JsonValue = {};
        this.$set(JsonValue, 'taskDefKey', this.participants);
        this.$emit('change', JSON.stringify(JsonValue));
      },
      // immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>

</style>
