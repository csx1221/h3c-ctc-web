<template>
  <el-row>
    <el-col :span="24" class="project-plan" :style="{height:(dataObject.height-60)+'px'}" @mouseenter.native="enterOrLeave(1)" @mouseleave.native="enterOrLeave(2)">
      <ul class="title">
        <li style="width:9%;">排名</li>
        <li style="width:30%;">项目名称</li>
        <li style="width:19%;">项目进度</li>
        <li style="width:19%;">项目质量</li>
        <li style="width:23%;">创建时间</li>
      </ul>
      <ul ref="ulData" class="data">
        <template v-for="(item,index) in currScrollData">
          <li :key="index+item.key*1" style="width:9%;">{{item.indexNo}}</li>
          <li :key="index+item.key*2" style="width:30%;color:#00c0ff;cursor:pointer;" @click="doProjectDrill(item)">{{item.projectName}}</li>
          <li :key="index+item.key*3" style="width:19%;">{{item.projectProgress}}%</li>
          <li :key="index+item.key*4" style="width:19%;">{{item.projectQuality}}%</li>
          <li :key="index+item.key*5" style="width:23%;">{{item.createDate}}</li>
        </template>
      </ul>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'ProjectMassPlan',
  props: {
    dataObject: Object
  },
  data () {
    return {
      switchIntervalDraw: 0,
      recordReloadIndex: 0, // 记录重新加载次数
      projectPlanData: [],
      currScrollData: [], // 当前滚动数据
      panEnterLeave: true
    }
  },
  watch: {
    'dataObject': {
      deep: true,
      handler: function (newVal, oldVal) {
        // console.info('newVal==ProjectMassPlan==' + JSON.stringify(newVal))
        if (newVal.reloadIndex > this.recordReloadIndex) {
          this.recordReloadIndex = newVal.reloadIndex
          let projectPlanData = newVal.projectPlanData
          projectPlanData.map((item, index) => {
            item.key = Math.random()
            item.indexNo = index + 1
          })
          this.projectPlanData = projectPlanData
          this.loadProjectPlanData()
        }
      }
    }
  },
  computed: {},
  mounted () { },
  methods: {
    enterOrLeave (type) {
      if (type === 1) {
        this.panEnterLeave = false
      } else {
        this.panEnterLeave = true
      }
    },
    loadProjectPlanData () {
      let thisvm = this
      let time = thisvm.dataObject.bigScreenTime / this.projectPlanData.length
      time = time < 3000 ? 3000 : time
      time = time > 5000 ? 5000 : time
      thisvm.$nextTick(() => {
        clearInterval(thisvm.switchIntervalDraw)
        thisvm.switchIntervalDraw = setInterval(function () {
          if (thisvm.panEnterLeave) {
            thisvm.init(1)
          }
        }, time)
      })
      thisvm.init(0)
    },
    init (type) {
      if (type === 1) {
        this.projectPlanData.push(this.projectPlanData[0])
        this.projectPlanData.shift()
      }
      let data = Object.assign([], this.projectPlanData)
      let len = data.length > 5 ? 5 : data.length
      this.currScrollData = data.splice(0, len)
    },
    doProjectDrill (item) {
      this.$router.push({
        name: 'projectchildrenpage',
        params: { 'projectId': item.projectId, 'projectName': item.projectName, 'pageSource': 1, 'random': Math.random() }
      })
    }
  },
  destroyed () {
    clearInterval(this.switchIntervalDraw)
  }
}
</script>
<style lang="scss" scoped>
.project-plan {
  padding-left: 5px;
  padding-right: 5px;
  overflow: hidden;
  ul.title {
    padding: 0px 0px 5px 5px;
    box-shadow: inset 0px 0px 10px 0px rgba(27, 185, 255, 0.44);
    border-radius: 4px 4px 0px 0px;
    height: 35px;
    li {
      list-style: none;
      float: left;
      width: 20%;
      color: #fff;
      height: 35px;
      line-height: 35px;
      vertical-align: middle;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  ul.data {
    padding: 0px 0px 5px 5px;
    margin-top: -4px;
    li {
      list-style: none;
      float: left;
      color: #fff;
      height: 30px;
      line-height: 30px;
      vertical-align: middle;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      border-bottom: 1px solid rgba(27, 185, 255, 0.44);
    }
  }
}
</style>
