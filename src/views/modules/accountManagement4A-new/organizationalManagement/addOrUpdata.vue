<template>
    <div>
        <el-row>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="160px">
                <el-col :span="24">
                    <el-form-item label="上级组织：">
                        <el-input disabled v-model="name" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item :label="type==='1'||type==='2-2'?'项目组名称：':'部门名称：'" prop="orgName">
                        <el-input v-model="dataForm.orgName" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="type==='2-2'">
                    <el-form-item label="部门：" prop="parentId">
                        <ctc-project-team v-model="dataForm.parentId" :props="{lv:'1'}"></ctc-project-team>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="项目经理：">
                        <ctc-organ-handler v-model="dataForm.userIdList" :nameList1="nameList" placeholder="选择项目经理"></ctc-organ-handler>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item :label="type==='1'||type==='2-2'?'项目组描述：':'部门描述：'" prop="orgDesc">
                        <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm.orgDesc"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <div align="center">
            <el-button type="primary" size="small" @click="$emit('close')">取消</el-button>
            <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'accountApplication',
  data () {
    return {
      dataForm: {
        id: '',
        orgName: '',
        orgDesc: '',
        lv: 1,
        parentId: '',
        userIdList: []
      },
      nameList: [],
      dataRule: {
        orgName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        userIdList: [
          { type: 'array', required: true, message: '请至少选择一个项目经理', trigger: 'blur' },
          { type: 'array', required: true, message: '请至少选择一个项目经理', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    reviewData: Object,
    name: String,
    type: String
  },
  watch: {
    // 'dataForm.userIdList' (newVal, oldVal) {
    //   this.dataRule.userIdList = [
    //     { type: 'array', required: true, message: '请至少选择一个项目经理', trigger: 'blur' },
    //     { type: 'array', required: true, message: '请至少选择一个项目经理', trigger: 'change' }
    //   ]
    // }
  },
  computed: {},
  mounted () {
    if (Object.keys(this.reviewData).length !== 0) {
      let thisvm = this
      Object.keys(thisvm.reviewData).forEach(function (key) {
        Object.keys(thisvm.dataForm).forEach(function (key1) {
          if (key === key1) {
            if (thisvm.reviewData[key] === null) {
              thisvm.dataForm[key1] = ''
            } else {
              thisvm.dataForm[key1] = thisvm.reviewData[key]
            }
          }
        })
      })
      if (thisvm.reviewData.managerList && thisvm.reviewData.managerList.length > 0) {
        for (let i = 0; i < thisvm.reviewData.managerList.length; i++) {
          thisvm.dataForm.userIdList.push(
            {
              loginName: thisvm.reviewData.managerList[i].loginName,
              userId: thisvm.reviewData.managerList[i].userId
            }
          )
          let node = {}
          node.id = thisvm.reviewData.managerList[i].userId
          node.realName = thisvm.reviewData.managerList[i].realName
          node.username = thisvm.reviewData.managerList[i].userName
          node.loginName = thisvm.reviewData.managerList[i].loginName
          thisvm.nameList.push(node)
        }
      }
    }
  },
  methods: {
    submitResult (res) {
      let thisvm = this
      thisvm.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (thisvm.dataForm.userIdList) {
            thisvm.$confirm('变更项目经理会同时变更其账号所在项目组，请确认是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              thisvm.submitForm()
            }).catch(() => {
            })
          } else {
            thisvm.submitForm()
          }
        } else {
          return false
        }
      })
    },
    submitForm () {
      this.$ctcLoading.open()
      this.dataList = []
      let params
      if (this.type === '2-2') {
        let { parentId, ...param } = this.dataForm
        params = { parentId: Array.isArray(this.dataForm.parentId) ? this.dataForm.parentId[1] : this.dataForm.parentId, ...param }
      } else {
        params = { ...this.dataForm }
      }
      this.$http.post(this.dataForm.id ? '/account4a/organize/manager/update' : '/account4a/organize/manager/add', params).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message.success('操作成功')
          if (this.type === '2-2') {
            if (this.reviewData.parentId !== this.dataForm.parentId) {
              this.$emit('close', 'refresh', this.reviewData.parentId)
            } else {
              this.$emit('close', 'refresh', this.dataForm.parentId)
            }
          } else {
            this.$emit('close', 'refresh')
          }
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    }
  }
}
</script>

<style scoped>

</style>
