<!--
* @Description:
-->
<template>
  <section>
    <a-select
      class="transfer-tree-select"
      :isMulti="isMulti"
      mode="multiple"
      v-model="participants"
      style="width: 185px"
      :dropdownStyle="{ visibility: 'hidden', }"
    >
      <a-select-option v-for="i in selectOptions" :key="i.key" :value="i.key">
        {{ i.title }} &lt;{{ i.key }}&gt;
      </a-select-option>
    </a-select>
    <a-button @click="visible = true">地址薄</a-button>
    <a-modal v-model="visible" :width="800" title="人员选择" @ok="handleOk" @cancel="targetKeys = participants;">
      <a-transfer
        class="tree-transfer"
        :data-source="dataSource"
        :target-keys="targetKeys"
        :render="item => item.title"
        :show-select-all="false"
        @change="onChange"
        :operations="['添加', '移走']"
        :list-style="{ width: '300px', height: '460px', overflow: 'auto' }"
      >
        <template
          slot="children"
          slot-scope="{ props: { direction, selectedKeys }, on: { itemSelect } }"
        >

          <a-tree
            checkable
            blockNode
            v-if="direction === 'left'"
            :tree-data="treeData"
            v-model="checkedNodeKeys"
            show-icon
            :load-data="onLoadData"
            @check="
              (_, props) => {
                onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect);
              }
            "
          >
            <template slot="organization" slot-scope="{ expanded }">
              <a-icon :type="expanded ? 'folder-open' : 'folder'" style="color: #DE9C00" />
            </template>
            <a-icon slot="department" type="apartment" style="color: #FF4905" />
            <a-icon slot="user" type="user" style="color: #10D269" />
          </a-tree>

          <!--          <a-tree
            v-if="direction === 'left'"
            blockNode
            checkable
            v-model="checkedNodeKeys"
            :treeData="treeData"
            @check="
              (_, props) => {
                onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect);
              }
            "
            @select="
              (_, props) => {
                onChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect);
              }
            "
          />-->
        </template>
      </a-transfer>
    </a-modal>

  </section>
</template>

<script>
import * as api from '@/api/api';

