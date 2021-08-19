<template>
  <div class="mt-input__ranger" :class="{'mt-input__ranger-mini': size==='mini', 'mt-input__ranger-middle': size==='middle', 'mt-input__ranger-large': size==='large', 'is-focus': isFocus, 'is-required': isRequired}">
    <span class="pre-label">
      <img v-if="preLabelIcon" :src="preLabelIcon" alt="">
    </span>
    <div class="pre-wrapper">
      <input type="text"
         :placeholder="prePlaceholder"
         v-model="numberChange[0]"
         @input="numberInput"
         @focus="isFocus = true"
         @blur="isFocus = false"
         @keyup=" $event.currentTarget.value = $event.currentTarget.value.replace(/[^\d]/g, '')"
      >
    </div>
    <span class="connect">{{connectText}}</span>
    <div class="append-wrapper">
      <input type="text"
         :placeholder="appendPlaceholder"
         v-model="numberChange[1]"
         @input="numberInput"
         @focus="isFocus = true"
         @blur="isFocus = false"
             @keyup=" $event.currentTarget.value = $event.currentTarget.value.replace(/[^\d]/g, '')"
      >
    </div>
    <div class="clear-wrapper" v-if="numberChange.length>0">
      <span class="clear" @click="clear()">&times;</span>
    </div>
    <div v-if="isRequired" class="el-form-item__error">
      起始数值不能大于截止数值
    </div>
  </div>
</template>
<script>
export default {
  name: 'CtcInput',
  data () {
    return {
      numberRange: [],
      isFocus: false,
      isRequired: false
    }
  },
  props: {
    size: { type: String, default: 'middle' },
    preLabelIcon: { type: String, default: '' },
    prePlaceholder: { type: String, default: '请输入起始数值' },
    connectText: { type: String, default: '至' },
    appendPlaceholder: { type: String, default: '请输入截止数值' },
    value: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    numberChange () {
      let self = this
      self.numberRange = self.value
      if (Number(self.numberRange[0]) > Number(self.numberRange[1])) {
        self.isRequired = true
      } else {
        self.isRequired = false
      }
      return self.numberRange
    }
  },
  mounted () {
    let self = this
    self.numberRange = self.value
  },
  methods: {
    numberInput (ev) {
      let self = this
      self.$emit('input', self.numberRange)
    },
    clear () {
      let self = this
      self.numberRange = []
      self.$emit('input', self.numberRange)
    }
  }
}
</script>
<style scoped>
  input {
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    display: block;
    text-align: center;
    box-sizing: border-box;
  }

  :-moz-placeholder {
    color: #C0C4CC;
  }

  ::-moz-placeholder {
    color: #C0C4CC;
  }

  input:-ms-input-placeholder {
    color: #C0C4CC;
  }

  input::-webkit-input-placeholder {
    color: #C0C4CC;
  }

  .mt-input__ranger {
    border: 1px solid #C0C4CC;
    position: relative;
    -webkit-transition: border-color .3s ease 0s;
    transition: border-color .3s ease 0s;
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }

  .mt-input__ranger-mini {
    height: 28px;
    line-height: 28px;
  }

  .mt-input__ranger-middle {
    height: 40px;
    line-height: 40px;
  }

  .mt-input__ranger-large {
    height: 32px;
    line-height: 32px;
  }

  .append-wrapper,
  .pre-wrapper {
    float: left;
    height: 100%;
    width: calc((100% - 70px)/2);
  }

  .pre-label {
    width: 20px;
    height: 100%;
    float: left;
  }

  .pre-label img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .connect {
    float: left;
    width: 20px;
    height: 100%;
    text-align: center;
  }

  .clear-wrapper {
    width: 30px;
    height: 100%;
    position: absolute;
    right: 0;
    text-align: center;
  }

  .clear {
    width: 14px;
    height: 14px;
    background: #C0C4CC;
    border-radius: 8px;
    float: left;
    text-align: center;
    line-height: 14px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    position: absolute;
    left: 50%;
    margin-left: -7px;
    top: 50%;
    margin-top: -7px;
    display: none;
  }

  .clear-wrapper:hover .clear {
    display: block;
  }

  .is-focus {
    border-color: #aaa;
    transition: border-color .3s ease 0s;
  }

  .is-required {
    border: 1px solid #F56C6C;
  }
</style>
