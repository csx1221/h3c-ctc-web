<!--ren-->
<template>
  <div class='resize-wrap' ref='resize_wrap'>
    <div class='resize-list resize-left'>
      <slot name='split_left'>
        <!--左侧内容-->
      </slot>
      <div class='drag-bar' v-dragEnable="{'params':params}"></div>
    </div>
    <!--右侧-->
    <div class='resize-list resize-right'>
      <slot name='split_right'>
        <!--右侧内容-->
      </slot>
    </div>
  </div>
</template>

<script>
import dragEnable from './dragEnable'
export default {
  name: 'SplitBar',
  data () {
    return {
      params: {
        node_wrap: '', // 最外节点
        visualFlag: false,
        maxWidth: '',
        minWidth: ''
      }
    }
  },
  props: {
    visual: Boolean,
    max: Number,
    min: Number
  },
  directives: {
    dragEnable
  },
  mounted () {
    this.getWrapWidth()
  },
  methods: {
    getWrapWidth () {
      this.params.visualFlag = this.visual
      this.params.maxWidth = this.max
      this.params.minWidth = this.min
      this.params.node_wrap = this.$refs['resize_wrap']
    }
  }
}
</script>

<style scoped>
.resize-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  box-sizing: border-box;
}

.resize-list {
  position: relative;
  box-sizing: border-box;
}

.resize-left {
  width: 20%;
  padding-right: 6px;
  padding-left: 5px;
}
.resize-right {
  width: 80%;
}
.drag-bar {
  position: absolute;
  right: 0;
  top: 0;
  width: 6px;
  height: 100%;
  cursor: col-resize;
}

.drag-bar:after {
  content: '';
  display: block;
  position: absolute;
  width: 2px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
  transform: scaleX(0.5);
  background: #d5d5d3;
  background: linear-gradient(
    rgba(213, 213, 211, 0.2),
    rgba(213, 213, 211, 1),
    rgba(213, 213, 211, 0.2)
  ); /* 标准的语法 */
}
</style>
