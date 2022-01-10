/**
 * @description 这是一个switch，确认的值为1，否则值为0
 * 可自定义确认的值和取消的值
 */
import S from 'ant-design-vue/es/switch/index';
export default {
  name: 'HSwitch',
  props: Object.assign({}, S.props, {
    value: {
      type: [String, Boolean, Number],
      default: 0,
      require: true
    },
    activeValue: {
      type: [String, Boolean, Number],
      default: 1
    },
    inactiveValue: {
      type: [String, Boolean, Number],
      default: 0
    }
  }),
  components: {},
  watch: {
    'value': {
      handler(val) {
        this.isCheck = val === this.activeValue
      },
      immediate: true
    }
  },
  data() {
    return {
      isCheck: false
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    onChange(checked) {
      this.$emit('input', checked ? this.activeValue : this.inactiveValue)
      this.$emit('change', checked ? this.activeValue : this.inactiveValue)
    }
  },
  render() {
    const props = {}
    Object.keys(S.props).forEach(k => {
      if (k === 'value') {
        props[k] = this.$data.isCheck;
        return props[k];
      }
      this[k] && (props[k] = this[k]);
      return props[k];
    });
    return (
      <a-switch {...props} v-model={this.isCheck} onChange={(val) => this.onChange(val)} />
    )
  }
}