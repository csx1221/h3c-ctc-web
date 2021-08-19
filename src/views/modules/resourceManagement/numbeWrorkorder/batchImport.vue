<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row>
      <ctc-account-file  ref="ctcFileImport"  @watchChildImport="triggerParentPage"></ctc-account-file>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-col :span="12" class="split-line" style="text-align: left">
        导入手机列表
      </el-col>
      <el-col :span="12" align="right">
        <span class="spanList">上传数量：{{ dataList.length }}</span>
        <span class="spanList success">正常数量：{{ normalQuantity }}</span>
        <span class="spanList error">异常数量：{{ abnormalqQuantity }}</span>
        <el-button  v-if="dataList.length > 0"  type="primary"  @click="operation('1')"  size="small"  >批量移除</el-button>
        <el-button  v-if="abnormalqQuantity !== 0"  type="primary"  @click="operation('2')"  size="small"  >移除异常</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table  stripe  highlight-current-row  v-loading="dataListLoading"  :data="dataList"  border  @selection-change="dataListSelectionChangeHandle"  style="width: 100%">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column  type="index"  label="序号"  width="50"  align="center"></el-table-column>
        <el-table-column prop="number" label="手机号码" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="provinceDefine" label="省份" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="operator" label="运营商" header-align="center" align="center" show-overflow-tooltip >
          <template slot-scope="scope">
            <span v-html="$getDictLabel('operators', scope.row.operator)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="imsi" label="IMSI" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="brand" label="品牌" header-align="center" align="center" show-overflow-tooltip >
          <template slot-scope="scope">
            <span v-html="$getDictLabel('brand', scope.row.brand)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="serviceNo" label="服务密码" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="handler" label="办卡人" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column  prop="descript"  label="备注"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column  prop="dateState"  label="状态"  header-align="center"  align="center">
          <template slot-scope="scope">
            <!-- {{ scope.row.dateState === 1 ? '正常' : '异常' }} -->
            <span :title="scope.row.errMsg" :class="{'spanList error':scope.row.dateState===2,'spanList success':scope.row.dateState===1}" v-html="scope.row.dateState===1?'正常':'异常'"></span>
          </template>
        </el-table-column>
        <el-table-column  prop="errMsg"  label="信息"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column  label="操作"  header-align="center"  align="center">
          <template slot-scope="scope">
            <!-- <el-button  @click="deleteOperate(scope.$index)"  type="text"  size="small"  >删除</el-button> -->
            <el-button @click="edit('编辑', '1', scope.row,scope.$index)" type="text" size="small">编辑</el-button>
            <el-button @click="createConfig('删除','2',scope.row,scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div style="text-align: center; margin-top: 20px">
      <el-button type="info" size="small" @click="$emit('close')">取消</el-button>
      <el-button v-if="dataList.length>0" type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
    </div>
    <!-- 编辑 -->
    <updata-list v-if="updatasVsible" ref="addOrUpdata1" @refresh="updataList" @init="updatasVsible = false"></updata-list>
  </el-card>
</template>

