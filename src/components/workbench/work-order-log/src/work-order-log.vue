<template>
    <div>
        <div class="stepsAuto" :style="{height:setHeight+'px'}">
            <el-steps direction="vertical" :active="active">
                <el-step :key="index" v-for="(item,index) in dataList">
                    <template slot="icon">
                        <el-image style="width: 42px;height: 42px;border-radius: 42px"
                                  src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                        ></el-image>
                    </template>
                    <template slot="title">
                        <div class="title_head">
                            <div class="title_left">
                                <div class="title_left_h">{{item.creatorName}}</div>
                                <div class="title_left_t">{{item.createDate}}</div>
                            </div>
                            <div class="title_right">
                                <div class="title_right_h">
                                    {{ $getDictLabel('dealStatus',item.operateType) }}
                                </div>
                                <div class="title_right_t">{{item.operateLog}}</div>
                            </div>
                        </div>
                    </template>
                </el-step>
            </el-steps>
        </div>
    </div>
</template>
<script>
export default {
  name: 'workOrderProcessing',
  data () {
    return {
      active: 1,
      dataList: [],
      setHeight: 0
    }
  },
  props: {
    orderId: [Number, String]
  },
  watch: {
    orderId (newVal, oldVal) {
      this.getData()
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      let params = { }
      let orderId = this.orderId
      this.$http.get('/ctc/task/orderHandle/' + orderId, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dataList = res.data
          this.setHeight = res.data.length * 80
          this.active = res.data.length + 1
        }
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="scss">
    .stepsAuto{
        .el-step__icon{
            width: 40px!important;
            height: 40px!important;
        }
        .el-step.is-vertical .el-step__head{
            width: 60px!important;
        }
        .el-step.is-vertical .el-step__line{
            left: 20px!important;
        }
    }
</style>
<style lang="scss" scoped>
    .title_head{
        display: flex;
        .title_left{
            flex: 1;
            .title_left_h{
                color: #303133;
                font-size: 14px;
                height: 35px;
            }
            .title_left_t{
                color: darkgray;
                font-size: 12px;
            }
        }
        .title_right{
            flex: 1;
            .title_right_h{
                font-size: 14px;
                height: 35px;
            }
            .title_right_t{
                color: #303133;
                font-size: 12px;
            }
        }
    }
</style>
