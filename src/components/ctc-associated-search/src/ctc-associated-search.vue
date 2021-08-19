<template>
  <div v-loading="cookieLoading">
    <div class="top">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-autocomplete @change="searchTo" style="width: 100%;height: 80px;" popper-class="my-autocomplete" custom-item="my-remote" v-model="relatedContent" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" icon="close" @select="handleSelect" :on-icon-click="handleIconClick"></el-autocomplete>
        </el-col>
        <el-col :span="6">
          <el-button @click="searchTo" type="primary" size="small" icon="el-icon-search">搜索</el-button>
          <el-button @click="seniorSearch" type="primary" size="small"><i :class="seniorOff ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i> 高级搜索</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 30px" :gutter="30" v-if="seniorOff">
        <el-form :inline="true" :model="seniorFrom" class="demo-form-inline">
          <el-col :span="8">
            <el-form-item label="模块一">
              <el-input v-model="seniorFrom.moduleLevelOne" placeholder="模块一"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模块二">
              <el-input v-model="seniorFrom.moduleLevelTwo" placeholder="模块二"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模块三">
              <el-input v-model="seniorFrom.moduleLevelThree" placeholder="模块三"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模块四">
              <el-input v-model="seniorFrom.moduleLevelFour" placeholder="模块四"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模块五">
              <el-input v-model="seniorFrom.moduleLevelFive" placeholder="模块五"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <p v-if="!recommended && total !== 0" style="margin-top: 30px;color: #999999">为您查询了{{total}}条</p>
    <h2 v-if="recommended" style="margin-top: 30px">为您推荐</h2>
    <el-row :gutter="50">
      <el-col v-if="!recommended && total === 0" :span="!dialog ? 18 : 24">
        <p style="text-align: center;">
          暂无相关数据
        </p>
      </el-col>
      <el-col v-if="recommended && userBlor" :span="14">
        <p style="text-align: center;">
          暂无相关数据
        </p>
      </el-col>
      <el-col v-loading="loading" v-if="!recommended && total !== 0" :span="!dialog ? 18 : 24">
        <div class="associatedModule" v-for="item in relatedList" :key="item.caseId">
          <div>
            <h2 v-if="!item.highLighter.caseName" class="title">{{item.data.caseName}}</h2>
            <h2 v-else class="title">
              <span v-if="item.data.caseName !== ''">
                <span v-if="!item.highLighter.caseName">
                  {{item.data.caseName}}
                </span>
                <span v-else v-html="item.highLighter.caseName">
                  {{item.highLighter.caseName}}
                </span>
              </span>
            </h2>
            <p v-if="!item.highLighter.moduleLevelOne">
              <span v-if="item.data.moduleLevelOne !== ''">{{ item.data.moduleLevelOne }}</span>
              <span v-if="item.data.moduleLevelTwo !== ''">/{{ item.data.moduleLevelTwo }}</span>
              <span v-if="item.data.moduleLevelThree !== ''">/{{ item.data.moduleLevelThree }}</span>
              <span v-if="item.data.moduleLevelFour !== ''">/{{ item.data.moduleLevelFour }}</span>
              <span v-if="item.data.moduleLevelFive !== ''">/{{ item.data.moduleLevelFive }}</span>
            </p>
            <p v-else>模块名称:
              <span v-if="item.data.moduleLevelOne !== ''">
                <span v-if="!item.highLighter.moduleLevelOne">
                  {{item.data.moduleLevelOne}}
                </span>
                <span v-else v-html="item.highLighter.moduleLevelOne">
                  {{item.highLighter.moduleLevelOne}}
                </span>
              </span>
              <span v-if="item.data.moduleLevelTwo !== ''">
                /
                <span v-if="!item.highLighter.moduleLevelTwo">
                  {{item.data.moduleLevelTwo}}
                </span>
                <span v-else v-html="item.highLighter.moduleLevelTwo">
                  {{item.highLighter.moduleLevelTwo}}
                </span>
              </span>
              <span v-if="item.data.moduleLevelThree !== ''">
                /
                <span v-if="!item.highLighter.moduleLevelThree">
                  {{item.data.moduleLevelThree}}
                </span>
                <span v-else v-html="item.highLighter.moduleLevelThree">
                  {{item.highLighter.moduleLevelThree}}
                </span>
              </span>
              <span v-if="item.data.moduleLevelFour !== ''">
                /
                <span v-if="!item.highLighter.moduleLevelFour">
                  {{item.data.moduleLevelFour}}
                </span>
                <span v-else v-html="item.highLighter.moduleLevelFour">
                  {{item.highLighter.moduleLevelFour}}
                </span>
              </span>
              <span v-if="item.data.moduleLevelFive !== ''">
                /
                <span v-if="!item.highLighter.moduleLevelFive">
                  {{item.data.moduleLevelFive}}
                </span>
                <span v-else v-html="item.highLighter.moduleLevelFive">
                  {{item.highLighter.moduleLevelFive}}
                </span>
              </span>
            </p>
            <p v-if="!item.highLighter.initializeCondition">预置条件:{{item.data.initializeCondition}}</p>
            <p v-else>预置条件:<span v-html="item.highLighter.initializeCondition">{{item.highLighter.initializeCondition}}</span></p>
            <p v-if="!item.highLighter.testStep">测试步骤:{{item.data.testStep}}</p>
            <p v-else>测试步骤:<span v-html="item.highLighter.testStep">{{item.highLighter.testStep}}</span></p>
            <p v-if="!item.highLighter.expectResult">预期结果:{{item.data.expectResult}}</p>
            <p v-else>预期结果:<span v-html="item.highLighter.expectResult">{{item.highLighter.expectResult}}</span></p>
            <el-button v-if="dialog" @click="chooseThis(item.data)" type="text">选择</el-button>
            <el-button @click="checkDetails(item.data)" type="text">查看详情</el-button>
            <span class="prioritySpan">优先级:
              <span class="colorPriorty1" v-if="item.data.priority === '1'">{{$getDictLabel("priority", item.data.priority)}}</span>
              <span class="colorPriorty2" v-if="item.data.priority === '2'">{{$getDictLabel("priority", item.data.priority)}}</span>
              <span class="colorPriorty3" v-if="item.data.priority === '3'">{{$getDictLabel("priority", item.data.priority)}}</span>
            </span>
          </div>
        </div>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"></el-pagination>
      </el-col>
      <el-col :span="!dialog ? 18 : 24" v-if="recommended && !userBlor">
        <div class="smartDiv" v-for="(item, i) in recommeList" :key="i+1">
          <h4>{{item.caseName}}</h4>
          <p>
            <span v-if="item.moduleLevelOne !== ''">{{item.moduleLevelOne}}</span>
            <span v-if="item.moduleLevelTwo !== ''">/{{item.moduleLevelTwo}}</span>
            <span v-if="item.moduleLevelThree !== ''">/{{item.moduleLevelThree}}</span>
            <span v-if="item.moduleLevelFour !== ''">/{{item.moduleLevelFour}}</span>
            <span v-if="item.moduleLevelFive !== ''">/{{item.moduleLevelFive}}</span>
          </p>
          <P>简介:
            <span>
              {{item.testStep}}
            </span>
          </P>
          <el-button v-if="dialog" @click="chooseThis(item)" type="text">选择</el-button>
          <el-button @click="checkDetails(item)" type="text">查看详情</el-button>
        </div>
      </el-col>
      <el-col class="divider" :span="6" v-if="!dialog">
        <h2>热门搜索<el-button size="mini" type="text" style="float: right;" @click="bathSouth()" icon="el-icon-refresh">换一批</el-button>
        </h2>
        <p class="numDomo" v-for="(item, i) in hotPulList" :key="i" @click="hotDamo(item)">
          <span :class="numCss[i]" style="width: 22px;text-align: center;box-sizing: border-box;">{{ i + 1 }}</span>
          <el-button type="text">{{item.keyword | ellipsis}}</el-button>
          <span class="hotNum">
            <span style="color: red;background-color: white" v-if="i <= 2">HOT</span>
            {{item.counts}}次
          </span>
        </p>
      </el-col>
    </el-row>
    <add-or-update-case ref="addOrUpdateCase" :visible.sync="addOrUpdateCase" @watchChildPage="triggerParentMethod"></add-or-update-case>
  </div>
