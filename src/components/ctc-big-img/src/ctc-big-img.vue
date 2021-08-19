<template>
  <!-- 过渡动画 -->
  <transition name="fade">
    <div class="ctc-big-img">
      <div class="close-layer" @click="bigImg"><i class="el-icon-close"></i></div>
      <div class="imgClass"><img :src="ctcBigImgSrc" /></div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'CtcBigImg',
  props: {
    ctcBigImgSrc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    bigImg () {
      this.$emit('doCloseBigImg')
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-big-img {
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: block;
  z-index: 1200;
  .close-layer {
    position: fixed;
    top: 1%;
    right: 1%;
    z-index: 1300;
    font-size: 40px;
    color: #fff;
    cursor: pointer;
    transition: all 1.2s ease-in-out;
    -webkit-transition: all 1.2s ease-in-out;
    -moz-transition: all 1.2s ease-in-out;
    -o-transition: all 1.2s ease-in-out;
  }
  .close-layer:hover {
    transform: rotate(270deg);
    -webkit-transform: rotate(270deg);
    -moz-transform: rotate(270deg);
    -o-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
  }
  .imgClass {
    padding-top: 1%;
    padding-left: 4%;
    padding-right: 4%;
    padding-bottom: 1%;
    overflow-y: auto;
    text-align: center;
    img {
      max-width: 100%;
      max-height: 100%;
      margin: auto auto;
    }
  }
}
</style>
