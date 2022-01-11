/**
 * 需要实现的功能有3个
 * 1.超长的数据带有tooltip，ellipsis和showOverflowTooltip同为true时生效
 * 2.默认没有分页
 * 3.默认生成index，type: index时生效
 */
import T from 'ant-design-vue/es/table/Table';

export default {
  name: 'HTable',
  data() {
    return {
      localDataSource: this.dataSource,
      localPagination: this.pagination
    }
  },
  props: Object.assign({}, T.props,{
    pagination: {
      type: [Object, Boolean],
      default: false,
    }
  }),
  watch: {
    dataSource(val) {
      this.localDataSource = val;
    },
    pagination(val) {
      this.localPagination = val
    }
  },
  methods: {
    renderColumn() {
      const scopedSlots = {}
      this.columns.forEach(item => {
        if (item.type === 'index') {
          scopedSlots[item.scopedSlots.customRender] = function(props, record, index) {
            return (
              <span slot={item.scopedSlots.customRender}>{ index + 1 }</span>
            );
          }
        }
        if (item.ellipsis && item.showOverflowTooltip) {
          scopedSlots[item.scopedSlots.customRender] = function(props) {
            return (
              // props 就相当于 slot-scope="{title}" 里面的值
              <a-tooltip placement="topLeft" slot={item.scopedSlots.customRender} title={ props }>{ props }</a-tooltip>
            );
          }
        }
      })
      return scopedSlots
    }
  },
  render() {
    const props = {};
    const localKeys = Object.keys(this.$data);
    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`;
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey];
        return props[k];
      }
      this[k] && (props[k] = this[k]);
      return props[k];
    });
    const table = (
      <a-table
        {...{ props, scopedSlots: { ...this.$scopedSlots, ...this.renderColumn() } }}
        onChange={(pagination, filters, sorter, { currentDataSource }) => {
          this.$emit('change', pagination, filters, sorter, { currentDataSource });
          // this.loadData(pagination);
        }}
        onExpand={(expanded, record) => {
          this.$emit('expand', expanded, record);
        }}
      >
        { Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>)) }
      </a-table>
    );
    return (
      <div class={'default-table'}>
        {table}
      </div>
    )
  }
}