</template>
<script>
import AddOrUpdateCase from '@/components/common/case/add-or-update-case'
export default {
  name: 'CtcAssociatedSearch',
  components: {
    AddOrUpdateCase
  },
  props: {
    'toSearch': Object, // 回填对象集
    'dialog': Boolean // 是否为弹窗
  },
  filters: {
    // 过滤器,热门的字数长度,可复用
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 10) {
        return value.slice(0, 10) + '...'
      }
      return value
    }
  },
  data () {
    return {
      relatedContent: '',
      options: [], // 全局搜索下拉框内容
      list: [],
      cookieLoading: false,
      loading: false,
      detailsVisible: false, // 详情弹窗
      restaurants: [],
      timeout: null,
      page: 1, // 当前页码
      limit: 10, // 每页数
      total: 0, // 总条数
      seniorOff: false,
      recommended: true, // 为你推荐判断
      userBlor: false, // 基于用户行为反馈数据无效
      recommeList: [], // 智能搜索列表
      addOrUpdateCase: false, // 弹窗
      seniorFrom: this.$props.toSearch || {
        caseType: '',
        caseCode: '',
        caseName: '',
        testType: '',
        priority: ''
      }, // 高级搜索
      numCss: [
        'num0', 'num1', 'num2'
      ],
      states: [],
      hotList: [],
      hotIndex: 0,
      hotPulList: [],
      relatedList: []
    }
  },
  mounted () {
    // this.guideSearch()
    if (!sessionStorage.getItem('hotList')) {
      this.getHot()
    } else {
      // 将字符串转为json对象
      this.switchState()
    }
    // 判断是否存在session
    if (!sessionStorage.getItem('recommended')) {
      this.getRecommended()
    } else {
      // 将字符串转为json对象
      this.recommeList = JSON.parse(sessionStorage.getItem('recommended'))
    }
  },
  activated () {
    // 判断是否存在session
    if (!sessionStorage.getItem('hotList')) {
      this.getHot()
    } else {
      // 将字符串转为json对象
      this.switchState()
    }
    // 判断是否存在session
    if (!sessionStorage.getItem('recommended')) {
      this.getRecommended()
    } else {
      // 将字符串转为json对象
      this.recommeList = JSON.parse(sessionStorage.getItem('recommended'))
    }
  },
  methods: {
    triggerParentMethod (message) {
      if (message.type === 'reloadTable') {
        this.getProjectCase()
      }
    },
    getProjectCase () {
      this.$ctcLoading.open()
      let params = { ...this.dataForm, ...this.projectData }
      this.$http.get('/ctc/exec/case/pageCaseInfoByTask', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.caseTableData = res.data.list
          this.total = res.data.total
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    // 打开详情
    checkDetails (item) {
      console.log(item)
      // 查看用例
      this.$refs.addOrUpdateCase.dataForm.pathPageName = '智能用例搜索'
      this.$refs.addOrUpdateCase.dataForm.caseId = item.caseId
      this.$refs.addOrUpdateCase.dataForm.taskId = item.taskId
      this.$refs.addOrUpdateCase.dataForm.readOnly = 1 // 0:编辑模式;1:只读模式
      this.$refs.addOrUpdateCase.init()
    },
    // 选择查询出的项目
    chooseThis (item) {
      // 回传整个选择信息
      item.caseId = ''
      item.taskId = ''
      item.moduleLevelOne = ''
      item.moduleLevelTwo = ''
      item.moduleLevelThree = ''
      item.moduleLevelFour = ''
      item.moduleLevelFive = ''
      this.$emit('valueItem', item)
    },
    // 高级搜索
    seniorSearch () {
      this.seniorOff = !this.seniorOff
    },
    openSon (bule) {
      if (!bule) {
        this.seniorFrom = {
          caseType: '',
          caseCode: '',
          caseName: '',
          testType: '',
          priority: ''
        }
      }
      this.seniorOff = bule
    },
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.query() // 请求搜索数据
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.query()
    },
    // 数组分割
    groupList (array, subGroupLength) {
      let index = 0
      let newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength))
      }
      return newArray
    },
    // 切换状态
    switchState () {
      this.hotList = JSON.parse(sessionStorage.getItem('hotList'))
      this.hotList = this.groupList(this.hotList, 10)
      this.hotPulList = this.hotList[this.hotIndex]
    },
    // 换一批
    bathSouth () {
      this.hotIndex++
      if (this.hotIndex === 3) {
        this.hotIndex = 0
      }
      this.switchState()
    },
    query () {
      var params = {
        highlighterFlag: true,
        fullTextSearchKeyword: this.relatedContent,
        fieldKeyword: []
      }
      for (let index = 0; index < Object.keys(this.seniorFrom).length; index++) {
        if (Object.values(this.seniorFrom)[index] !== '') {
          var obj = {}
          obj.fieldName = Object.keys(this.seniorFrom)[index]
          obj.fieldSearchKeyword = Object.values(this.seniorFrom)[index]
          obj.searchType = '2'
          params.fieldKeyword.push(obj)
        }
      }
      if (!this.seniorOff) {
        params.fieldKeyword = []
      }
      params.pageNum = this.page
      params.pageSize = this.limit
      this.$http.post(`/aicenter/searchApi/search`, params).then(({ data: res }) => {
        if (res.code !== 0) {
          this.recommended = true
          if (!sessionStorage.getItem('recommended')) {
            this.getRecommended()
          } else {
            // 将字符串转为json对象
            this.recommeList = JSON.parse(sessionStorage.getItem('recommended'))
          }
          return this.$message.error(res.msg)
        }
        this.loading = false
        this.total = res.data.total
        this.relatedList = res.data.rows
        this.recommended = false
      }).catch(() => { })
    },
    // 添加用例查看次数
    setCase (caseId) {
      var params = {
        userOperateCaseList: [
          {
            caseId: caseId,
            operateTime: '2020-07-23 14:54:09' || null,
            operateType: 1,
            userId: this.$store.state.user.id
          }
        ]
      }
      this.$http.post(`/ctc/servicebus/api/v1.0/standard/case/pushCount/${caseId}`, params).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
      }).catch(() => { })
    },
    // 搜索
    searchTo () {
      if (this.relatedContent === '') {
        this.recommended = true
        this.$message.error('搜索条件不能为空')
        return
      }
      this.loading = true
      this.page = 1
      var params = {
        highlighterFlag: true,
        fullTextSearchKeyword: this.relatedContent,
        fieldKeyword: []
      }
      for (let index = 0; index < Object.keys(this.seniorFrom).length; index++) {
        if (Object.values(this.seniorFrom)[index] !== '') {
          var obj = {}
          obj.fieldName = Object.keys(this.seniorFrom)[index]
          obj.fieldSearchKeyword = Object.values(this.seniorFrom)[index]
          obj.searchType = '2'
          params.fieldKeyword.push(obj)
        }
      }
      if (!this.seniorOff) {
        params.fieldKeyword = []
      }
      this.query()
    },
    // 热门搜索
    getHot () {
      this.$http.get(`/aicenter/searchApi/hotKey?size=30`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        let list = JSON.stringify(res.data)
        sessionStorage.setItem('hotList', [list])
        this.switchState()
      }).catch(() => { })
    },
    // 推荐
    getRecommended () {
      this.cookieLoading = true
      this.$http.get(`/aicenter/recommendApi/recommendDetailByUserId?userId=${this.$store.state.user.id}`).then(({ data: res }) => {
        this.recommended = true
        if (res.code !== 0) {
          this.cookieLoading = false
          this.userBlor = true
          return this.$message.error(res.msg)
        }
        let list = JSON.stringify(res.data.rows)
        sessionStorage.setItem('recommended', [list])
        this.recommeList = res.data.rows
        this.cookieLoading = false
      }).catch(() => { })
    },
    // 点击热门搜索
    hotDamo (item) {
      this.relatedContent = ''
      this.seniorFrom = {
        caseType: '',
        caseCode: '',
        caseName: '',
        testType: '',
        priority: ''
      }
      this.seniorOff = false
      this.relatedContent = item.keyword
      this.searchTo()
    },
    // 搜索两种方式
    // 请求引导搜索数据
    guideSearch () {
      this.$http.get(`/aicenter/searchApi/associateKey?associateKey=${this.relatedContent}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.restaurants = this.loadAll(res.data)
      }).catch(() => { })
    },
    // 不防抖（已修复，防抖）
    querySearchAsync (queryString, cb) {
      if (this.queryString === '') {
        this.relatedContent = []
        return
      }
      this.guideSearch()
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(this.restaurants)
      }, 1000 * Math.random())
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll (data) {
      if (data) {
        var objData = []
        for (let index = 0; index < data.length; index++) {
          objData.push({ value: data[index], address: data[index] })
        }
        return objData
      } else {
        return '暂无数据'
      }
    },
    handleSelect (item) {
      console.log(item)
    },
    handleIconClick (ev) {
      this.relatedContent = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.associatedModule {
  margin: 50px;
}
// .top {
//   position: -webkit-sticky;
//   position: sticky;
//   top: 0;
// }
.el-autocomplete > .el-input--default {
  width: 100%;
  height: 70px;
}
.numDomo {
  color: white;
}
.prioritySpan {
  float: right;
  // color: #4190f7;
  line-height: 40px;
}
.prioritySpan .colorPriorty1 {
  color: #f54545;
}
.prioritySpan .colorPriorty2 {
  color: #ff8547;
}
.prioritySpan .colorPriorty3 {
  color: #909399;
}
.numDomo .hotNum {
  float: right;
  height: 100%;
  line-height: 45px;
  color: black;
  background-color: white;
}
.divider {
  border-left: 1px solid #f1f1f1;
}
.numDomo span {
  display: inline-block;
  padding: 0 4px;
  background-color: #4190f7;
}
.numDomo .rightSpan {
  width: 24px;
  text-align: center;
  box-sizing: border-box;
}
.numDomo .el-button {
  color: black;
}
.numDomo .num0 {
  background-color: #f54545;
}
.numDomo .num1,
.num2 {
  background-color: #ff8547;
}
.smartDiv {
  margin: 50px 0;
}
</style>
