<template>
  <div class="el-tooltip__popper is-dark el-fade-in-linear-leave el-fade-in-linear-leave-active select-el-tooltip__popper" :style="elTooltipStyle" x-placement="top">
    {{title}}
    <div x-arrow="" class="popper__arrow" style="left: 50px;"></div>
  </div>
</template>
<script>
export default {
  name: 'CtcSelectTooltip',
  data () {
    return {
      isShow: false
    }
  },
  props: {
    elTooltipStyle: Object,
    title: String
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped>
  .select-el-tooltip__popper{
    transform-origin: center bottom;
    z-index: 3021;
    position: absolute;
    opacity: 1;
  }
</style>
