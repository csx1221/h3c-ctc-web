<template>
    <div>
        <el-row>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="160px">
                <el-col :span="12">
                    <el-form-item label="机构名称：" prop="orgName">
                        <el-input v-model="dataForm.orgName" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="type==='2-2'">
                    <el-form-item label="部门：" prop="parentId">
                        <ctc-project-team v-model="dataForm.parentId" :props="{lv:'1'}" :orgId="dataForm.orgId"></ctc-project-team>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="组织机构描述：" prop="orgDesc">
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
        orgName: '',
        orgDesc: '',
        lv: 1,
        parentId: ''
      },
      dataRule: {
        orgName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
          // ,
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    reviewData: Object,
    type: String
  },
  computed: {},
  mounted () {
    if (Object.keys(this.reviewData).length !== 0) {
      this.dataForm = JSON.parse(JSON.stringify(this.reviewData))
      console.log(this.reviewData)
    }
  },
  methods: {
    submitResult (res) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.submitForm()
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
        params = { parentId: Array.isArray(this.dataForm.parentId) ? this.dataForm.parentId[0] : this.dataForm.parentId, ...param }
      } else {
        params = { ...this.dataForm }
      }
      this.$http.post(this.dataForm.id ? '/account4a/organize/update' : '/account4a/organize/add', params).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message.success('操作成功')
          console.log(1)
          if (this.type === '2-2') {
            if (this.reviewData.parentId !== this.dataForm.parentId) {
              this.$emit('close', 'refresh', this.reviewData.parentId)
            } else {
              this.$emit('close', 'refresh')
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