export default {
  name: 'TransferTree',
  components: {},
  props: {
    value: {
      type: String,
      required: true,
      default: ''
    },
    isMulti: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      valueArray: [],
      participants: [],
      selectOptions: [],
      targetKeys: [],
      dataSource: [],
      visible: false,
      checkedNodeKeys: [],
      TreeDataResp: []
    };
  },
  created() {
  },
  mounted() {
    this.loadTreeData();
  },
  activited() {
  },
  methods: {
    flatten(list = []) {
      list.forEach(item => {
        this.dataSource.push(item);
        this.flatten(item.children);
      });
    },
    isChecked(selectedKeys, eventKey) {
      return selectedKeys.indexOf(eventKey) !== -1;
    },
    handleTreeData(data, targetKeys = []) {
      data.forEach(item => {
        item['disabled'] = targetKeys.includes(item.key);
        if (item.children) {
          let isDisable = false;
          for (let i = 0; i < item.children.length; i++) {
            isDisable = targetKeys.includes(item.children[i].key);
          }
          item['disabled'] = isDisable;
        }
        if (item.children) {
          this.handleTreeData(item.children, targetKeys);
        }
      });
      return data;
    },
    handleTreeCheck(treeData) {
      const newArr = [];
      function checked(obj) {
        obj.forEach(item => {
          if (item.disabled === true) {
            newArr.push(item.key);
          }
          if (item.children && item.children.length > 0) {
            checked(item.children);
          }
        });
      }
      checked(treeData);
      return newArr;
    },
    /**
     * @method 选择用户的节点，用来判断是不是成员节点
     * @desc 解释说明
     * @return {type} 无返回
     */
    isUserSelect(targetKey) {
      const data = this.dataSource.find(i => i.key === targetKey);
      if (data.type === 'user') {
        return true;
      } else {
        this.$message.error('请选择人员');
        return false;
      }
      // return data.type === 'user';
    },
    /**
     * @method 查询tree的数据
     * @desc 解释说明
     * @return {type} 无返回
     */
    loadTreeData() {
      this.loading = true;
      api.listOrgDeptUsers({ searchParentId: null })
        .then(res => {
          const data = res.data.map(i => {
            return {
              ...i,
              scopedSlots: { icon: i.type }
            };
          });
          this.TreeDataResp = data;
          this.loading = false;
          this.dataSource = [];
          this.flatten(JSON.parse(JSON.stringify(this.TreeDataResp)));
        });
    },
    /**
     * @method tree上的懒加载事件
     * @desc 解释说明
     * @return {type} 无返回
     */
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }

        api.listOrgDeptUsers({ searchParentId: treeNode.dataRef.key }).then(resp => {
          if (resp.data && resp.data.length > 0) {
            const data = resp.data.map(i => {
              return {
                ...i,
                scopedSlots: { icon: i.type }
              };
            });
            treeNode.dataRef.children = data;
            this.TreeDataResp = [...this.TreeDataResp];
          } else {
            treeNode.dataRef.isLeaf = true;
            this.TreeDataResp = [...this.TreeDataResp];
          }
          this.dataSource = [];
          this.flatten(JSON.parse(JSON.stringify(this.TreeDataResp)));
          resolve();
        });
      });
    },
    /**
     * @method 穿梭框的改变事件
     * @desc 解释说明
     * @return {type} 无返回
     */
    onChange(targetKeys) {
      if (targetKeys.length > 1 && !this.isMulti) {
        this.checkedNodeKeys = [];
        return this.$message.error('只能选择一个人');
      }
      this.targetKeys = targetKeys.filter(item => {
        return this.isUserSelect(item);
      });
      this.checkedNodeKeys = [];
    },
    /**
     * @method 树上的选择事件，这是为了把所有选中的都放入右侧
     * @desc 解释说明
     * @return {type} 无返回
     */
    onChecked(_, e, checkedKeys, itemSelect) {
      const { eventKey, dataRef } = e.node;
      if (dataRef.children && dataRef.children.length > 0) {
        dataRef.children.forEach(item => itemSelect(item.key, !this.isChecked(checkedKeys, item.key)));
        return;
      }
      itemSelect(eventKey, !this.isChecked(checkedKeys, eventKey));
    },
    /**
     * @method 对话框的确定事件
     * @desc 解释说明
     * @return {type} 无返回
     */
    handleOk() {
      this.visible = false;
      const options = [];
      for (let i = 0; i < this.targetKeys.length; i++) {
        const item = this.targetKeys[i];
        const dataItem = this.dataSource.find(i => i.key === item);
        options.push(dataItem);
      }
      this.selectOptions = options;
      this.participants = this.targetKeys;
      const JsonValue = {};
      this.$set(JsonValue, 'userIds', this.participants);
      this.$emit('change', JSON.stringify(JsonValue));
    },
    loadUserById(id, callback) {
      api.loadUserById({ id: id }).then(resp => {
        const optionItem = JSON.parse(JSON.stringify(resp.data));
        this.$set(optionItem, 'title', optionItem.name);
        this.$set(optionItem, 'key', optionItem.id);
        callback(optionItem);
      });
    }
  },
  filter: {},
  computed: {
    treeData() {
      return this.handleTreeData(this.TreeDataResp, this.targetKeys);
    }
  },
  watch: {
    'value': {
      handler(val) {
        if (!val) {
          this.valueArray = [];
          return;
        }
        const data = JSON.parse(val);
        if (data.userIds) {
          this.valueArray = data.userIds;
        } else {
          this.valueArray = [];
        }
      },
      immediate: true,
      deep: true
    },
    'valueArray': {
      handler(val) {
        this.participants = val;
        this.targetKeys = val;
        const options = [];
        for (let i = 0; i < this.targetKeys.length; i++) {
          const item = this.targetKeys[i];
          const dataItem = this.dataSource.find(i => i.key === item);
          if (dataItem) {
            options.push(dataItem);
          } else {
            this.loadUserById(this.targetKeys[i], (data) => {
              options.push(data);
            });
          }
        }
        this.selectOptions = options;
      },
      immediate: true,
      deep: true
    },
    'participants': {
      handler() {
        const JsonValue = {};
        this.$set(JsonValue, 'userIds', this.participants);
        this.$emit('change', JSON.stringify(JsonValue));
      },
      // immediate: true,
      deep: true
    },
    'TreeDataResp': {
      handler(val) {
        this.checkedNodeKeys = [...this.targetKeys, ...this.handleTreeCheck(val)];
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped>
.tree-transfer .ant-transfer-list:first-child {
  width: 50%;
  flex: none;
}
.tree-transfer /deep/.ant-transfer-list-body {
  height: 400px;
  overflow: auto;
}
</style>
