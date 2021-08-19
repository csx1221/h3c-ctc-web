<template>
  <div class="headList">
    <el-row :gutter="10">
      <template v-for="(item, index) in list">
        <el-col :key="index" v-if="item.includes.includes(roleType)">
          <div class="diamond">
            <div class="fl vcenterImg imgfl">
              <div class="imgbac vcenterImg" :style="{backgroundColor:item.iconBac}">
                <img :src="item.icon" alt="" style="width:32px;height:32px;">
              </div>
            </div>
            <div class="fl vcenterContent f1">
              <div>
                <p class="diamondT">{{item.num}}</p>
                <span>{{item.title}}</span>
              </div>
            </div>
          </div>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import zxms from '../../../assets/img/svg/zxms.svg'
import zcxms from '../../../assets/img/svg/zcxms.svg'
import ssxms from '../../../assets/img/svg/ssxms.svg'
import gdzs from '../../../assets/img/svg/gdzs.svg'
import dclgds from '../../../assets/img/svg/dclgds.svg'
import jxzgd from '../../../assets/img/svg/jxzgd.svg'
import yls from '../../../assets/img/svg/yls.svg'
import qxs from '../../../assets/img/svg/qxs.svg'
import dbqxs from '../../../assets/img/svg/dbqxs.svg'
export default {
  name: 'headList',
  data () {
    return {
      imgsrc: 'u4495',
      list: [
        { title: '总项目数', code: 'allProject', num: 0, includes: ['0', '1'], icon: zxms, iconBac: '#269EEE' },
        { title: '在测项目数', code: 'doingProject', num: 0, includes: ['0', '1'], icon: zcxms, iconBac: '#EEAA26' },
        { title: '所属项目数', code: 'proCount', num: 0, includes: ['2', '3'], icon: ssxms, iconBac: '#EEAA26' },
        { title: '工单总数', code: 'orderCount', num: 0, includes: ['1', '2'], icon: gdzs, iconBac: '#26B99A' },
        { title: '待处理工单数', code: 'todoOrderCount', num: 0, includes: ['2'], icon: dclgds, iconBac: '#26B99A' },
        { title: '进行中工单', code: 'doingOrderCount', num: 0, includes: ['1'], icon: jxzgd, iconBac: '#9B59B6' },
        { title: '用例数', code: 'caseCount', num: 0, includes: ['0', '1', '2'], icon: yls, iconBac: '#26B99A' },
        { title: '缺陷数', code: 'defectCount', num: 0, includes: ['0', '1', '2', '3'], icon: qxs, iconBac: '#9B59B6' },
        { title: '待办缺陷数', code: 'tododefectCount', num: 0, includes: ['3'], icon: dbqxs, iconBac: '#9B59B6' }
      ]
    }
  },
  props: {
    roleType: String
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http.get('/ctc/task/homePage/display').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let list = this.list
          for (let i = 0; i < list.length; i++) {
            Object.keys(res.data).forEach(key => {
              if (list[i].code === key) {
                list[i].num = res.data[key]
              }
            })
          }
        }
      }).catch(() => { })
    }
  }
}
</script>

<style scoped lang="scss">
.headList {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 6px;
  .el-row {
    display: flex;
    .el-col {
      flex: 1;
    }
  }
  .diamond {
    height: 120px;
    border-radius: 10px;
    background-color: #ffffff;
    margin-bottom: 10px;
    display: flex;
    border: 1px solid #ebeef5;
    .vcenterImg {
      display: flex;
      align-items: center; /*定义body的元素垂直居中*/
      justify-content: center; /*定义body的里的元素水平居中*/
    }
    .vcenterContent {
      display: flex;
      align-items: center; /*定义body的元素垂直居中*/
    }
    .imgfl {
      width: 100px;
      height: 100%;
      .imgbac {
        height: 60px;
        width: 60px;
        border-radius: 100%;
      }
    }
    .f1 {
      flex: 1;
      .diamondT {
        font-size: 30px;
        margin: 0;
      }
    }
    span {
      color: #cccccc;
      margin-top: 10px;
      display: inline-block;
    }
  }
}
</style>
