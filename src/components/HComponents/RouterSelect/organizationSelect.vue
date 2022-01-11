<!--
* @Description:
-->
<template>
  <section>
    <a-select
      v-model="participants"
      style="width: 185px"
      :dropdownStyle="{ visibility: 'hidden' }"
    >
      <a-select-option v-for="item in selectOptions" :key="item.id" :value="item.id">
        {{ item.name }} &lt;{{ item.id }}&gt;
      </a-select-option>
    </a-select>
    <a-button @click="visible = true">地址薄</a-button>

    <a-modal v-model="visible" :width="800" title="组织机构选择" @ok="handleOk" @cancel="selectedRowKeys = participants;">
      <a-table
        :columns="column"
        :data-source="dataSource"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows, onChange: onSelectChange }"
        size="middle"
        :pagination="false"
        fixed="false"
        rowKey="id"
      >
      </a-table>
    </a-modal>

  </section>
</template>

<script>
import * as api from '@/api/api';

const column = [
  {
    title: '参数',
    dataIndex: 'name',
    key: 'name'
  }
];

export default {
  name: 'OrganizationSelect',
  components: {},
  props: {
    value: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      valueArray: [],
      participants: [],
      selectOptions: [],
      selectedRowKeys: [],
      dataSource: [],
      visible: false,
      column,
      selectedRows: []
    };
  },
  created() {
  },
  mounted() {
    // this.loadTableData();
  },
  activited() {
  },
  methods: {
    /**
     * @method 查询tree的数据
     * @desc 解释说明
     * @return {type} 无返回
     */
    loadTableData(callback) {
      this.loading = true;
      api.listOrganizations()
        .then(res => {
          console.log('=============', res);
          const data = res.data.content.map(i => {
            return {
              ...i
            };
          });
          this.dataSource = data;
          this.loading = false;
          callback();
        });
    },
    /**
     * @method 对话框的确定事件
     * @desc 解释说明
     * @return {type} 无返回
     */
    handleOk() {
      if (this.selectedRowKeys.length > 1) {
        this.$message.error('请选择一个组织机构');
        return null;
      }
      this.visible = false;
      this.selectOptions = this.selectedRowKeys;
      this.participants = this.selectedRowKeys;
      const JsonValue = {};
      this.$set(JsonValue, 'organizationIds', this.participants);
      this.$emit('change', JSON.stringify(JsonValue));
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRows changed: ', selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    }
  },
  filter: {},
  computed: {
  },
  watch: {
    'value': {
      handler(val) {
        try {
          const data = JSON.parse(val);
          if (data.organizationIds) {
            this.valueArray = data.organizationIds;
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
        this.selectedRowKeys = val;
        const options = [];
        this.loadTableData(() => {
          for (let i = 0; i < this.selectedRowKeys.length; i++) {
            const item = this.selectedRowKeys[i];
            const dataItem = this.dataSource.find(i => i.id === item);
            options.push(dataItem);
          }
        });
        this.selectOptions = options;
      },
      immediate: true,
      deep: true
    },
    'participants': {
      handler() {
        const JsonValue = {};
        this.$set(JsonValue, 'organizationIds', this.participants);
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
