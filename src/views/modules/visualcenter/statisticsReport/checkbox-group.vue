<template>
  <div class="checkbox-group">
    <el-dialog :visible.sync="visible" width="38%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-checkbox-group v-model="value">
        <el-checkbox v-for="data in checkboxGroupList" :label="data.normId" :key="data.normId">{{data.normName}}</el-checkbox>
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
  name: 'checkbox-group',
  data () {
    return {
      visible: true,
      value: []
    }
  },
  props: {
    placeholder: String,
    checkboxGroupList: Array,
    checkboxGroupValue: Array
  },
  watch: {
  },
  methods: {
    initDialog () {
      this.visible = true
      this.value = this.checkboxGroupValue
    },
    cancelHandle () {
      this.visible = false
    },
    commitHandle () {
      this.visible = false
      this.$emit('watchCheckboxGroupData', { columnSetUpDataValue: this.value })
    }
  }
}
</script>
<style lang="scss" >
.checkbox-group {
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
  .el-checkbox {
    margin-top: 15px;
  }
}
</style>
