<template>
  <a-input placeholder="Basic usage" v-model="inputValue" @input="changeValue" />
</template>

<script>
export default {
  name: 'index',
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
    format: {
      type: String,
      default: '###-####-####'
    }
  },
  components: {},
  watch: {
    value: {
      handler(val) {
        this.outValue = val
      },
      immediate: true
    }
  },
  computed: {
    inputValue: {
      get() {
        return String(this.outValue).slice(0,11)
            .replace(/(?<=\d{3})\d+/, ($0) => '-' + $0)
            .replace(/(?<=[\d-]{8})\d{1,4}/, ($0) => '-' + $0)
      },
      set(v) {
        this.outValue = String(v).replace(/-/g, '');
      }
    }
  },
  data() {
    return {
      outValue: ''
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    changeValue(e) {
      console.log(e, this.inputValue);
      this.outValue = String(this.inputValue).replace(/-/g, '');
      this.$emit('input', this.outValue)
    }
  }
}
</script>

<style scoped>

</style>
