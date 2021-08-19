<template>
    <div class="bcw task">
        <el-row>
            <el-col :span="12">
                <div class="task-left-top">
                    <div class="task-left-top-img">
                        <img src="../../../assets/img/upload.png" alt="">
                    </div>
                    <div class="task-left-top-text">
                        <p class="task-left-top-text-top">我参与的任务</p>
                        <p class="task-left-top-text-bottom">累计至本月</p>
                    </div>
                </div>
                <div class="task-left-bottom">
                    <div class="task-left-bottom-title">
                        {{taskNumber}}
                        <sub class="task-left-bottom-title-sub red" v-if="isUp"><i class="task-left-bottom-title-sub-arrow">↑</i>{{upOrDownNumber}}</sub>
                        <sub class="task-left-bottom-title-sub green" v-if="!isUp"><i class="task-left-bottom-title-sub-arrow">↓</i>{{upOrDownNumber}}</sub>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="task-right">
                    <template v-for="(item, index) in rightPic">
                        <div class="task-line" :key="index" :style="{height:item+'px'}"></div>
                    </template>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  name: 'task',
  data () {
    return {
      isUp: true,
      taskNumber: 46,
      upOrDownNumber: 2,
      rightPic: [24, 29, 5, 60, 60, 70, 24, 55, 24, 30, 20, 60, 55, 70, 60, 55]
    }
  }
}
</script>

<style scoped lang="scss">
    .task{
        .task-left-top{
            text-align: center;
            .task-left-top-img{
                display: inline-block;
                img{
                    height: 40px;
                }
            }
            .task-left-top-text{
                display: inline-block;
                text-align: left;
                .task-left-top-text-top{
                    font-size: 18px;
                }
                .task-left-top-text-bottom{
                    font-size: 16px;
                    color: #cccccc;
                }
            }
        }
        .task-left-bottom{
            text-align: center;
            padding: 10px 0;
            .task-left-bottom-title{
                font-size: 40px;
                .red{
                    color: red;
                }
                .green{
                    color: green;
                }
                .task-left-bottom-title-sub{
                    font-size: 16px;
                    .task-left-bottom-title-sub-arrow{
                        position: relative;
                        top: -2px;
                        right: 2px;
                        font-size: 16px;
                    }
                }
            }
        }
        .task-right{
            text-align: center;
            .task-line{
                display: inline-block;
                width: 2px;
                background-color: #26B99A;
                margin: 60px 4px 0 4px;
            }
        }
    }
</style>
