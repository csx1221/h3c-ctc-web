<template>
  <el-dialog :visible.sync="visible" @close="closeToast" width="60%" :title="!dataForm.calculationFormulaId ? $t('add') : $t('update')" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form max-height="480" label-position="right" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="normId" label="指标名称">
        <el-select v-model="dataForm.normId"  filterable placeholder="请选择指标名称" @change="normChange">
          <el-option v-for="item in labelList" :key="item.normId" :label="item.normName" :value="item.normId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="indexClassification" label="指标分类">
        <el-input v-model="dataForm.indexClassification" readonly></el-input>
      </el-form-item>
      <el-form-item prop="statisticalDimension" label="统计维度">
        <el-input v-model="dataForm.statisticalDimension" readonly></el-input>
      </el-form-item>
      <el-form-item prop="defaltCalculationFormula" label="默认计算方式">
        <el-input v-model="dataForm.defaltCalculationFormula" readonly @mouseover.native="overEnter($event)" @mouseout.native="overLeave($event)"></el-input>
      </el-form-item>
      <el-form-item prop="calculationFormula" label="计算方式">
        <div  placeholder="请输入的计算方式" style="padding: 0 15px;border:1px solid rgba(192, 196, 204, 0.37);height: 90px;">
          {{ dataForm.calculationFormula }}
        </div>
        <div style="width: 100%;text-align:right;margin-top: -40px;">
          <el-link type="primary" :underline="false" style="margin-right: 20px;user-select: none;" @click="backClick">退回上一步</el-link><el-link type="primary" :underline="false"  style="margin-right: 20px;user-select: none;"  @click="clearClick">全部清空</el-link>
        </div>
        <el-row :gutter="24">
          <el-col :span="11">
            <fieldset  style="border-color:rgba(192, 196, 204, 0.37);height: 215.65px;">
              <legend>运算符</legend>
              <el-button size="small" @click="handleSignClick" :disabled="disabled" style="margin-left: 10px;width: 50px;margin-top: 10px;">+</el-button>
              <el-button size="small" @click="handleSignClick" :disabled="disabled" style="width: 50px;">-</el-button>
              <el-button size="small" @click="handleSignClick" :disabled="disabled" style="width: 50px;">*</el-button>
              <el-button size="small" @click="handleSignClick" :disabled="disabled" style="width: 50px;">/</el-button>
              <el-button size="small" @click="handleSignClick" :disabled="disabled" style="width: 50px;">%</el-button>
              <el-button size="small" @click="handleSignClick" :disabled="disabled" style="width: 50px;">//</el-button>
              <el-button size="small" @click="handleBracketsClick" :disabled="disabled" style="width: 50px;margin-top: 10px;">(</el-button>
              <el-button size="small" @click="handleBracketsFANClick" style="width: 50px;">)</el-button>
              <el-button size="small" @click="handleSignClick" :disabled="!disabled" style="width: 50px;">,</el-button>
              <el-button size="small" @click="handleHEClick" :disabled="disabled">求和</el-button>
              <el-button size="small" @click="handleHEClick" :disabled="disabled">求平均值</el-button>
              <el-input-number v-model="constVal" size="mini" :precision="2" style="margin-left: 10px;margin-top: 10px;"></el-input-number>
              <el-button size="small" @click="handleConstClick" style="margin-left: 10px;" >添加常量</el-button>
            </fieldset>
          </el-col>
          <el-col :span="13">
            <fieldset style="border-color: rgba(192, 196, 204, 0.37);height: 215.65px;overflow: auto;">
              <legend>参数</legend>
              <el-tree :data="treeData"  @node-click="handleNodeClick"></el-tree>
            </fieldset>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="defaultResultDecimal" label="结果显示">
        <el-checkbox v-model="dataForm.isHavePoint" true-label="1" false-label="0" style="margin-right: 10px;"></el-checkbox>默认保留<el-input-number v-model="dataForm.defaultResultDecimal" :min="1" :max="10"  size="mini"></el-input-number>位小数<br/>
        <el-checkbox v-model="dataForm.percentage" true-label="1" false-label="0" style="margin-right: 10px;"></el-checkbox>计算结果显示为百分比
      </el-form-item>
    </el-form>
    <template slot="footer">
        <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
        <el-button size="small" type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  mixins: [],
  data () {
    return {
      labelList: [],
      visible: false,
      disabled: false,
      constVal: 0,
      signFlag: true,
      nodeFlag: true,
      dataForm: {
        indexClassification: '',
        statisticalDimension: '',
        defaltCalculationFormula: '',
        calculationFormulaId: '',
        normId: '',
        normName: '',
        calculationFormula: '',
        isDefault: '1',
        defaultResultDecimal: '',
        percentage: '0',
        isHavePoint: '0'
      },
      treeData: [],
      scrollTop: 0
    }
  },
  watch: {
  },
  components: {
  },
  created () {
  },
  mounted () {
  },
  computed: {
    dataRule () {
      return {
        normId: [
          { required: true, message: '请选择指标', trigger: 'blur' }
        ],
        calculationFormula: [
          { required: true, message: '请输入计算方式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    overEnter (e) {
      var actualTop = e.target.offsetTop
      var offsetLeft = e.target.offsetLeft
      var current = e.target.offsetParent
      while (current !== null) {
        actualTop += current.offsetTop
        offsetLeft += current.offsetLeft
        current = current.offsetParent
      }
      if (e.target.value.length > 80) {
        this.elTooltipStyle = { left: (offsetLeft + 'px'), top: (actualTop - 54 - this.scrollTop + 'px') }
      } else {
        this.elTooltipStyle = { left: (offsetLeft + 'px'), top: (actualTop - 40 - this.scrollTop + 'px') }
      }
      if (e.target.value) {
        this.$ctcSelectTooltip({ title: e.target.value, elTooltipStyle: this.elTooltipStyle })
      }
    },
    overLeave (e) {
      if (e.target.value) {
        this.$ctcSelectTooltip({ title: '关闭浮窗' })
      }
    },
    normChange (val) {
      for (var i = 0; i < this.labelList.length; i++) {
        if (val === this.labelList[i].normId) {
          this.dataForm.indexClassification = this.labelList[i].firstNorm + '>' + this.labelList[i].twoNorm
          if (this.labelList[i].supportDimensions) {
            let s = this.labelList[i].supportDimensions.split(',')
            let s1 = ''
            for (let j = 0; j < s.length - 1; j++) {
              if (s.length - 3 < j) {
                s1 += this.$getDictLabel('support_dimensions', s[j])
              } else {
                s1 += this.$getDictLabel('support_dimensions', s[j]) + ','
              }
            }
            this.dataForm.statisticalDimension = s1
          } else {
            this.dataForm.statisticalDimension = ''
          }
          this.dataForm.defaltCalculationFormula = this.labelList[i].calculationMethod
        }
      }
    },
    backClick (data) {
      // 获取点击对象
      let calculationFormula = this.dataForm.calculationFormula
      for (var i = calculationFormula.length - 1; i >= 0; i--) {
        if (calculationFormula.charAt(i) === ')') {
          for (var j = i - 1; j >= 0; j--) {
            if (calculationFormula.charAt(j) === ')') {
              this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' '))
              break
            } else if (calculationFormula.charAt(j) === '(') {
              if (j < 3) {
                this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' '))
                break
              } else {
                if (calculationFormula.charAt(j - 2) === 'M') {
                  this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' S'))
                  break
                } else if (calculationFormula.charAt(j - 2) === 'G') {
                  this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' A'))
                  break
                } else {
                  this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' '))
                  break
                }
              }
            } else {
              if (j === 0) {
                this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' '))
                break
              }
            }
          }
          break
        } else if (calculationFormula.charAt(i) === '(' && calculationFormula.charAt(i - 2) === 'M') {
          this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' S'))
          this.disabled = false
          break
        } else if (calculationFormula.charAt(i) === '(' && calculationFormula.charAt(i - 2) === 'G') {
          this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' A'))
          this.disabled = false
          break
        } else if (calculationFormula.charAt(i) === ',') {
          this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' '))
          this.disabled = true
          break
        } else {
          this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' '))
          break
        }
      }
      this.signFlag = true
      this.nodeFlag = true
    },
    clearClick () {
      // 获取点击对象
      this.dataForm.calculationFormula = ''
      this.signFlag = true
      this.nodeFlag = true
      this.disabled = false
    },
    handleConstClick () {
      let x = this.constVal.toString().indexOf('.') + 1
      let y = this.constVal.toString().length - x
      if (x === 0) {
        if (!this.nodeFlag) {
          this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' ')) + ' ' + this.constVal + '.00'
        } else {
          this.dataForm.calculationFormula += ' ' + this.constVal + '.00'
        }
      } else {
        if (y === 1) {
          if (!this.nodeFlag) {
            this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' ')) + ' ' + this.constVal + '0'
          } else {
            this.dataForm.calculationFormula += ' ' + this.constVal + '0'
          }
        } else {
          if (!this.nodeFlag) {
            this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' ')) + ' ' + this.constVal
          } else {
            this.dataForm.calculationFormula += ' ' + this.constVal
          }
        }
      }
      this.nodeFlag = false
      this.signFlag = true
    },
    handleBracketsClick (event) {
      this.dataForm.calculationFormula += ' ' + event.target.innerText
      this.signFlag = true
      this.nodeFlag = true
    },
    handleBracketsFANClick (event) {
      this.dataForm.calculationFormula += ' ' + event.target.innerText
      this.disabled = false
      this.signFlag = true
      this.nodeFlag = true
    },
    handleHEClick (event) {
      let text
      if (event.target.innerText === '求和') {
        text = 'SUM ('
      } else if (event.target.innerText === '求平均值') {
        text = 'AVG ('
      } else {
        text = event.target.innerText
      }
      this.disabled = true
      this.dataForm.calculationFormula += ' ' + text
      this.signFlag = true
      this.nodeFlag = true
    },
    handleNodeClick (data) {
      // 获取点击对象
      if (this.nodeFlag || this.dataForm.calculationFormula === '') {
        this.dataForm.calculationFormula += ' ' + data.label
        this.nodeFlag = false
        this.signFlag = true
      } else {
        this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' ')) + ' ' + data.label
      }
    },
    handleSignClick (event) {
      if (this.signFlag || this.dataForm.calculationFormula === '') {
        this.dataForm.calculationFormula += ' ' + event.target.innerText
        this.signFlag = false
        this.nodeFlag = true
      } else {
        this.dataForm.calculationFormula = this.dataForm.calculationFormula.substring(0, this.dataForm.calculationFormula.lastIndexOf(' ')) + ' ' + event.target.innerText
      }
    },
    init () {
      this.getLabelList()
      this.getTreeData()
      this.visible = true
      this.constVal = 0
      this.signFlag = true
      this.nodeFlag = true
      this.$nextTick(() => {
        this.dataForm.percentage = '0'
        this.dataForm.isHavePoint = '0'
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.calculationFormulaId) {
          this.getInfo()
        } else {
          this.dataForm.normName = ''
        }
      })
    },
    getTreeData () {
      for (var i = 0; i < this.labelList.length; i++) {
        this.treeData.push({ label: this.labelList[i].normName })
      }
    },
    // 获得指标库列表
    getLabelList () {
      this.$http.get('/ctc/visualization/indexLibrary/getIndexLibraryList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.labelList = res.data
          this.getTreeData()
        }
      }).catch(() => { })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/ctc/visualization/formula/getFormulaById/${this.dataForm.calculationFormulaId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = { ...this.dataForm, ...res.data }
        if (res.data.percentage === 1) {
          this.dataForm.percentage = '1'
        }
        if (res.data.isHavePoint === 1) {
          this.dataForm.isHavePoint = '1'
        }
      }).catch(() => { })
    },
    getStrCount (scrstr, armstr) {
      let count = 0
      while (scrstr.indexOf(armstr) !== -1) {
        scrstr = scrstr.replace(armstr, '')
        count++
      }
      return count
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        let length1 = this.getStrCount(this.dataForm.calculationFormula, '(')
        let length2 = this.getStrCount(this.dataForm.calculationFormula, ')')
        if (length1 !== length2) {
          return this.$message.error('计算公式有误，请调整！')
        }
        this.$http[!this.dataForm.calculationFormulaId ? 'post' : 'post'](!this.dataForm.calculationFormulaId ? '/ctc/visualization/formula/saveFormula' : '/ctc/visualization/formula/updateFormula', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    closeToast () {
      this.dataForm.percentage = '0'
      this.dataForm.isHavePoint = '0'
      this.$refs['dataForm'].resetFields()
    }
  }
}
</script>
