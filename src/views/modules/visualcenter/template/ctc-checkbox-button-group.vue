<template>
  <div class="ctc-checkbox-button-group">
    <el-button size="small" type="primary" @click="initDialog">{{buttonGroupValue.length===0?'点击选择':'点击重新选择'}}</el-button>
    <el-dialog :visible.sync="visible" width="38%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-checkbox-group v-model="value">
        <el-checkbox-button v-if="buttonType === '2'" label="111111" key="111111">项目经理</el-checkbox-button>
        <el-checkbox-button v-if="buttonType === '2'" label="222222" key="222222">项目创建人</el-checkbox-button>
        <el-checkbox-button v-if="buttonType === '2'" label="333333" key="333333">统计时间</el-checkbox-button>
        <el-checkbox-button v-for="data in buttonGroupList" :label="data.normId" :key="data.normId">{{data.normName}}</el-checkbox-button>
      </el-checkbox-group>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">{{ $t('confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcCheckboxButtonGroup',
  data () {
    return {
      visible: false,
      value: []
    }
  },
  props: {
    placeholder: String,
    buttonGroupList: Array,
    buttonGroupValue: Array,
    buttonType: String,
    statisticalDimension: String
  },
  watch: {
  },
  methods: {
    initDialog () {
      if (this.buttonType === '2') {
        if (this.buttonGroupList.length !== 0) {
          this.visible = true
          this.value = this.buttonGroupValue
        } else {
          this.$alert('请先选择报表数据列再进行查询条件', '提示', {
            confirmButtonText: '关闭'
          })
        }
      } else {
        if (this.statisticalDimension) {
          this.visible = true
          this.value = this.buttonGroupValue
        } else {
          this.$alert('请先选择统计维度再进行报表数据列', '提示', {
            confirmButtonText: '关闭'
          })
        }
      }
    },
    cancelHandle () {
      this.visible = false
      this.value = []
    },
    commitHandle () {
      this.visible = false
      this.$emit('watchCheckboxButtonData', { buttonType: this.buttonType, buttonGroupValue: this.value })
    }
  }
}
</script>
<style lang="scss" >
.ctc-checkbox-button-group {
  .el-dialog {
    box-shadow: 0px 0px 25px rgba($color: #000000, $alpha: 0.3);
  }
  .el-dialog__body {
    padding: 0px 20px;
  }
  .el-checkbox-button {
    margin-top: 15px;
    margin-left: 15px;
  }
  .el-checkbox-button__inner {
    border-radius: 0!important;
    width: auto;
    padding: 12px 10px;
    text-align: center;
    font-size: 13px;
    border: 1px solid #DCDFE6;
  }
}
</style>