<script>
// import mixinViewModule from '@/mixins/view-module'
// import ctcUtils from '@/utils/ctc-utils.js'
import updataList from './updataList'
/* eslint-disable */
export default {
  name: "batchImport",
  components: {
    updataList
  },
  data() {
    return {
      addOrUpdataVisible: false,
      updatasVsible: false,
      dataListLoading: false,
      ctcFileImport: false,
      normalQuantity: 0, // 正常数量
      abnormalqQuantity: 0, // 异常数量
      dataListSelections: "",
      dataForm: {
        fileId: "",
      },
      dataRule: {
        fileId: [{ required: true, message: "请上传附件", trigger: "change" }],
      },
      dataList: [],
      // list:[
      //   // cardNumberId:0
      // ]
      dataList: []
    };
  },
  props: {
    // 选中列表
    type: String,
  },
  watch: {
    dataList(newVal, oldVal) {
      this.normalQuantity = this.dataList.filter((obj) => obj.dateState !== 2).length;
      this.abnormalqQuantity = this.dataList.length - this.normalQuantity;
    },
  },
  computed: {},
  mounted() {
    this.initFileImport();
  },
  methods: {
    // 多选
    dataListSelectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 操作
    operation(type) {
      // 1 批量移除 2 移除异常
      if (type === "1") {
        this.$confirm('是否删除选中项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.dataListSelections.length !== 0) {
            this.dataList = [...this.dataList].filter((x) =>
              [...this.dataListSelections].every((y) => y !== x)
            );
          } else {
            this.$message.warning("请选择需要移除项！！！");
          }
          this.$message.success("删除成功")
        })
      } else if (type === "2") {
        this.dataList = this.dataList.filter((obj) => obj.dateState !== 2);
      }
    },
    edit(title, type, row, index) {
      this.updatasVsible = true
      console.log(this.$refs);
        this.$nextTick(() => {
          this.$refs.addOrUpdata1.init(title, type, row, index)
        })
    },
    createConfig (title, type, data, index) {
    //   if (type === '1') {
    //     console.log(123);
    //     this.updatasVsible = true
    //     this.$nextTick(() => {
    //       this.$refs.addOrUpdata1.init(title, type, data, index)
    //     })
    //   } else 
      if (type === '2') {
        this.$confirm('是否删除该授权?', '提示', {
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.dataList.splice(index, 1)
          this.validateForm()
          this.$message.success("删除成功")
        })
      }
    },
    deleteOperate(index) {
      this.dataList.splice(index, 1)
    },
    submitResult(res) {
      if (this.abnormalqQuantity > 0) {
        this.$message.warning("请处理异常列表");
      } else if (this.dataList.length === 0) {
        this.$message.warning("数据为空，请先添加数据");
      } else {
        this.submitData();
        }
      console.log(res);
    },
    // submitData() {
    //   let thisvm = this;
    //   // 默认先清空目录树缓存数据
    //   thisvm.$ctcLoading.open();
    //     thisvm.$http.post("/ctc/resource/activiti/cardnumber/saveBatch", { list: this.dataList }).then(({ data: res }) => {
    //       thisvm.$ctcLoading.close();
    //       if (res.code !== 0) {
    //         return thisvm.$message.error(res.msg);
    //       }
    //       this.$message.success("提交成功");
    //       this.$emit("close", res.data);
    //       console.log(this.dataList);
    //       let _ = require('lodash')
    //       this.dataList=_.uniqBy(res.data, 'number')
    //       // this.dataList=res.data
    //       console.log('0122', this.dataList);
    //     })
    //     .catch(() => {
    //       thisvm.$ctcLoading.close();
    //     });
    // },
    submitData () {
      // 07081017
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let fromList = []
      let dataList = this.dataList
      for (let i = 0; i < dataList.length; i++) {
        let node = {}
        node.number = dataList[i].number
        node.imsi = dataList[i].imsi
        node.platform = '1'
        node.state = dataList[i].state
        node.applicationId = dataList[i].applicationId
        node.platformDefine = dataList[i].platformDefine
        node.serviceNo = dataList[i].serviceNo
        node.province = dataList[i].province
        node.provinceDefine = dataList[i].provinceDefine
        node.city = dataList[i].city
        node.cityDefine = dataList[i].cityDefine
        node.handler = dataList[i].handler
        node.brand = dataList[i].brand
        node.monthlyFee = dataList[i].monthlyFee
        node.blance = dataList[i].blance
        node.score = dataList[i].score
        node.owner = dataList[i].owner
        node.contract = dataList[i].contract
        node.descript = dataList[i].descript
        node.creator = dataList[i].creator
        node.creatorName = dataList[i].creatorName
        fromList.push(node)
      }
      // let params = { CardNumberImportBatchDto: this.dataList }
      // console.log(params)
      thisvm.$http.post('/ctc/resource/activiti/cardnumber/saveBatch', { list: this.dataList }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        // console.log(res.data);
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        this.$message.success('提交成功')
        let _ = require('lodash')
        this.dataList=_.uniqBy(res.data, 'number')
        // console.log(this.dataList);
        this.$emit('close', this.dataList)
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    initFileImport () {
      let fileImportParams = { 'templateData': { 'fileName': '资源号码模板下载' }, 'uploadData': {} }
      fileImportParams.templateUrlLocal = '/files/cardNumberImportTemplate.xlsx'
      fileImportParams.uploadUrl = '/ctc/resource/activiti/cardnumber/importBatch'
      this.$refs.ctcFileImport.fileImportParams = { ...fileImportParams }
      this.$refs.ctcFileImport.init()
    },
    updataList ($index, dataForm) {
      this.dataList.splice($index, 1, dataForm)
      this.validateForm()
    },
    // 校验对应属性重复
    validateRepeat (list, key) {
      // 根据指定字段去重
      console.log(1)
      const r = list.reduce((all, next) => all.some((atom) => atom[key] === next[key]) ? all : [...all, next], [])
      var newArr = list.filter(el => !r.includes(el))
      for (let i = 0; i < list.length; i++) {
        if (newArr.length > 0) {
          for (let j = 0; j < newArr.length; j++) {
            if (list[i][key] === newArr[j][key]) {
              // this.dataList[i].exception[key] = true
              this.dataList[i].dateState = 2
            }
          }
        } else {
          this.dataList[i].exception[key] = false
        }
      }
    },
    validateForm () {
      let thisvm = this
      let vars = {}
      thisvm.$ctcLoading.open()
      console.log(thisvm.dataList)
      for (let i = 0; i < thisvm.dataList.length; i++) {
        let varname = 'let' + i
        vars[varname] = new Promise((resolve, reject) => {
          thisvm.validateData(i, thisvm.dataList[i], resolve, reject)
        })
      }
      Promise.all(Array.from(vars)).then(() => {
        thisvm.$ctcLoading.close()
      })
    },
    validateType () {
      this.validateRepeat(this.dataList, 'number')
    },
    validateData ($index, item, resolve, reject) {
      let thisvm = this
      let params = { ...item }
      thisvm.$http.post('/ctc/resource/activiti/cardnumber/update', params).then(({ data: res }) => {
        if (res.code !== 0) {
          return resolve(false)
          // return thisvm.$message.error({ message: res.msg, duration: 8000 })
        }
        thisvm.dataList.splice($index, 1, res.data)
        thisvm.validateType()
        resolve(true)
      }).catch(() => {
        resolve(false)
      })
    },
    triggerParentPage(res) {
      this.dataList = res.data.list || [];
    }
  },
};
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
}
.spanList {
  margin: 0 10px;
}
.success {
  color: #409eff;
}
.error {
  color: #f56c6c;
}
</style>
